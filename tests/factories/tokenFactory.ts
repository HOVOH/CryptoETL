import SimpleToken from "../../src/blockchains/SimpleToken";
import faker from "faker";

export const factoryTicker = [
    "ETH","USDT","BTC","XLM","ADA","DOT",
]

export const tokenFactory = (ticker: string) => {
    return new SimpleToken(ticker);
}
