import {IRule} from "../../pipeline/IRule";
import KLine from "../KLine";
import DataError from "../../pipeline/DataError";

export const noVolumeRule: IRule<KLine> = (kline: KLine) => {
    if (kline.volume === 0 && kline.low !== kline.high && kline.high !== kline.close){
        throw new DataError(`Low (${kline.low}) greater than high (${kline.high})`);
    }
    return kline;
}
