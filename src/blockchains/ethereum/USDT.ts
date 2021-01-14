import SimpleToken from "../SimpleToken";

class USDTToken extends SimpleToken {
    constructor() {
        super("USDT");
    }
}

export const USDT = new USDTToken();
