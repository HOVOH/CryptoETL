import IToken from "./IToken";

abstract class SimpleToken implements IToken {
    readonly ticker: string;

    protected constructor(ticker: string) {
        this.ticker = ticker;
    }
}

export default SimpleToken;
