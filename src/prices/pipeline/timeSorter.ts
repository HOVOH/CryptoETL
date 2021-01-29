import {ISorter} from "../../pipeline/ISorter";
import {IKLine} from "../KLine";

export const timeSorter: ISorter<IKLine> = (c1, c2) => c2.time - c1.time;
