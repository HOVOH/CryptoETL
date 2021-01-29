import { expect } from 'chai';
import ProcessingPipe from "../../src/pipeline/ProcessingPipe";
import {dataErrorRule, criticalErrorRule, modifyDataRule, validDataRule} from "./rules";
import Data, {generateData} from "./Data";

const getPipe = (quantity = 0) => {
    const pipe = new ProcessingPipe<Data>(0.8, true);
    pipe.collection = generateData(quantity);
    pipe.index = 0;
    return pipe;
}

describe("Processing Pipe", ()=>{

    it("Should add rule to pipes", () => {
        let pipe:ProcessingPipe<Data> = getPipe(1);
        pipe.addRule(criticalErrorRule);
        expect(pipe.rules.length).to.eq(1);
    })

    it("catch data error and increment invalid counter only once", () => {
        let pipe:ProcessingPipe<any> = getPipe(1);
        pipe.addRule(dataErrorRule);
        pipe.addRule(dataErrorRule);
        pipe["applyRuleOnIndex"]();
        expect(pipe.invalid).to.be.eq(1);
    })

    it("Applies modification on iterated object", () => {
        let pipe:ProcessingPipe<Data> = getPipe(1);
        pipe.addRule(modifyDataRule);
        pipe.addRule(modifyDataRule);
        pipe["applyRuleOnIndex"]();
        expect(pipe.invalid).to.be.eq(0);
        expect(pipe.collection[0].modifiedCounter).to.be.eq(2);
    })

    it("Removes critical data error", async () => {
        let pipe:ProcessingPipe<Data> = getPipe();
        pipe.addRule(validDataRule);
        const data: Data[] = generateData(10);
        data[0].valid = false;
        const processed = await pipe.process(data);
        expect(processed.length).to.be.eq(9);
    })

    it('should throw validity threshold error', async () => {
        let pipe:ProcessingPipe<Data> = getPipe(5);
        pipe.addRule(criticalErrorRule);
        let error = false;
        try {
            await pipe.process(generateData(2))
        } catch (e) {
            error = true
        }
        expect(error).to.be.true
    });
});

