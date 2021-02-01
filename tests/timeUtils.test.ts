import {expect} from "chai"
import {timeOfCandleStart} from "../src/utils/timeUtils";

describe("timeOfCandleStart", () => {
    it("should return the start of the candle", () => {
        expect(timeOfCandleStart(1612063562726, 5)).to.eq(1612063500000)
    })
})
