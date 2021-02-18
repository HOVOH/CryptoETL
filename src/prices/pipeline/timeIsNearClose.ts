import {IRule} from "../../pipeline/IRule";
import {IKLine} from "../KLine";
import {timeOfCandleStart} from "../../utils/timeUtils";

export const timeIsNearCloseIfClose: (interval: number) => IRule<IKLine> = (interval: number) => {
    return (kline: IKLine) =>{
        if (kline.isClose){
            const start = timeOfCandleStart(kline.time, interval);
            const errorMargin = 900; //in ms
            if (kline.time < start-errorMargin || kline.time > start+errorMargin){
                kline.time = start;
            }
        }
        return kline;
    }
}
