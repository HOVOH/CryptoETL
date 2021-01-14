import BinanceAPI from "node-binance-api";
import env from "../env";
import {Platform} from "./Platform";
import IToken from "../blockchains/Token";

const binanceAPI = new BinanceAPI().options({
    APIKEY: env.BINANCE_KEY,
    APISECRET: env.BINANCE_SECRET,
});

class Binance extends Platform {

    constructor() {
        super("Binance", binanceAPI);
    }

    getTokens(): IToken[] {
        return [];
    }

    swap(token0: IToken, token1: IToken): Promise<any> {
        return Promise.resolve(undefined);
    }

}
const binance = new Binance();
export default binance;
