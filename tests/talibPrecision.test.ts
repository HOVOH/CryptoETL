import TaLib from "../src/technicalAnalysis/TaLib";
import {expect} from "chai"
const marketData = {
    close: [ 0.1,0.2,0.1,0.2],
    high: [10, 20,10, 20],
    low: [9, 9, 9, 9],
}

describe("talib", ()=> {
    it("should handle integer without imprecision", async () => {
        const {result} = await TaLib.execute({
            name: "SMA",
            startIdx: 0,
            endIdx: marketData.close.length - 1,
            inReal: marketData.high,
            optInTimePeriod: 2
        });
        expect(result.outReal[0]%1).to.eq(0)//test for decimals
    })

    it("should have floating point imprecision", async () => {
        const {result} = await TaLib.execute({
            name: "SMA",
            startIdx: 0,
            endIdx: marketData.close.length - 1,
            inReal: marketData.close,
            optInTimePeriod: 2
        });
        expect(result.outReal[0]).to.not.eq(0.15)//test for decimals
    })
})
