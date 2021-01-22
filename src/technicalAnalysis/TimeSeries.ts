import {IKLine} from "../prices/pricefeed/KLine";

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

    unshift(kline: IKLine){
        this.unshiftAll(Object.getOwnPropertyNames(this), kline)
    }

    private unshiftAll(names: string[], kline: IKLine){
        names.forEach(name => this._unshift(name, kline));
    }

    private _unshift(name:string, kline:IKLine){
        this[name].unshift(kline[name]);
    }

    pop(){
        Object.getOwnPropertyNames(this).forEach(name => this._pop(name));
    }

    private _pop(name: string){
        this[name].pop()
    }

    replace(index: number, candle: IKLine){
        Object.getOwnPropertyNames(this)
            .forEach(name => this[name][index] = candle[name]);
    }

    length(): number {
        return this.time.length;
    }
}
