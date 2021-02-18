import {expect} from "chai"
import PriceHistory from "../src/prices/PriceHistory";
import {klineFactory, newKline, nextKlineFactory} from "./factories/KLineFactory";
import {monitorFactory} from "./factories/MonitorFactory";
import {priceHistoryFactory} from "./factories/PriceHistoryFactory";

describe("PriceHistory", () => {
    it("Kline should be ordered from newest to oldest", () => {
        const monitor = monitorFactory();
        const ph = new PriceHistory(2, klineFactory(1, monitor.interval), monitor);
        const candle = nextKlineFactory(ph.getLatest().candle, monitor.interval);
        ph.add(candle);
        expect(ph.history.length).eq(2);
        expect(ph.history[0].time).gt(ph.history[1].time);;
    })

    it("PriceSeries should be ordered from oldest to newest", () => {
        const monitor = monitorFactory();
        const ph:PriceHistory = new PriceHistory(2, klineFactory(1, monitor.interval), monitor);
        const pu = nextKlineFactory(ph.getLatest().candle, monitor.interval);
        ph.add(pu);
        expect(ph.timeSeries.open.length).eq(2);
        expect(ph.timeSeries.time[0]).lt(pu.time);
    })

    it("pu should replace candle if open", () => {
        const monitor = monitorFactory();
        const ph = new PriceHistory(2, [], monitor);
        const candle = newKline();
        candle.isClose = false;
        ph.add(candle);
        const candle2 = nextKlineFactory(candle, monitor.interval);
        ph.add(candle2);
        expect(ph.history.length).eq(1);
        expect(ph.history[0]).deep.eq(candle2);
        expect(ph.timeSeries.open[0]).eq(candle2.open);
    })

    it("Should discard oldest data when full", () =>{
        const ph = priceHistoryFactory(5);
        const candle = nextKlineFactory(ph.getLatest().candle, ph.monitor.interval);
        const oldest = ph.history[4];
        const timeSeriesOldestOpen = ph.timeSeries.open[0];
        ph.add(candle);
        expect(ph.history.length).eq(5);
        expect(ph.history[4]).not.eq(oldest);
        expect(ph.timeSeries.open[0]).not.eq(timeSeriesOldestOpen)
    })
})
