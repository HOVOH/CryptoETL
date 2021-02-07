import {IKLine} from "../prices/KLine";

type ISeries<T> = {
    [k in keyof T]: number[];
}

export class TimeSeries implements ISeries<IKLine>{
    close: number[] = [];
    high: number[] = [];
    low: number[] = [];
    open: number[] = [];
    volume: number[] = [];
    isClose: number[];
    takerBaseAssetVolume: number[] = [];
    time: number[] = [];
    tradeQt: number[] = [];

    push(kline: IKLine){
        this.pushAll(Object.getOwnPropertyNames(this), kline)
    }

    private pushAll(names: string[], kline: IKLine){
        names.forEach(name => this._push(name, kline));
    }

    private _push(name:string, kline:IKLine){
        this[name].push(kline[name]);
    }

    shift(){
        Object.getOwnPropertyNames(this).forEach(name => this._shift(name));
    }

    private _shift(name: string){
        this[name].shift()
    }

    replaceLatest(candle: IKLine){
        Object.getOwnPropertyNames(this)
            .forEach(name => this[name][this[name].length - 1] = candle[name]);
    }

    length(): number {
        return this.time.length;
    }
}
