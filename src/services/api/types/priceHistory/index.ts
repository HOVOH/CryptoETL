import TaLib from "../../../../technicalAnalysis/TaLib";
import PriceHistory from "../../../../prices/PriceHistory";

export const PriceHistoryGQLType = {
    monitor: (priceHistory: PriceHistory) => priceHistory.monitor,
    latest: (priceHistory: PriceHistory) => {
        return priceHistory.getLatest().candle;
    },
    candles: (priceHistory: PriceHistory) => priceHistory.history,
    time: (priceHistory: PriceHistory) => priceHistory.timeSeries.time,
    open: (priceHistory: PriceHistory) => priceHistory.timeSeries.open,
    high: (priceHistory: PriceHistory) => priceHistory.timeSeries.high,
    low: (priceHistory: PriceHistory) => priceHistory.timeSeries.low,
    close: (priceHistory: PriceHistory) => priceHistory.timeSeries.close,
    sma: async (priceHistory: PriceHistory, args: {window: number}) => await TaLib.sma(priceHistory.timeSeries.close, args.window),

}
