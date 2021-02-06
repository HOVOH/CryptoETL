import IToken from "./IToken";
import {ETH} from "./ethereum/ETH";
import {USDT} from "./ethereum/USDT";
import {Registry} from "../utils/Registry";
import SimpleToken from "./SimpleToken";

class TokenRegistry extends Registry<string, IToken>{
    protected findPredicate(key: string): (value: IToken) => boolean {
        return (t) => t.ticker === key;
    }

    orDefault(key: string): IToken {
        return new SimpleToken(key);
    }
}

export const tokenRegistry = new TokenRegistry([
    ETH,
    USDT,
])
