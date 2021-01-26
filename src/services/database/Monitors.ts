import Monitor from "../../prices/Monitor";
import {ObjectId} from "mongodb";
import {IPair, Pair} from "../../blockchains/Pair";
import IPlatform from "../../platforms/Platform";
import Database from "./Database";
import {IModel} from "./Model";
import {ICollection, Query} from "./Collection";
import {tokenRegistry} from "../../blockchains/TokenRegistry";
import {platformRegistry} from "../../platforms/PlatformRegistry";

export class MonitorModel extends Monitor implements IModel<Monitor>{
    _id: ObjectId;
    collection: ICollection<Monitor, MonitorModel>;

    constructor(_id:ObjectId, pair: IPair, platform: IPlatform, interval: number, collection: ICollection<Monitor, MonitorModel>) {
        super(pair, platform, interval);
        this.collection = collection;
        this._id = _id;
    }

    async upsert() {
        if (this._id){
            const exists = await this.collection.findOne(this.serialize());
            if (exists){
                throw new Error("This monitor already exists");
            }
            await this.collection.getCollection().updateOne({_id: this._id}, {
                $set: this.serialize()
            }, {upsert: true});
        } else {
            const exists = await this.collection.findOne(this.serialize());
            if (exists){
                this._id = exists._id;
            } else {
                const result = await this.collection.getCollection().insertOne(this.serialize());
                this._id = result.insertedId;
            }
        }
    }

    serialize(): any {
        return {
            pair: {
                token0: this.pair.token0,
                token1: this.pair.token1,
            },
            platform: {
                name: this.platform.name
            },
            interval: this.interval,
        }
    }

    static deserialize(object, collection: ICollection<Monitor, MonitorModel>): MonitorModel {
        const pair = new Pair(tokenRegistry.find(object.pair.token0.ticker), tokenRegistry.find(object.pair.token1.ticker));
        const platform = platformRegistry.find(object.platform.name);
        return new MonitorModel(object._id, pair, platform, object.interval, collection);
    }
}

class Monitors implements ICollection<Monitor, MonitorModel>{

    NAME = "monitors";
    database: Database;

    constructor(database: Database) {
        this.database = database;
    }

    async save(monitor: Monitor): Promise<MonitorModel>{
        const model = new MonitorModel(null, monitor.pair, monitor.platform, monitor.interval, this);
        await model.upsert()
        return model;
    }

    async findOne(query:Query<MonitorModel>): Promise<MonitorModel|null>{
        const res = await this.getCollection().findOne(query);
        if (res){
            return this.resultToModel(res);
        }
        return null;
    }

    private resultToModel(res: any){
        return MonitorModel.deserialize(res, this);
    }

    async findAll(): Promise<MonitorModel[]> {
        const res = await this.getCollection().find().toArray();
        if (res.length > 0){
            return res.map(res => this.resultToModel(res));
        }
        return [];
    }

    getCollection(){
        return this.database.getDb().collection(this.NAME)
    }

}

export default Monitors;
