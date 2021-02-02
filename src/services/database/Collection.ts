import {IModel} from "./Model";
import Database from "./Database";

export type Optional<T> = {
    [k in keyof T]?: Optional<T[k]>|string|number;
}

export interface ICollection<B, T extends IModel<B>> {
    getCollection();
    save(model: B): Promise<T>;
    findOne(query: Optional<T>): Promise<T|null>;
    findAll():Promise<T[]>;
}
