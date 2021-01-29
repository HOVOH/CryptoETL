import Pipeline from "../../pipeline/Pipeline";
import {IKLine} from "../KLine";
import KLineValidatorPipe from "./KLineValidatorPipe";
import KLineSorter from "./KLineSorter";

class KLinePipeline extends Pipeline<IKLine, IKLine> {
    constructor() {
        super();
        this.append(new KLineSorter());
        this.append(new KLineValidatorPipe(0.8));
    }
}
