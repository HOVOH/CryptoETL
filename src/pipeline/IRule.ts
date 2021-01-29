export interface IRule<T> {
    (e: T, dataset?: T[], index?: number): T;
}
