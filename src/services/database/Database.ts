import {MongoClient} from "mongodb";
import env from "../../env";
import Monitors, {MonitorModel} from "./Monitors";
import {ICollection} from "./Collection";
import Monitor from "../../prices/Monitor";
import KLinesCollection from "./KLines";

class Database {
    connectionString: string;
    database: string;
    client: MongoClient;
    isOpen: boolean = false;
    db: any;
    monitors: ICollection<Monitor, MonitorModel>;
    klines: KLinesCollection;

    constructor(host: string, port: number, database: string, user: string, password: string) {
        this.connectionString = `mongodb://${user}:${password}@${host}:${port}?poolSize=20&w=majority`;
        this.client = new MongoClient(this.connectionString, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        this.database = database;
    }

    async open(){
        if (!this.isOpen){
            try {
                await this.client.connect();
                this.db = this.client.db(this.database);
                this.createCollections();
                this.isOpen = true;
            } catch (e) {
                return e;
            }
        }
        return false;
    }

    private createCollections(){
        this.monitors = new Monitors(this);
        this.klines = new KLinesCollection(this);
    }

    close(){
        if (this.isOpen){
            this.client.close()
            this.isOpen = false;
        }
    }

    getDb(){
        return this.client.db(this.database);
    }
}

export default Database;
export const database = new Database(env.DB_HOST, env.DB_PORT, env.DB_NAME, env.DB_USER, env.DB_PASSWORD);
