import ERC20 from "./ERC20";

class ETHToken extends ERC20 {
    constructor() {
        super("ETH");
    }
}

export const ETH = new ETHToken();
