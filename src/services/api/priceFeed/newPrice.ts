import {Pair} from "../../../blockchains/Pair";
import binance from "../../../platforms/Binance";
import {API, IAPIContext} from "../API";
import {Subscription} from "../Subscription";

export const NEW_PRICE_EVENT = "NEW_PRICE";

class NewPrice extends Subscription{

    unsubscribeCallback: () => void;

    onSubscribe = (_, args, context) => {
        const pair = Pair.fromTickers(args.token0, args.token1);
        this.unsubscribeCallback = API.priceFeedAggregator.subscribeLive(pair,1, binance, pu => {
            this.getPubSub().publish(this.getSubscriptionName(args), {newPrice: pu})
        })
    }

    unsubscribe(_, args, context: IAPIContext) {
        this.unsubscribeCallback();
    }
}

export const newPrice = new NewPrice();
