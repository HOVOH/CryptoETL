import {expect} from "chai"
import KLinesConverter from "../../src/prices/pipeline/KLinesConverter";
import KLine from "../../src/prices/KLine";
import {extractedCandles} from "./klines/correctKlines";

describe("KLinesConverter", () => {
    it("mergeWithNew() merges newCandle with given candle", () => {
        const oldestCandle = new KLine(
            10,
            5,
            10,
            2,
            8,
            10,
            5,
            10,
            true
        );
        const newestCandle = new KLine(
            11,
            3,
            11,
            5,
            10,
            11,
            6,
            8,
            true
        )
        const candle = KLine.merge(oldestCandle, newestCandle)
        expect(candle.time).eq(10);
        expect(candle.open).eq(5);
        expect(candle.low).eq(2);
        expect(candle.close).eq(10);
        expect(candle.volume).eq(21);
        expect(candle.takerBaseAssetVolume).eq(11);
        expect(candle.tradeQt).eq(18);
        expect(candle.isClose).is.true;
    });

    it("Should merge candles (2)", async () => {
        const conv = new KLinesConverter(1, 2);
        const klines = extractedCandles.slice(0,2);
        const converted = await conv.process(klines);
        expect(converted.length).eq(1);
        expect(converted[0]).deep.eq(KLine.merge(klines[1], klines[0]));
    });

    it("Should merge candles (3)", async () => {
        const conv = new KLinesConverter(1, 3);
        const klines = extractedCandles.slice(0,3);
        const converted = await conv.process(klines);
        expect(converted.length).eq(1);
        expect(converted[0]).deep.eq(KLine.merge(klines[2],KLine.merge(klines[1], klines[0])));
    });

    it("Should produce 2 candles", async () => {
        const conv = new KLinesConverter(1, 2);
        const klines = extractedCandles.slice(0, 4);
        const converted = await conv.process(klines);
        expect(converted.length).eq(2);
        expect(converted[0]).deep.eq(KLine.merge(klines[1], klines[0]));
        expect(converted[1]).deep.eq(KLine.merge(klines[3], klines[2]));
    })

    it("Should produce 3 candles", async () => {
        const conv = new KLinesConverter(1, 2);
        const klines = extractedCandles.slice(0, 6);
        const converted = await conv.process(klines);
        expect(converted.length).eq(3);
        expect(converted[0]).deep.eq(KLine.merge(klines[1], klines[0]));
        expect(converted[1]).deep.eq(KLine.merge(klines[3], klines[2]));
        expect(converted[2]).deep.eq(KLine.merge(klines[5], klines[4]));
    })

    it('should throw criticalDataError', async () => {
        const conv = new KLinesConverter(1, 5);
        const klines = extractedCandles.slice(0,3);
        let errorThrown = false;
        try{
            const converted = await conv.process(klines);
        } catch (error){
            errorThrown = true;
        }
        expect(errorThrown).to.be.true;
    });

    it('should be healthy data', async () => {
        const conv = new KLinesConverter(1, 5);
        const klines = extractedCandles.slice(0,7);
        let errorThrown = false;
        try{
            const converted = await conv.process(klines);
        } catch (error){
            errorThrown = true;
        }
        expect(errorThrown).to.be.false;
        expect(conv.lowQualityCandles).eq(0);
    });

    it("Should flag one low quality candle", async () => {
        const conv = new KLinesConverter(1, 5);
        const klines = extractedCandles.slice(0,6);
        let errorThrown = false;
        try{
            const converted = await conv.process(klines);
        } catch (error){
            errorThrown = true;
        }
        expect(errorThrown).to.be.false;
        expect(conv.lowQualityCandles).eq(1);
    });

})
