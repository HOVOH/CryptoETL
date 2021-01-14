import IToken from "./blockchains/Token";
import IPlatform from "./platforms/Platform";

interface IAsset {
    locations: [{
        token: IToken,
        quantity: number,
        platform: IPlatform,
    }]
}

export default IAsset;
