import {IBatchPipe, IUnitPipe} from "./IPipe";

export interface IPipeline<T, O> {
    process(elements: T[]): Promise<O[]>;
}

export interface IUnitPipeline<T, O> {
    processUnit(elements: T[], index: number): Promise<O[]>;
}

export class BatchPipeline<T, O> implements IPipeline<T, O>{
    pipes: IBatchPipe<T|O, T|O>[] = [];

    constructor(pipes: IBatchPipe<T|O, T|O>[]) {
        this.pipes = pipes;
    }

    append(pipe: IBatchPipe<T|O, T|O>){
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

export class UnitPipeline<T, O> implements IUnitPipeline<T, O>{

    pipes: IUnitPipe<T|O, T|O>[] = [];

    constructor(pipes: IUnitPipe<T|O, T|O>[]) {
        this.pipes = pipes;
    }

    append(pipe: IUnitPipe<T|O, T|O>){
        this.pipes.push(pipe);
    }

    async processUnit(elements: T[], index: number): Promise<O[]>{
        let product: (T|O)[] = elements;
        for (const pipe of this.pipes) {
            product = await pipe.processUnit(product, index);
        }
        return <O[]> product;
    }
}
