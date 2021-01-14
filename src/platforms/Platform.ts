import IToken from "../blockchains/Token";

interface IPlatform {
    api: any,
    readonly name: string,
    getTokens: () => IToken[],
    swap: (token0: IToken, token1: IToken) => Promise<any>
}

export default IPlatform;

export abstract class Platform implements IPlatform {
    api: any;
    readonly name: string;

    constructor(name: string, api: any) {
        this.name = name;
        this.api = api;
    }

    abstract getTokens(): IToken[];

    abstract swap(token0: IToken, token1: IToken): Promise<any>;

}
