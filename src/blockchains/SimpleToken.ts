import IToken from "./IToken";

class SimpleToken implements IToken {
    readonly ticker: string;

    constructor(ticker: string) {
        this.ticker = ticker;
    }
}

export default SimpleToken;
