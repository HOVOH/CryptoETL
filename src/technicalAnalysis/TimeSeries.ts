import {IKLine} from "../prices/pricefeed/PriceUpdate";

type ISeries<T> = {
    [k in keyof T]: number[];
}

export class TimeSeries implements ISeries<IKLine>{

    timestamp: number[] = [];
    close: number[] = [];
    high: number[] = [];
    low: number[] = [];
    open: number[] = [];
    volume: number[] = [];

    constructor() {

    }

    append(kline: IKLine){
        this.pushAll(Object.getOwnPropertyNames(this), kline)
    }

    private pushAll(names: string[], kline: IKLine){
        names.forEach(name => this.push(name, kline));
    }

    private push(name:string, kline:IKLine){
        this[name].push(kline[name]);
    }

    length(): number {
        return this.timestamp.length;
    }
}
