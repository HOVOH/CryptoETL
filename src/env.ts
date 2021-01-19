import dotenv from "dotenv";

interface IEnv {
    HTTP_PROVIDER: string,
    WS_PROVIDER: string,
    BINANCE_SECRET: string,
    BINANCE_KEY: string,
    API_PORT: number,
}

const result = dotenv.config();

if (result.error) {
    throw result.error;
}
const env = result.parsed as unknown as IEnv;
export default env;
