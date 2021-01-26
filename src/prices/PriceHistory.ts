import PriceUpdate, {IPriceUpdate} from "./pricefeed/PriceUpdate";
import PriceFeedAggregator from "./pricefeed/PriceFeedAggregator";
import {IKLine} from "./pricefeed/KLine";
import {IMonitor} from "./Monitor";
import {TimeSeries} from "../technicalAnalysis/TimeSeries";
import {batchCandleJSON} from "candlestick-convert";

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

    static fromDataSource(maxSize: number, monitor: IMonitor, priceFeed: PriceFeedAggregator): PriceHistory{
        const priceHistory = new PriceHistory(maxSize, this.loadData(monitor, null));
        priceHistory.unsubscribe = priceFeed.subscribeLive(monitor.pair, monitor.interval, monitor.platform, priceHistory.add.bind(priceHistory));
        return priceHistory;
    }

    private static loadData(monitor: IMonitor, source): IKLine[]{
        const candles: IKLine[] = [];
        return candles;

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
