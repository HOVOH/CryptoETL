import PriceFeedAggregator from "./prices/pricefeed/PriceFeedAggregator";
import BinancePriceFeed from "./prices/pricefeed/BinancePriceFeed";
import {Pair} from "./blockchains/Pair";
import {ETH} from "./blockchains/ethereum/ETH";
import {USDT} from "./blockchains/ethereum/USDT";
import binance from "./platforms/Binance";
import PriceHistory from "./prices/PriceHistory";

const priceFeedAggregator = new PriceFeedAggregator();
priceFeedAggregator.registerPriceFeed(new BinancePriceFeed());

const priceHistory = new PriceHistory(10);

priceFeedAggregator.subscribeLive(new Pair(ETH, USDT),1, binance, pu => {
    priceHistory.push(pu);
    console.log(priceHistory.history.map(pu => ({close: pu.isClose, price: pu.close})));
})
