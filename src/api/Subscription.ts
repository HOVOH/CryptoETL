import {Resolver} from "./Resolver";
import {IAPIContext} from "./API";

export abstract class Subscription{

    subscribe = (_, args, context: IAPIContext) => {
        const asyncIterator = this.onSubscribe(_, args,context);
        const savedReturn = asyncIterator.return.bind(asyncIterator);
        asyncIterator.return = () => {
            this.unsubscribe(_, args, context);
            return savedReturn();
        }
        return asyncIterator;
    };

    abstract onSubscribe: Resolver;

    abstract unsubscribe(_, args, context: IAPIContext);

}
