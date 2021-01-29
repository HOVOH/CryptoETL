interface IPipe<T, O> {
    process(elements: T[]): Promise<O[]>;
}
export default IPipe;
