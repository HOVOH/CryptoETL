import PriceHistory from "../../src/prices/PriceHistory";
import {klineFactory} from "./KLineFactory";
import {monitorFactory} from "./MonitorFactory";

export const priceHistoryFactory = (size) => {
    const monitor = monitorFactory();
    return new PriceHistory(size, klineFactory(size, monitor.interval), monitor);
}
