import {Pair} from "../../../blockchains/Pair";
import binance from "../../../platforms/Binance";
import {IAPIContext} from "../API";
import {Subscription} from "../Subscription";
import PriceHistory from "../../../prices/PriceHistory";
import Monitor from "../../../prices/Monitor";
import Database from "../../database/Database";
import PriceFeedAggregator from "../../pricefeed/PriceFeedAggregator";

export default class PriceHistorySubscripton extends Subscription{

    unsubscribeCallback: () => void;
    database: Database;
    pricefeedAggregator: PriceFeedAggregator;

    constructor(database: Database, priceAggregator: PriceFeedAggregator) {
        super();
        this.database = database;
        this.pricefeedAggregator = priceAggregator;
    }

    onSubscribe = async (_, args, context) => {
        const pair = Pair.fromTickers(args.token0, args.token1);
        const priceHistory = await PriceHistory.fromDataSource(5, new Monitor(pair, binance, args.interval), this.pricefeedAggregator, this.database);
        this.unsubscribeCallback = priceHistory.subscribe((ph: PriceHistory)=>{
            this.getPubSub().publish(this.getSubscriptionName(args), {priceHistory: ph})
        });
    }

    unsubscribe(_, args, context: IAPIContext) {
        this.unsubscribeCallback();
    }
}