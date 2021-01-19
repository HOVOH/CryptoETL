import ERC20 from "./ERC20";

class USDTToken extends ERC20 {
    constructor() {
        super("USDT");
    }
}

export const USDT = new USDTToken();
