import {API, IAPIContext} from "./API";

export abstract class Subscription{

    currentSubscription = {};

    subscribe = async (_, args, context: IAPIContext) => {
        const subName = this.getSubscriptionName(args);
        if (!this.currentSubscription[subName]) {
            this.currentSubscription[subName] = 0;
            await this.onSubscribe(_, args,context);
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
