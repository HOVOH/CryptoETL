import Database from "./database/Database";
import PriceFeedAggregator from "../prices/pricefeed/PriceFeedAggregator";
import Monitor from "../prices/Monitor";

class PriceMonitoring {

    database: Database;
    priceFeed: PriceFeedAggregator;
    monitors: Monitor[];
    private unsubscribes: (() => void)[]

    constructor(database: Database, priceFeed: PriceFeedAggregator) {
        this.database = database;
        this.priceFeed = priceFeed;
    }

    async start(): Promise<Monitor[]> {
        return await this.load();
    }

    async load(): Promise<Monitor[]> {
        this.monitors = await this.database.monitors.findAll();
        this.unsubscribes = this.monitors.map(monitor => {
            try {
                return this.priceFeed.subscribeOnClose(monitor.pair, monitor.interval, monitor.platform, (pu) => {
                    console.log(pu.candle.close);
                })
            } catch (err){
                console.log(err);
                console.log("Faulty monitor:", monitor);
            }
            return () => {};
        });
        return this.monitors;
    }

    async reload(): Promise<Monitor[]> {
        this.unsubscribes.forEach(unsubscribe => unsubscribe());
        return await this.load();
    }

}

export default PriceMonitoring;
