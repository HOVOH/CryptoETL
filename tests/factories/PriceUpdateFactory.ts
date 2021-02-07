import Monitor from "../../src/prices/Monitor";
import {klineFactory} from "./KLineFactory";
import PriceUpdate from "../../src/prices/PriceUpdate";

export const priceUpdateFactory = (n: number, monitor: Monitor) => {
    return klineFactory(n, monitor.interval).map(kline => new PriceUpdate(kline, monitor));
}
