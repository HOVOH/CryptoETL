import {Resolver} from "./Resolver";
import {API, IAPIContext} from "./API";
import {NEW_PRICE_EVENT} from "./priceFeed/newPrice";

export abstract class Subscription{

    currentSubscription = {};

    subscribe = (_, args, context: IAPIContext) => {
        const subName = this.getSubscriptionName(args);
        if (!this.currentSubscription[subName]) {
            this.currentSubscription[subName] = 0;
            this.onSubscribe(_, args,context);
        }
        ++this.currentSubscription[subName];
        return this.getAsyncIterator(_, args, context);
    };

    private getAsyncIterator(_, args, context: IAPIContext){
        const subName = this.getSubscriptionName(args);
        const asyncIterator = this.getPubSub().asyncIterator([subName]);
        const savedReturn = asyncIterator.return.bind(asyncIterator);
        asyncIterator.return = () => {
            --this.currentSubscription[subName];
            if (this.currentSubscription[subName] === 0){
                this.unsubscribe(_, args, context);
            }
            return savedReturn();
        }
        return asyncIterator;
    }

    getSubscriptionName(args: any): string{
        return JSON.stringify(args);
    }

    getPubSub() {
        return API.pubsub;
    }

    abstract onSubscribe(_, args, context: IAPIContext): void;

    abstract unsubscribe(_, args, context: IAPIContext);

}
