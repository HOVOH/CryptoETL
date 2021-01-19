import {Resolver} from "../Resolver";
import {Pair} from "../../blockchains/Pair";
import binance from "../../platforms/Binance";
import {API, IAPIContext} from "../API";
import { tokenRegistry} from "../../blockchains/TokenRegistry";
import {Subscription} from "../Subscription";

export const NEW_PRICE_EVENT = "NEW_PRICE";

// export const newPrice:Resolver = (_, args, context) => {
//     const pair = new Pair(tokenRegistry.find(args.token0), tokenRegistry.find(args.token1));
//     API.priceFeedAggregator.subscribeLive(pair,1, binance, pu => {
//         API.pubsub.publish(NEW_PRICE_EVENT, {newPrice: pu})
//     })
//     return API.pubsub.asyncIterator([NEW_PRICE_EVENT]);
// }

class NewPrice extends Subscription{
    onSubscribe = (_, args, context) => {
        const pair = Pair.fromTickers(args.token0, args.token1);
        API.priceFeedAggregator.subscribeLive(pair,1, binance, pu => {
            API.pubsub.publish(NEW_PRICE_EVENT, {newPrice: pu})
        })
        return API.pubsub.asyncIterator([NEW_PRICE_EVENT]);
    }

    unsubscribe(_, args, context: IAPIContext) {

    }
}

export const newPrice = new NewPrice();
