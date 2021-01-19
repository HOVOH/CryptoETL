import IPriceFeed from "./IPriceFeed";
import {IPair} from "../../blockchains/Pair";
import EventEmitter from 'events';
import IPriceUpdate from "./PriceUpdate";
import IPlatform from "../../platforms/Platform";

export const PRICE_FEED_UPDATE_EVENT_NAME = "priceUpdate"

interface ISubscription {
    pair: IPair,
    interval: number,
}

abstract class SimplePriceFeed implements IPriceFeed {

    readonly eventEmitter = new EventEmitter()
    readonly platform: IPlatform;
    protected subscriptions: ISubscription[] = [];

    protected constructor(platform: IPlatform) {
        this.platform = platform;
    }

    subscribe = (pair: IPair, interval: number): void => {
        if (!this.alreadySubscribed(pair, interval)){
            this.registerListener(pair, interval);
            this.subscriptions.push({pair, interval});
        }
    }

    alreadySubscribed = (pair: IPair, interval: number): boolean => {
        return !!this.subscriptions.find(sub => sub.pair.toString() === pair.toString() && sub.interval === interval);
    }

    abstract registerListener(pair: IPair, interval: number): void ;

    intervalToLabel = (interval: number): string => {
        if (interval < 60){
            return interval+"m"
        } else if (interval < 1440){
            return (interval/60)+"h"
        } else {
            return (interval/1440)+"d"
        }
    }

    emit = (priceUpdate: IPriceUpdate): void => {
        this.eventEmitter.emit(PRICE_FEED_UPDATE_EVENT_NAME, priceUpdate)
    }

    onPriceUpdate( callback: (priceUpdate: IPriceUpdate) => void): void {
        this.eventEmitter.on(PRICE_FEED_UPDATE_EVENT_NAME, callback);
    }

}

export default SimplePriceFeed;
