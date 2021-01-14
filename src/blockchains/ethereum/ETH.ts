import IToken from "../Token";
import SimpleToken from "../SimpleToken";

class ETHToken extends SimpleToken {
    constructor() {
        super("ETH");
    }
}

export const ETH = new ETHToken();
