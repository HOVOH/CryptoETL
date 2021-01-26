import {IModel} from "./Model";
import Database from "./Database";

export type Query<T> = {
    [k in keyof T]?: T[k];
}

export interface ICollection<B, T extends IModel<B>> {
    getCollection();
    save(model: B): Promise<T>;
    findOne(query: Query<T>): Promise<T|null>;
    findAll():Promise<T[]>;
}
