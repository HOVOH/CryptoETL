import {IPriceUpdate} from "./pricefeed/PriceUpdate";
import {main as TimeSeries} from "timeseries-analysis";

export interface IPriceHistory {
    getLatest(): IPriceUpdate,
    getLatestPrices(n: number): IPriceUpdate[],
    push(priceUpdate: IPriceUpdate): void,
}

export default class PriceHistory implements IPriceHistory{
    history: IPriceUpdate[];
    max: number;
    series: TimeSeries;

    constructor(maxSize: number) {
        this.max = maxSize;
        this.history = [];
    }

    private getHistory(){
        return this.history;
    }

    getLatestPrices(n: number): IPriceUpdate[] {
        return this.getHistory().slice(0, n);
    }

    getLatest(): IPriceUpdate {
        return this.getHistory()[0];
    }

    push(priceUpdate: IPriceUpdate): void {
        if (this.getHistory().length > 0){
            if (this.getHistory()[0].isClose){
                this.getHistory().unshift(priceUpdate);
                if (this.getHistory().length > this.max){
                    this.getHistory().pop();
                }
            } else {
                this.getHistory()[0] = priceUpdate;
            }
        } else {
            this.getHistory().push(priceUpdate);
        }
    }
}
