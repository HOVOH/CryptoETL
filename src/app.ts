import PriceFeedAggregator from "./services/pricefeed/PriceFeedAggregator";
import BinancePriceFeed from "./services/pricefeed/BinancePriceFeed";
import {Pair} from "./blockchains/Pair";
import {ETH} from "./blockchains/ethereum/ETH";
import {USDT} from "./blockchains/ethereum/USDT";
import binance from "./platforms/Binance";
import PriceHistory from "./prices/PriceHistory";
import {API} from "./services/api/API";
import Monitor from "./prices/Monitor";
import Database from "./services/database/Database";
import env from "./env";
import PriceMonitoring from "./services/PriceMonitoring";

const priceFeedAggregator = new PriceFeedAggregator();
priceFeedAggregator.registerPriceFeed(new BinancePriceFeed());

const database = new Database(env.DB_HOST, env.DB_PORT, env.DB_NAME, env.DB_USER, env.DB_PASSWORD);
console.log("Connecting to database")
database.open().then(async (err) => {
    if (!err){
        console.log("Connected to database");
    } else {
        console.log("Failed to connect to database: "+err.message);
        throw err;
    }
}).then( () => {
    if (env.DISABLE_MONITORING) return;
    const monitorService = new PriceMonitoring(database, priceFeedAggregator);
    monitorService.start().then(async (monitors) => {
        console.log("Monitoring service started for: ");
        monitors.forEach(monitor => console.log(monitor.toString()));
    })
}).then(async () => {
    if (env.DISABLE_API) return;
    console.log("Starting API")
    await API.bootstrap(priceFeedAggregator, database);
    const res = await API.start();
    console.log("API started on "+res.url);
}).catch((e)=> {
    console.log("Starting process interrupted");
    console.log(e)
});



