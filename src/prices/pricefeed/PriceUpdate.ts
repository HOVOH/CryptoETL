import {IPair} from "../../blockchains/Pair";
import IPlatform from "../../platforms/Platform";

export interface IKLine {
    timestamp: number,
    open: number,
    high: number,
    low: number,
    close: number,
    volume: number,
}

export interface IPriceUpdate extends IKLine {
    timestamp: number,
    pair: IPair,
    open: number,
    close: number,
    low: number,
    high: number,
    volume: number,
    takerBaseAssetVolume: number,
    tradeQt: number,
    isClose: boolean,
    startTime: number,
    endTime: number,
    origin: IPlatform,
    interval: number,
}

class PriceUpdate implements IPriceUpdate{
    readonly timestamp: number;
    readonly close: number;
    readonly high: number;
    readonly isClose: boolean;
    readonly startTime: number;
    readonly endTime: number;
    readonly low: number;
    readonly open: number;
    readonly origin: IPlatform;
    readonly pair: IPair;
    readonly volume: number;
    readonly takerBaseAssetVolume: number;
    readonly tradeQt: number;
    readonly interval: number;

    constructor(currentTime: number,
                pair: IPair,
                open: number,
                high: number,
                low: number,
                close:number,
                volume: number,
                takerBaseAssetVolume: number,
                tradeQt: number,
                isClose: boolean,
                startTime: number,
                endTime: number,
                interval: number,
                origin: IPlatform) {
        this.timestamp = currentTime;
        this.pair = pair;
        this.open = open;
        this.high = high;
        this.low = low;
        this.close = close;
        this.volume = volume;
        this.takerBaseAssetVolume = takerBaseAssetVolume;
        this.tradeQt = tradeQt;
        this.isClose = isClose;
        this.startTime = startTime;
        this.endTime = endTime;
        this.interval = interval;
        this.origin = origin;
    }
}

export default PriceUpdate;

