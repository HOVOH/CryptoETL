import {IRule} from "./IRule";
import IPipe from "./IPipe";
import ValidityThresholdNotReached from "./ValidityThresholdNotReached";

class ProcessingPipe<T> implements IPipe<T, T>{
    rules: IRule<T>[] = [];
    index: number;
    collection: T[];
    validityThreshold: number;
    invalid: number = 0;
    atomic: boolean;

    constructor(validityThreshold = 0.8, atomic: boolean) {
        this.validityThreshold = validityThreshold;
        this.atomic = atomic;
    }

    addRule(rule: IRule<T>){
        this.rules.push(rule);
    }

    async process(elements: T[]): Promise<T[]>{
        this.cleanUp();
        this.collection = elements;
        for (this.index = 0; this.index < this.collection.length; this.index++){
            try {
                this.applyRuleOnIndex();
            } catch (irrecoverablePipeError){
                this.removeIndex();
            }
            if (this.invalid/this.collection.length > this.validityThreshold){
                throw new ValidityThresholdNotReached(`Validity threshold (${this.validityThreshold}) not reached`);
            }
        }
        this.removeNulls();
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
