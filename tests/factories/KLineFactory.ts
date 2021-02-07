import KLine, {IKLine} from "../../src/prices/KLine";
import {between, over, under} from "./utils";

export const klineFactory = (quantity: number, interval: number)=> {
    const candles = [ newKline() ];
    for(let i = 1; i < quantity; i++){
        candles.unshift(nextKlineFactory(candles[0], interval));
    }
    return candles;
}

export const newKline = () => {
    const open = between(10,20);
    const low = between(open*0.3, open);
    const high = between(open, open * 1.5);
    const close = open * between(0.5,1.5);
    const volume = between(100,1500);
    const takerVolume = under(volume);
    const tradeQt = between(10,200);
    return new KLine(
        1612492002000,
        open,
        high,
        low,
        close,
        volume,
        takerVolume,
        tradeQt,
        true,
    )
}

export const nextKlineFactory = (kline: IKLine, interval: number) => {
    const open = kline.close;
    const low = between(open/3, open);
    const high = between(open, open * 1.5);
    const close = open * between(0.5, 1.5);
    const volume = between(100,1500);
    const takerVolume = under(volume);
    const tradeQt = between(10,200);
    return new KLine(
        kline.time+interval*60000,
        open,
        high,
        low,
        close,
        volume,
        takerVolume,
        tradeQt,
        true,
    )
}

