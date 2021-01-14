import IToken from "../Token";
import SimpleToken from "../SimpleToken";

class USDTToken extends SimpleToken {
    constructor() {
        super("USDC");
    }
}

export const USDT = new USDTToken();
