import KLineSorter from "../../src/prices/pipeline/KLineSorter";
import {unorderedKlines} from "./klines/unorderedKlines";
import { expect } from 'chai';
import {IKLine} from "../../src/prices/KLine";
import {noVolumeRule} from "../../src/prices/pipeline/NoVolumeRule";
import {noVolumeKline} from "./klines/NoVolumesKlines";
import {wrongOpenCloseKlines} from "./klines/wrongOpenClosePriceKlines";
import {closePriceIsOpenPrice} from "../../src/prices/pipeline/closePriceIsOpenPrice";
import {newKline, nextKlineFactory} from "../factories/KLineFactory";

describe("KlineSorter", () => {
    it("Should sort from most recent to oldest", async () => {
        const klineSorter = new KLineSorter();
        const sorted = await klineSorter.process(unorderedKlines);
        expect(sorted[0].time).to.be.gt(sorted[1].time)
    })
})

describe("NoVolumeRule", () => {
    it("Should throw error if volume is zero and price change", () =>{
        const kline: IKLine = noVolumeKline;
        expect(() => noVolumeRule(kline)).to.throw(`Low (${kline.low}) greater than high (${kline.high})`)
    })
})

describe("closePriceIsOpenPrice", () => {
    it("Shoud change open price to equal last close price", () => {
        const klines: IKLine[] = wrongOpenCloseKlines;
        const kline = closePriceIsOpenPrice(klines[0], klines, 0);
        expect(kline.open).to.eq(klines[1].close);
    })

    it('should not change the open price if last price', function () {
        const klines: IKLine[] = wrongOpenCloseKlines;
        const kline = closePriceIsOpenPrice(klines[1], klines, 1);
        expect(kline.open).to.eq(klines[1].open);
    });

    it("Should handle wrong intra candle data", () => {
        const candle1: IKLine = newKline();
        candle1.isClose = false;
        const candle2: IKLine = nextKlineFactory(candle1, 1);
        candle2.open = -1;
        const kline = closePriceIsOpenPrice(candle2, [candle2, candle1], 0);
        expect(kline.open).eq(candle1.open);
    })
})
