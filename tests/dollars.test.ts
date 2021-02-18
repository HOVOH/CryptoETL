import {expect} from "chai"
import {baseToMoney, moneyConvert, moneyToBase, MoneyUnits} from "../src/utils/dollars";

describe("moneyConvert", () =>{

    it("should trucates number of decimal", () => {
        expect(moneyToBase(1.0123456789012345678901, MoneyUnits.DOLLARS)).to.eq(1012345678901234567)
    })

    it("converts $ to base", () => {
        expect(moneyToBase(1.5, MoneyUnits.DOLLARS)).to.eq(1500000000000000000)
    })

    it('convert cents to base', function () {
        expect(moneyToBase(1.5, MoneyUnits.CENTS)).to.eq(15000000000000000)
    });

    it('should convert base to $', function () {
        expect(baseToMoney(1500000000000000000, MoneyUnits.DOLLARS)).to.eq(1.5);
    });

    it('should convert base to cents', function () {
        expect(baseToMoney(15000000000000000, MoneyUnits.CENTS)).to.eq(1.5);
    });

    it("Convert $ to cents", () =>{
        expect(moneyConvert(1.50, MoneyUnits.DOLLARS, MoneyUnits.CENTS)).to.eq(150)
    })

    it("Convert cents to $", () =>{
        expect(moneyConvert(150, MoneyUnits.CENTS, MoneyUnits.DOLLARS)).to.eq(1.5)
    })

    it("Converts cents to base", () => {
        expect(moneyConvert(20.1, MoneyUnits.CENTS, MoneyUnits.BASE)).to.eq(201000000000000000);
    })
})
