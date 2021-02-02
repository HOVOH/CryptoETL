import PriceUpdate, {IPriceUpdate} from "./PriceUpdate";
import PriceFeedAggregator from "../services/pricefeed/PriceFeedAggregator";
import {IKLine} from "./KLine";
import {IMonitor} from "./Monitor";
import {TimeSeries} from "../technicalAnalysis/TimeSeries";
import {batchCandleJSON} from "candlestick-convert";
import Database from "../services/database/Database";
import {intervalToTime} from "../utils/timeUtils";
import Pipeline from "../pipeline/Pipeline";
import KLineValidatorPipe from "./pipeline/KLineValidatorPipe";
import KLinesConverter from "./pipeline/KLinesConverter";
import KlineArrayValidator from "./pipeline/KlineArrayValidator";

export interface IPriceHistory {
    getLatest(): IPriceUpdate,
    getLatestPrices(n: number): IPriceHistory,
    add(priceUpdate: IPriceUpdate): void,
}

export default class PriceHistory implements IPriceHistory{
    history: IKLine[];
    timeSeries: TimeSeries;
    monitor: IMonitor;
    max: number;
    priceFeed: PriceFeedAggregator;
    unsubscribe?: () => void;

    constructor(maxSize: number, history: IKLine[] = []) {
        this.max = maxSize;
        this.history = history;
        this.timeSeries = new TimeSeries();
        this.history.forEach(candle => this.timeSeries.unshift(candle));
    }

    static async fromDataSource(maxSize: number, monitor: IMonitor, priceFeed: PriceFeedAggregator, database: Database): Promise<PriceHistory>{
        const history = await this.loadData(monitor, maxSize*monitor.interval, database)
        const priceHistory = new PriceHistory(maxSize, history);
        priceHistory.unsubscribe = priceFeed.subscribeLive(monitor.pair, monitor.interval, monitor.platform, priceHistory.add.bind(priceHistory));
        return priceHistory;
    }

    private static async loadData(monitor: IMonitor, since: number, source:Database): Promise<IKLine[]>{
        const monitor1m = await source.monitors.findOne({
            pair: monitor.pair,
            platform: { name: monitor.platform.name},
            interval: 1,
        })
        const now = Date.now();
        const klines = await source.klines.find(now-intervalToTime(since), now, monitor1m);
        const pipeline = this.createPipeline(monitor);
        return pipeline.process(klines);

    }

    private static createPipeline(monitor: IMonitor): Pipeline<IKLine, IKLine>{
        const pipeline = new Pipeline<IKLine, IKLine>();
        pipeline.append(new KLineValidatorPipe());
        pipeline.append(new KLinesConverter(1, monitor.interval));
        pipeline.append(new KlineArrayValidator(monitor.interval));
        return pipeline;
    }

    private getHistory(){
        return this.history;
    }

    getLatestPrices(n: number): PriceHistory {
        return new PriceHistory(n, this.getHistory().slice(0, n));
    }

    getLatest(): IPriceUpdate {
        return new PriceUpdate(this.getHistory()[0], this.monitor);
    }

    add(priceUpdate: IPriceUpdate): void {
        if (this.getHistory().length > 0){
            if (this.getHistory()[0].isClose){
                this.unshift(priceUpdate.candle);
                if (this.getHistory().length > this.max){
                    this.pop();
                }
            } else {
                this.replaceLast(priceUpdate.candle)
            }
        } else {
            this.unshift(priceUpdate.candle);
        }
    }

    private unshift(candle: IKLine){
        this.getHistory().unshift(candle);
        this.timeSeries.unshift(candle);
    }

    private pop(){
        this.getHistory().pop();
        this.timeSeries.pop();
    }

    private replaceLast(candle:IKLine){
        this.getHistory()[0] = candle;
        this.timeSeries.replace(0, candle);
    }
}
