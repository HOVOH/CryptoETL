import IPipe from "./IPipe";

export interface IPipeline<T, O> {
    process(elements: T[]): Promise<O[]>;
}

class Pipeline<T, O> implements IPipeline<T, O>{
    pipes: IPipe<T|O, T|O>[] = [];

    constructor() {
    }

    append(pipe: IPipe<T|O, T|O>){
        this.pipes.push(pipe);
    }

    async process(elements: T[]): Promise<O[]> {
        let product: (T|O)[] = elements;
        for (const pipe of this.pipes) {
            product = await pipe.process(product);
        }
        return <O[]> product;
    }
}

export default Pipeline;
