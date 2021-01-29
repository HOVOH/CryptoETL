import {IKLine} from "../KLine";
import {IRule} from "../../pipeline/IRule";

export const closePriceIsOpenPrice: IRule<IKLine> = (kline, dataset, index) => {
    if (index + 1 >= dataset.length){
        return kline;
    }
    const prevClose = dataset[index+1].close;
    if (kline.open !== prevClose){
        kline.open = prevClose;
    }
    return kline;
}
