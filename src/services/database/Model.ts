import {ObjectId} from "mongodb";

export interface IModel<T> {
    _id:ObjectId;
    upsert();
    serialize(): any;
}
