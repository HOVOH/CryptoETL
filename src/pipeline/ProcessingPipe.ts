import {IRule} from "./IRule";
import {IBatchPipe, IUnitPipe} from "./IPipe";
import ValidityThresholdNotReached from "./ValidityThresholdNotReached";

class ProcessingPipe<T> implements IBatchPipe<T, T>, IUnitPipe<T, T>{
    rules: IRule<T>[];
    index: number;
    collection: T[];
    validityThreshold: number;
    invalid: number = 0;

    constructor(validityThreshold = 0.8, rules: IRule<T>[] = []) {
        this.validityThreshold = validityThreshold;
        this.rules = rules;
    }

    addRule(rule: IRule<T>){
        this.rules.push(rule);
    }

    async process(elements: T[]): Promise<T[]>{
        this.cleanUp();
        this.collection = elements;
        for (this.index = this.collection.length - 1; this.index >= 0; this.index--){
            try {
                this.applyRuleOnIndex();
            } catch (irrecoverablePipeError){
                this.removeIndex();
            }
            if (this.invalid/this.collection.length > this.validityThreshold){
                throw new ValidityThresholdNotReached(`Validity threshold (${this.validityThreshold}) not reached`);
            }
        }
        this.removeNulls();//TODO: This is going to be problematic if other data needs removed data.
        return this.collection;
    }

    private applyRuleOnIndex(){
        let element = this.collection[this.index];
        let invalid = false;
        this.rules.forEach(rule => {
            try {
                element = rule(element, this.collection, this.index);
            } catch (pipeError) {
                if (!invalid){
                    invalid = true;
                    this.invalid++;
                }
                if (pipeError.throwAway){
                    throw pipeError;
                }
            }
        })
        this.collection[this.index] = element;
    }

    async processUnit(elements: T[], index: number): Promise<T[]>{
        this.cleanUp();
        this.collection = elements;
        this.applyRuleOnIndex()
        return this.collection;
    }

    private removeIndex(){
        this.collection[this.index] = null;
    }

    private removeNulls(){
        this.collection = this.collection.filter((e) => !!e);
    };

    private cleanUp() {
        this.index = 0;
        this.invalid = 0;
    }

}
export default ProcessingPipe;
