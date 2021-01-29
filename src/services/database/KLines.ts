import KLine, {IKLine} from "../../prices/KLine";
import {ObjectId} from "mongodb";
import Database from "./Database";
import {MonitorModel} from "./Monitors";
import {timeToDate} from "../../utils/timeUtils";

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
        const date = timeToDate(candle.time);
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

    findAll(from: number, to: number){

    }

}

export default KLinesCollection;
