import PriceFeedAggregator from "./prices/pricefeed/PriceFeedAggregator";
import BinancePriceFeed from "./prices/pricefeed/BinancePriceFeed";
import {Pair} from "./blockchains/Pair";
import {ETH} from "./blockchains/ethereum/ETH";
import {USDT} from "./blockchains/ethereum/USDT";
import binance from "./platforms/Binance";
import PriceHistory from "./prices/PriceHistory";
import TaLib from "./technicalAnalysis/TaLib";

const priceFeedAggregator = new PriceFeedAggregator();
priceFeedAggregator.registerPriceFeed(new BinancePriceFeed());

const priceHistory = new PriceHistory(10);

priceFeedAggregator.subscribeLive(new Pair(ETH, USDT),1, binance, pu => {
    priceHistory.push(pu);
    console.log(priceHistory.history.map(pu => ({close: pu.isClose, price: pu.close})));
})
const marketData = {
    close: [ 10,20,30,40],
    high: [12, 22,32, 42],
    low: [9, 9, 9, 9],
}

// Example use of TaLib
TaLib.execute({
    name: "SMA",
    startIdx: 0,
    endIdx: marketData.close.length - 1,
    inReal: marketData.close,
    optInTimePeriod: 2
}).then(result => console.log(result));

