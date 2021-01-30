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
        const doc = {
            date,
            monitorId: monitorModel._id,
        }
        const dayExists = await this.getCollection().findOne(doc);
        if (!dayExists){
            await this.getCollection().insertOne(doc);
        }
        return await this.getCollection().updateOne(doc,
            {
                $push:{
                    candles: {
                        ...candle
                    }
                }
            }
        );
    }

    async find(from: number, to: number, monitor: MonitorModel): Promise<IKLine[]>{
        const fromDate = timeToDate(from);
        const toDate = timeToDate(to);

        return await this.getCollection().aggregate([
            {
                $match: {
                    date: {
                        $gte: fromDate,
                        $lte: toDate
                    },
                    monitorId: monitor._id
                }
            }, {
                $unwind: {
                    path: "$candles"
                }
            }, {
                $replaceRoot: {
                    newRoot: "$candles"
                }
            }, {
                $match: {
                    time: {
                        $gte: from,
                        $lte: to
                    }
                }
            }
        ]).toArray();

/*        await this.getCollection().find({ date: {
                $gte: fromDate,
                $lte: toDate
            },
            candles: {
                time:{
                    $gte: from,
                    $lte: to,
                }
            }
        }, {

        }).toArray();*/

    }

}

export default KLinesCollection;
