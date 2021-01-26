import {IPair} from "../blockchains/Pair";
import IPlatform from "../platforms/Platform";

export interface IMonitor {
    pair: IPair,
    platform: IPlatform,
    interval: number,
    toString(): string;
}

class Monitor implements IMonitor {

    interval: number;
    platform: IPlatform;
    pair: IPair;

    constructor(pair: IPair, origin: IPlatform, interval: number) {
        this.pair = pair;
        this.platform = origin;
        this.interval = interval;
    }

    toString():string {
        return this.platform.name+":"+this.pair.toString()+":"+this.interval
    }
}

export default Monitor;
