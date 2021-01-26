import {ICollection, Query} from "./Collection";
import KLine, {IKLine} from "../../prices/pricefeed/KLine";
import {IModel} from "./Model";
import {ObjectId} from "mongodb";
import Database from "./Database";
import {MonitorModel} from "./Monitors";

class KlineModel extends KLine{
    monitorId: ObjectId;

    constructor(time: number,
                open: number,
                high: number,
                low: number,
                close:number,
                volume: number,
                takerBaseAssetVolume: number,
                tradeQt: number,
                isClose: boolean,) {
        super(time, open, high, low, close, volume, takerBaseAssetVolume, tradeQt, isClose);
    }

}

class KLinesCollection {

    NAME = "klines";
    database: Database;

    constructor(database: Database) {
        this.database = database;
    }

    getCollection() {
        return this.database.getDb().collection(this.NAME);
    }

    async save(monitorModel:MonitorModel, candle: IKLine): Promise<KlineModel> {
        const date = this.timeToDate(candle.time);
        const dayExists = await this.getCollection().findOne({date});
        if (!dayExists){
            await this.getCollection().insertOne({date});
        }
        return await this.getCollection().updateOne(
            {date},
            {
                $push:{
                    candles: {
                        monitorId: monitorModel._id,
                        ...candle
                    }
                }
            }
            );
    }

    private timeToDate(timestamp: number){
        const time = new Date(timestamp);
        time.setUTCHours(0);
        time.setUTCMinutes(0);
        time.setUTCSeconds(0);
        time.setUTCMilliseconds(0);
        return time;
    }

}

export default KLinesCollection;
