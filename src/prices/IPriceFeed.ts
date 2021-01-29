import {IPair} from "../blockchains/Pair";
import IPriceUpdate from "./PriceUpdate";
import IPlatform from "../platforms/Platform";

interface IPriceFeed {
    readonly platform: IPlatform,
    subscribe: (pair: IPair, interval: number) => void,
    intervalToLabel: (interval:number) => string,
    emit: (priceUpdate: IPriceUpdate) => void,
    onPriceUpdate: (callback:(priceUpdate: IPriceUpdate) => void) => void,
}

export default IPriceFeed;
