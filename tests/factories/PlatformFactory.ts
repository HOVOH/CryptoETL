import IPlatform, {Platform} from "../../src/platforms/Platform";
import IToken from "../../src/blockchains/IToken";

export const platformFactory = () => {
    return new DummyPlatform("Binance", {});
}

class DummyPlatform implements IPlatform{
    api: any;
    readonly name: string;

    constructor(name, api) {
        this.name = name;
        this.api = api;
    }

    getTokens(): IToken[] {
        return [];
    }

    swap(token0: IToken, token1: IToken): Promise<any> {
        return Promise.resolve(null);
    }

}
