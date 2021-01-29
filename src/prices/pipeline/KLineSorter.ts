import SorterPipe from "../../pipeline/SorterPipe";
import {IKLine} from "../KLine";
import {timeSorter} from "./timeSorter";

class KLineSorter extends SorterPipe<IKLine>{
    constructor() {
        super(timeSorter);
    }
}

export default KLineSorter;
