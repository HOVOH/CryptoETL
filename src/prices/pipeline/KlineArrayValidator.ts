import ProcessingPipe from "../../pipeline/ProcessingPipe";
import {IKLine} from "../KLine";
import {closePriceIsOpenPrice} from "./closePriceIsOpenPrice";
import {roundTimeToStartOfCandle} from "./roundTimeToStartOfCandle";

class KlineArrayValidator extends ProcessingPipe<IKLine>{
    constructor(interval: number) {
        super(0.8);
        this.addRule(closePriceIsOpenPrice);
        this.addRule(roundTimeToStartOfCandle(interval));
    }

}

export default KlineArrayValidator;
