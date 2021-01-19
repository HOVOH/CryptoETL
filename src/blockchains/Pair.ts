import IToken from "./IToken";
import {tokenRegistry} from "./TokenRegistry";

export interface IPair {
    readonly token0: IToken,
    readonly token1: IToken,
    toString(): string,
}

export class Pair implements IPair {
    readonly token0: IToken;
    readonly token1: IToken;

    constructor(token0: IToken, token1: IToken) {
        this.token0 = token0;
        this.token1 = token1;
    }

    toString = () => this.token0.ticker+this.token1.ticker;

    static fromTickers(ticker0: string, ticker1: string){
        return new Pair(tokenRegistry.find(ticker0), tokenRegistry.find(ticker1))
    }
}
