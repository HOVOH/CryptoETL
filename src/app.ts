import PriceFeedAggregator from "./prices/pricefeed/PriceFeedAggregator";
import BinancePriceFeed from "./prices/pricefeed/BinancePriceFeed";
import {Pair} from "./blockchains/Pair";
import {ETH} from "./blockchains/ethereum/ETH";
import {USDT} from "./blockchains/ethereum/USDT";
import binance from "./platforms/Binance";
import PriceHistory from "./prices/PriceHistory";
import TaLib from "./technicalAnalysis/TaLib";
import {API} from "./api/API";

const priceFeedAggregator = new PriceFeedAggregator();
priceFeedAggregator.registerPriceFeed(new BinancePriceFeed());

API.bootstrap(priceFeedAggregator).then(() => {
    API.start().then(r => console.log("API started on "+r.url));
});


const marketData = {
    close: [ 0.1,0.2,0.1,0.2],
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

