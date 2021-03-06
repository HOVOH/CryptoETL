import {IKLine} from "../KLine";
import {lowLessThanHighRule} from "./LowLessThanHighRule";
import {noVolumeRule} from "./NoVolumeRule";
import ProcessingPipe from "../../pipeline/ProcessingPipe";

class KLineValidatorPipe extends ProcessingPipe<IKLine>{

    constructor(validityThreshold = 0.8) {
        super(validityThreshold);
        this.addRule(lowLessThanHighRule);
        this.addRule(noVolumeRule);
    }
}
export default KLineValidatorPipe;
