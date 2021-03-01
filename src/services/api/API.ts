import {typeDefs} from "./typeDefs";
import {ApolloServer, PubSub} from "apollo-server";
import env from "../../env";
import PriceFeedAggregator from "../pricefeed/PriceFeedAggregator";
import Database from "../database/Database";
import {timeOfCandleStart} from "../../utils/timeUtils";
import PriceHistory from "../../prices/PriceHistory";
import {convertCandle, MoneyUnits} from "../../utils/dollars";
import TaLib from "../../technicalAnalysis/TaLib";
import {Subscription} from "./Subscription";
import {QueryGQLType} from "./types/query";
import {SubscriptionGQLType} from "./types/subscription";
import {PriceHistoryGQLType} from "./types/priceHistory";
import {CandleGQLType} from "./types/candle";
import DollarsDirective from "./directives/DollarsDirective";

export interface IAPIContext {
    priceFeedAggregator: PriceFeedAggregator,
    database: Database,
}

export class API {

    static pubsub = new PubSub();
    static priceFeedAggregator: PriceFeedAggregator;
    static database: Database;
    static resolvers: any;
    static server = null;

    static async bootstrap(priceFeedAggregator: PriceFeedAggregator, database: Database): Promise<ApolloServer> {
        this.priceFeedAggregator = priceFeedAggregator;
        this.database = database;
        this.defineResolvers();
        this.server = new ApolloServer({
            typeDefs,
            resolvers: this.resolvers,
            schemaDirectives: {
                dollars: DollarsDirective,
            },
            introspection: true,
            playground: true,
            context: { priceFeedAggregator, database }
        })
        return this.server;
    }

    static defineResolvers(){
        this.resolvers = {
            Query: QueryGQLType,
            Subscription: SubscriptionGQLType,
            PriceHistory: PriceHistoryGQLType,
            Candle:CandleGQLType,
            TechnicalIndicator: {
                bband: (root) => {
                    console.log(root);
                    return 0.01
                }
            },
        };
    }

    static async start(): Promise<any> {
        let server = this.server;
        return await server.listen({
            port: env.API_PORT
        });
    }

}
