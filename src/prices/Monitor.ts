import {IPair} from "../blockchains/Pair";
import IPlatform from "../platforms/Platform";

export interface IMonitor {
    pair: IPair,
    origin: IPlatform,
    interval: number,
}

class Monitor implements IMonitor {

    interval: number;
    origin: IPlatform;
    pair: IPair;

    constructor(pair: IPair, origin: IPlatform, interval: number) {
        this.pair = pair;
        this.origin = origin;
        this.interval = interval;
    }
}

export default Monitor;
