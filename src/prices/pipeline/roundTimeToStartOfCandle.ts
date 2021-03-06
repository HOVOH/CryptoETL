import {IRule} from "../../pipeline/IRule";
import {IKLine} from "../KLine";
import {timeOfCandleStart} from "../../utils/timeUtils";

export const roundTimeToStartOfCandle: (interval: number) => IRule<IKLine> = (interval: number) => {
    return (kline: IKLine) =>{
        kline.rtime = kline.time;
        kline.time = timeOfCandleStart(kline.time, interval);
        return kline;
    }
}
