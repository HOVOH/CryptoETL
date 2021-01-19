import IToken from "./IToken";
import {ETH} from "./ethereum/ETH";
import {USDT} from "./ethereum/USDT";
import {Registry} from "../utils/Registry";

class TokenRegistry extends Registry<string, IToken>{
    protected findPredicate(key: string): (value: IToken) => boolean {
        return (t) => t.ticker === key;
    }
}

export const tokenRegistry = new TokenRegistry([
    ETH,
    USDT,
])
