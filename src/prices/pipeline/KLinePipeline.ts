import BatchPipeline from "../../pipeline/Pipeline";
import {IKLine} from "../KLine";
import KLineValidatorPipe from "./KLineValidatorPipe";
import KLineSorter from "./KLineSorter";

class KLinePipeline extends BatchPipeline<IKLine, IKLine> {
    constructor() {
        super([
            new KLineSorter(),
            new KLineValidatorPipe(0.8)
        ]);
    }
}
