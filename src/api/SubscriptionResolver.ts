import {IAPIContext} from "./API";

export interface SubscriptionResolver {
    (root, args: any, context: IAPIContext): AsyncIterator<any>
}

export interface QueryResolver {
    (root, args: any, context: IAPIContext):any
}
