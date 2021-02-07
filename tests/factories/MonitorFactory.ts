import Monitor from "../../src/prices/Monitor";
import {pairFactory} from "./PairFactory";
import {platformFactory} from "./PlatformFactory";
import {between} from "./utils";

export const monitorFactory = () => {
    return new Monitor(
        pairFactory(),
        platformFactory(),
        Math.floor(between(1,10))
    )
}
