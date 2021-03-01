import {timeOfCandleStart} from "../../../../utils/timeUtils";

export const CandleGQLType = {
    start: (root, args, context) =>{
        return timeOfCandleStart(root.time, args.interval);
    }
}
