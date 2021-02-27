import {typeDefs} from "./typeDefs";
import {ApolloServer, PubSub} from "apollo-server";
import env from "../../env";
import PriceFeedAggregator from "../pricefeed/PriceFeedAggregator";
import Database from "../database/Database";
import {timeOfCandleStart} from "../../utils/timeUtils";
import PriceHistorySubscripton from "./subscription/PriceHistorySubscripton";
import PriceHistory from "../../prices/PriceHistory";
import {convertCandle, MoneyUnits} from "../../utils/dollars";
import TaLib from "../../technicalAnalysis/TaLib";

export interface IAPIContext {
    priceUpdatePusher: PriceFeedAggregator,
}

export class API {

    static pubsub = new PubSub();
    static priceFeedAggregator: PriceFeedAggregator;
    static database: Database;
    static resolvers: any;
    static server = null;

    static async bootstrap(priceUpdatePusher: PriceFeedAggregator, database: Database): Promise<ApolloServer> {
        this.priceFeedAggregator = priceUpdatePusher;
        this.database = database;
        this.defineResolvers();
        this.server = new ApolloServer({
            typeDefs,
            resolvers: this.resolvers,
            introspection: true,
            playground: true,
            context: { priceUpdatePusher }
        })
        return this.server;
    }

    static defineResolvers(){
        const priceHistory = new PriceHistorySubscripton(this.database, this.priceFeedAggregator);
        this.resolvers = {
            Subscription: {
                priceHistory,
            },
            PriceHistory: {
                latest: (priceHistory: PriceHistory) => convertCandle(priceHistory.getLatest().candle, MoneyUnits.BASE, MoneyUnits.DOLLARS),
                latests: (priceHistory: PriceHistory, args) => priceHistory.getLatestPrices(args.n?args.n: priceHistory.max),
                monitor: (priceHistory: PriceHistory) => priceHistory.monitor,
                sma: async (priceHistory: PriceHistory) => await TaLib.sma(priceHistory.timeSeries.close, 3)
            },
            Candle:{
                start: (root, args, context) =>{
                    return timeOfCandleStart(root.time, args.interval);
                }
            },
            TechnicalIndicator: {
                bband: (root) => {
                    return 0.01
                }
            }
        };
    }

    static registerQueryResolver(key: string, resolver: (_:any, __:any, context: any) => void):void {
        this.resolvers["Query"][key] = resolver;
    }

    static registerMutationResolver(key: string, resolver: (_:any, __:any, context: any) => void):void {
        this.resolvers["Mutation"][key] = resolver;
    }

    static async start(): Promise<any> {
        let server = this.server;
        return await server.listen({
            port: env.API_PORT
        });
    }

}
