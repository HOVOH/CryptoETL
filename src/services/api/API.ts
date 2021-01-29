import {typeDefs} from "./typeDefs";
import {ApolloServer, PubSub} from "apollo-server";
import env from "../../env";
import PriceFeedAggregator from "../pricefeed/PriceFeedAggregator";
import {newPrice} from "./priceFeed/newPrice";

export interface IAPIContext {
    priceUpdatePusher: PriceFeedAggregator,
}

export class API {

    static pubsub = new PubSub();
    static priceFeedAggregator: PriceFeedAggregator;
    static resolvers: any = {
        Subscription: {
            newPrice
        },
        PriceUpdate: {
            technicalIndicator: (root) => root
        },
        TechnicalIndicator: {
            bband: (root) => {
                return 0.01
            }
        }
    };
    static server = null;

    static async bootstrap(priceUpdatePusher: PriceFeedAggregator): Promise<ApolloServer> {
        this.priceFeedAggregator = priceUpdatePusher;
        this.server = new ApolloServer({
            typeDefs,
            resolvers: this.resolvers,
            introspection: true,
            playground: true,
            context: { priceUpdatePusher }
        })
        return this.server;
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
