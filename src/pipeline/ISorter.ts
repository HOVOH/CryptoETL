export interface ISorter<T> {
    (e1: T, e2: T): number;
}
