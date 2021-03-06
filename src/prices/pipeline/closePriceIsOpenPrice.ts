import {IKLine} from "../KLine";
import {IRule} from "../../pipeline/IRule";

export const closePriceIsOpenPrice: IRule<IKLine> = (kline, dataset, index) => {
    if (index + 1 >= dataset.length){
        return kline;
    }
    const prevCandle = dataset[index + 1];
    if (prevCandle.isClose){
        if (kline.open !== prevCandle.close ){
            kline.open = prevCandle.close;
        }
    } else {
        if (kline.open !== prevCandle.open){
            kline.open = prevCandle.open;
        }
    }
    return kline;
}

