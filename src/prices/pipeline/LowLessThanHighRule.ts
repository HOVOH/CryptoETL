import {IRule} from "../../pipeline/IRule";
import KLine from "../KLine";
import DataError from "../../pipeline/DataError";

export const lowLessThanHighRule: IRule<KLine> = (kline: KLine) => {
    if (kline.low > kline.high){
        throw new DataError(`Low (${kline.low}) greater than high${kline.high}`);
    }
    return kline;
}
