import IPlatform from "./Platform";
import binance from "./Binance";
import {Registry} from "../utils/Registry";

class PlatformRegistry extends Registry<string, IPlatform>{
    protected findPredicate(key: string): (value: IPlatform) => boolean {
        return (p1: IPlatform) => p1.name === key;
    }
}

export const platformRegistry = new PlatformRegistry([
    binance
]);


