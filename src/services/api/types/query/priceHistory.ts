import {QueryResolver} from "../../SubscriptionResolver";
import Monitor from "../../../../prices/Monitor";
import {Pair} from "../../../../blockchains/Pair";
import binance from "../../../../platforms/Binance";
import PriceHistory from "../../../../prices/PriceHistory";

interface IPriceHistoryArgs {
    token0: string,
    token1: string,
    interval: number,
    length: number,
}

export const priceHistory: QueryResolver = async (root, args: IPriceHistoryArgs, context) => {
    const monitor = new Monitor(Pair.fromTickers(args.token0, args.token1), binance, args.interval);
    return await PriceHistory.fromDataSource(args.length, monitor, null, context.database);
}
