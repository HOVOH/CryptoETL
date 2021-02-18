import PriceUpdate, {IPriceUpdate} from "./PriceUpdate";
import PriceFeedAggregator from "../services/pricefeed/PriceFeedAggregator";
import {IKLine} from "./KLine";
import Monitor, {IMonitor} from "./Monitor";
import {TimeSeries} from "../technicalAnalysis/TimeSeries";
import Database from "../services/database/Database";
import {intervalToTime, timeOfCandleStart} from "../utils/timeUtils";
import {BatchPipeline, UnitPipeline} from "../pipeline/Pipeline";
import KLineValidatorPipe from "./pipeline/KLineValidatorPipe";
import KLinesConverter from "./pipeline/KLinesConverter";
import KlineArrayValidator from "./pipeline/KlineArrayValidator";
import EventEmitter from "events";

export interface IPriceHistory {
    getLatest(): IPriceUpdate,
    getLatestPrices(n: number): IPriceHistory,
    add(kline: IKLine): void,
}

export default class PriceHistory implements IPriceHistory{
    static EVENT_NAME:string = "PRICE_UPDATE"
    history: IKLine[];
    timeSeries: TimeSeries;
    monitor: IMonitor;
    max: number;
    priceFeed: PriceFeedAggregator;
    unsubscribe?: () => void;
    readonly eventEmitter = new EventEmitter();
    newDataPipeline: UnitPipeline<IKLine, IKLine> = null;
    private lastActions: { type: "insertNewest"|"removeOldest"|"replaceNewest", kline: IKLine }[];

    constructor(maxSize: number, history: IKLine[] = [], monitor: Monitor) {
        this.max = maxSize;
        this.history = history;
        this.monitor = monitor;
        this.timeSeries = new TimeSeries();
        this.history.forEach(candle => this.timeSeries.addNewest(candle));
    }

    static async fromDataSource(maxSize: number, monitor: IMonitor, priceFeed: PriceFeedAggregator, database: Database): Promise<PriceHistory>{
        const history = await this.loadData(monitor, maxSize, database)
        const priceHistory = new PriceHistory(maxSize, history, monitor);
        priceHistory.unsubscribe = priceFeed.subscribeLive(monitor.pair, monitor.interval, monitor.platform, (pu) => priceHistory.handlePriceUpdate(pu));
        priceHistory.newDataPipeline = new UnitPipeline<IKLine, IKLine>([
            new KLineValidatorPipe(),
            new KlineArrayValidator(1),
        ]);
        return priceHistory;
    }

    private static async loadData(monitor: IMonitor, nCandles: number, source:Database): Promise<IKLine[]>{
        const monitor1m = await source.monitors.findOne({
            pair: monitor.pair,
            platform: { name: monitor.platform.name},
            interval: 1,
        })
        const now = Date.now();
        const klines = await source.klines.find(now-intervalToTime(nCandles*monitor.interval), now, monitor1m);
        const pipeline = this.createPipeline(monitor);
        return pipeline.process(klines);
    }

    private static createPipeline(monitor: IMonitor): BatchPipeline<IKLine, IKLine>{
        return new BatchPipeline<IKLine, IKLine>([
            new KLineValidatorPipe(),
            new KlineArrayValidator(1),
            new KLinesConverter(1, monitor.interval),
            new KlineArrayValidator(monitor.interval)
        ]);
    }

    async handlePriceUpdate(priceUpdate: IPriceUpdate) {
        try{
            this.add(priceUpdate.candle);
            await this.newDataPipeline.processUnit(this.history, 0);
            this.eventEmitter.emit(PriceHistory.EVENT_NAME, this);
        } catch (dataError){
            console.log("Error with ", priceUpdate.candle);
            this.revertLastAdd();
        }
    }

    revertLastAdd(){
        for (let i = this.lastActions.length -1; i >=0; i--){
            const action = this.lastActions[i];
            if (action.type === "removeOldest") {
                this.addOldest(action.kline);
            } else if(action.type === "replaceNewest"){
                this.replaceNewest(action.kline);
            } else if(action.type === "insertNewest") {
                this.removeNewest();
            }
        }
    }

    subscribe(callback: (PriceHistory)=>void){
        this.eventEmitter.on(PriceHistory.EVENT_NAME, callback);
    }

    private getHistory(){
        return this.history;
    }

    getLatestPrices(n: number): PriceHistory {
        return new PriceHistory(n, this.getHistory().slice(0, n), this.monitor);
    }

    getLatest(): IPriceUpdate {
        return new PriceUpdate(this.getHistory()[0], this.monitor);
    }

    add(ikline: IKLine): void {
        if (this.getHistory().length > 0){
            if (this.getHistory()[0].isClose){
                this.insertNew(ikline);
                if (this.getHistory().length > this.max){
                    this.removeOldest();
                }
            } else {
                this.replaceNewest(ikline)
            }
        } else {
            this.insertNew(ikline);
        }
    }

    private insertNew(candle: IKLine){
        this.lastActions.push({
            type: "insertNewest",
            kline: null,
        });
        this.getHistory().unshift(candle);
        this.timeSeries.addNewest(candle);
    }

    private removeOldest(){
        this.lastActions.push({
            type: "removeOldest",
            kline: this.getHistory().pop(),
        })
        this.timeSeries.removeOldest();
    }

    private addOldest(candle: IKLine){
        this.getHistory().push(candle);
        this.timeSeries.addOldest(candle);
    }

    private removeNewest(){
        this.getHistory().shift();
        this.timeSeries.removeNewest();
    }

    private replaceNewest(candle:IKLine){
        this.lastActions.push({
            type: "replaceNewest",
            kline: this.getHistory()[0],
        });
        this.getHistory()[0] = candle;
        this.timeSeries.replaceNewest(candle);
    }
}
