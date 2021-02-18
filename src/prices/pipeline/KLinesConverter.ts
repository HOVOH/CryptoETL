import {IBatchPipe} from "../../pipeline/IPipe";
import KLine, {IKLine} from "../KLine";
import {intervalToTime, timeOfCandleStart} from "../../utils/timeUtils";
import CriticalDataError from "../../pipeline/CriticalDataError";
import DataError from "../../pipeline/DataError";

class KLinesConverter implements IBatchPipe<IKLine, IKLine>{

    fromInterval: number;
    toInterval: number;
    intervalRatio: number;
    candles: IKLine[];
    index: number;
    timeStart:number;
    newCandle: IKLine;
    output: IKLine[];
    minimumRatio: number = 0.8;
    lowQualityCandles: number = 0;

    constructor(fromInterval: number, toInterval: number) {
        this.fromInterval = fromInterval;
        this.toInterval = toInterval;
        this.intervalRatio = toInterval/fromInterval
    }

    process(candles: IKLine[]): Promise<IKLine[]> {
        this.init(candles);
        while(this.index < this.candles.length){
            this.nextCandle();
            try{
                this.mergeCandle();
            } catch (e){
                this.lowQualityCandles++;
                if (e.throwAway){
                    throw new CriticalDataError("Too much candles are missing");
                }
            }
            this.output.push(this.newCandle);
        }
        return Promise.resolve(this.output);
    }

    private init(candles: IKLine[]){
        this.candles = candles;
        this.output = [];
        this.index = 0;
    }

    private nextCandle(){
        this.newCandle = this.candles[this.index];
        this.timeStart = timeOfCandleStart(this.newCandle.time, this.toInterval);
        this.index++;
    }

    private mergeCandle(){

        let candleMerged = 1;

        for (; this.index < this.candles.length; this.index++){
            let curCandle = this.candles[this.index];
            if (curCandle.time >= this.timeStart){
                this.newCandle = KLine.merge(curCandle, this.newCandle);
                candleMerged++;
            } else {
                break;
            }
        }

        if (candleMerged < this.intervalRatio){
            if (this.output.length === 0){
                this.newCandle.isClose = false;
            } else if (candleMerged < this.intervalRatio * this.minimumRatio){
                throw new CriticalDataError("Minimum threshold of "+this.minimumRatio+" not reached");
            } else{
                throw new DataError(candleMerged-this.intervalRatio+" candles are missing")
            }
        }
    }



}

export default KLinesConverter;
