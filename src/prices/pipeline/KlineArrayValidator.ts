import ProcessingPipe from "../../pipeline/ProcessingPipe";
import {IKLine} from "../KLine";
import {closePriceIsOpenPrice} from "./closePriceIsOpenPrice";
import {timeIsNearCloseIfClose} from "./timeIsNearClose";

class KlineArrayValidator extends ProcessingPipe<IKLine>{
    constructor(interval: number) {
        super(0.8, true);
        this.addRule(closePriceIsOpenPrice);
        this.addRule(timeIsNearCloseIfClose(interval));
    }

}

export default KlineArrayValidator;
