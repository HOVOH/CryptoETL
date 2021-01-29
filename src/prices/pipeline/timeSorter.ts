import {ISorter} from "../../pipeline/ISorter";
import {IKLine} from "../KLine";

export const timeSorter: ISorter<IKLine> = (c1, c2) => c1.time - c2.time;
