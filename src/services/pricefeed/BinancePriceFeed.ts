import SimplePriceFeed from "../../prices/SimplePriceFeed";
import {IPair} from "../../blockchains/Pair";
import binance from "../../platforms/Binance";
import PriceUpdate from "../../prices/PriceUpdate";
import KLine from "../../prices/KLine";
import Monitor from "../../prices/Monitor";
import {moneyConvert, MoneyUnits} from "../../utils/dollars";

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
                x: isFinal,
                V: takerBaseAssetVolume,
                n: tradeQt,

            } = ticks;
            const kline = new KLine(
                currentTime,
                moneyConvert(open, MoneyUnits.DOLLARS, MoneyUnits.BASE),
                moneyConvert(high, MoneyUnits.DOLLARS, MoneyUnits.BASE),
                moneyConvert(low, MoneyUnits.DOLLARS, MoneyUnits.BASE),
                moneyConvert(close, MoneyUnits.DOLLARS, MoneyUnits.BASE),
                moneyConvert(volume, MoneyUnits.DOLLARS, MoneyUnits.BASE),
                moneyConvert(takerBaseAssetVolume, MoneyUnits.DOLLARS, MoneyUnits.BASE),
                tradeQt,
                isFinal
            );
            this.emit(new PriceUpdate(kline, new Monitor(pair, this.platform, interval)));
        });
    }
}

export default BinancePriceFeed;
