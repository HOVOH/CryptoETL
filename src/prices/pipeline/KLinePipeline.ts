import Pipeline from "../../pipeline/Pipeline";
import {IKLine} from "../KLine";
import SorterPipe from "../../pipeline/SorterPipe";
import {timeSorter} from "./timeSorter";
import KLineValidatorPipe from "./KLineValidatorPipe";

class KLinePipeline extends Pipeline<IKLine, IKLine> {
    constructor() {
        super();
        this.append(new SorterPipe(timeSorter));
        this.append(new KLineValidatorPipe(0.8));
    }
}
