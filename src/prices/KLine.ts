import {IOHLCV} from "candlestick-convert";

export interface IKLine extends IOHLCV{
    time: number,
    open: number,
    high: number,
    low: number,
    close: number,
    volume: number,
    takerBaseAssetVolume: number,
    tradeQt: number,
    isClose: boolean,
}

class KLine implements IKLine {
    close: number;
    high: number;
    low: number;
    open: number;
    takerBaseAssetVolume: number;
    time: number;
    tradeQt: number;
    volume: number;
    isClose: boolean;

    constructor(time: number,
                open: number,
                high: number,
                low: number,
                close:number,
                volume: number,
                takerBaseAssetVolume: number,
                tradeQt: number,
                isClose: boolean,) {
        this.time = time;
        this.open = open;
        this.high = high;
        this.low = low;
        this.close = close;
        this.volume = volume;
        this.takerBaseAssetVolume = takerBaseAssetVolume;
        this.tradeQt = tradeQt;
        this.isClose = isClose;
    }
}

export default KLine;
