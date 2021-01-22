import SimplePriceFeed from "./SimplePriceFeed";
import {IPair} from "../../blockchains/Pair";
import binance from "../../platforms/Binance";
import PriceUpdate from "./PriceUpdate";
import KLine from "./KLine";
import Monitor from "../Monitor";

class BinancePriceFeed extends SimplePriceFeed{

    constructor() {
        super(binance);
    }

    registerListener = (pair: IPair, interval: number): void => {
        const ticker = pair.token0.ticker+pair.token1.ticker;
        const intervalLabel = this.intervalToLabel(interval);
        binance.api.websockets.candlesticks([ticker], intervalLabel, (candlesticks) => {
            let { k:ticks, E: currentTime } = candlesticks;
            let {
                o: open,
                h: high,
                l: low,
                c: close,
                v: volume,
                t: start,
                T: end,
                x: isFinal,
                V: takerBaseAssetVolume,
                n: tradeQt,

            } = ticks;
            const kline = new KLine(
                currentTime,
                open,
                high,
                low,
                close,
                volume,
                takerBaseAssetVolume,
                tradeQt,
                isFinal
            );
            this.emit(new PriceUpdate(kline, new Monitor(pair, this.platform, interval)));
        });
    }
}

export default BinancePriceFeed;
