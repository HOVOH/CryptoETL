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

    static merge(candle: IKLine, newest:IKLine){
        if (candle.time > newest.time){
            throw new Error("Earliest is older than oldest");
        }
        return new KLine(
            candle.time,
            candle.open,
            Math.max(candle.high, newest.high),
            Math.min(candle.low, newest.low),
            newest.close,
            candle.volume+newest.volume,
            candle.takerBaseAssetVolume+newest.takerBaseAssetVolume,
            candle.tradeQt+newest.tradeQt,
            newest.isClose,
        );
    }
}

export default KLine;
