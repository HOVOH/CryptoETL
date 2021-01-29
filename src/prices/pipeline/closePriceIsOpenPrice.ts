import {IKLine} from "../KLine";
import {IRule} from "../../pipeline/IRule";

export const closePriceIsOpenPrice: IRule<IKLine> = (kline, dataset, index) => {
    const prevClose = dataset[index+1].close;
    if (kline.open !== prevClose){
        kline.open = prevClose;
    }
    return kline;
}
