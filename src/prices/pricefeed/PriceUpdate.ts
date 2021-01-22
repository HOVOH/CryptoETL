import {IKLine} from "./KLine";
import {IMonitor} from "../Monitor";


export interface IPriceUpdate {
    meta: IMonitor,
    candle: IKLine,
}

class PriceUpdate implements IPriceUpdate{

    meta: IMonitor;
    candle: IKLine;

    constructor(candle: IKLine, meta: IMonitor) {
        this.candle = candle;
        this.meta = meta;
    }
}

export default PriceUpdate;

