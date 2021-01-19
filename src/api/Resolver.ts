import {IAPIContext} from "./API";

export interface Resolver {
    (_, args: any, context: IAPIContext): AsyncIterator<any>
}
