import {Pair} from "../../src/blockchains/Pair";
import {factoryTicker, tokenFactory} from "./tokenFactory";


export const pairFactory = () => {
    return new Pair(
        tokenFactory(factoryTicker[0]),
        tokenFactory(factoryTicker[1])
    )
}
