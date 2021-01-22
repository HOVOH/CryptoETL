import IPriceFeed from "./IPriceFeed";
import IPlatform from "../../platforms/Platform";
import {IPair} from "../../blockchains/Pair";
import EventEmitter from "events";
import {IPriceUpdate} from "./PriceUpdate";

class PriceFeedAggregator {

    priceFeeds:IPriceFeed[] = [];
    readonly eventEmitter = new EventEmitter();

    registerPriceFeed(priceFeed: IPriceFeed){
        if (!this.alreadyRegistered(priceFeed)){
            this.priceFeeds.push(priceFeed);
            priceFeed.onPriceUpdate(priceUpdate => {
                this.eventEmitter.emit(priceUpdate.meta.pair.toString(), priceUpdate);
            })
        }
    }

    alreadyRegistered(priceFeed: IPriceFeed){
        return this.priceFeeds.includes(priceFeed);
    }

    getPriceFeeder(platform: IPlatform){
        return this.priceFeeds.find(priceFeeder=> priceFeeder.platform === platform);
    }

    subscribeLive(pair: IPair, interval:number, platform: IPlatform, callback: (priceUpdate: IPriceUpdate)=>void): ()=>void {
        return this.subscribe(pair, interval, platform,(priceUpdate: IPriceUpdate)=>{
            if (priceUpdate.meta.interval === interval){
                callback(priceUpdate);
            }
        })
    }

    private subscribe(pair: IPair,
                      interval:number,
                      platform: IPlatform,
                      callback: (priceUpdate: IPriceUpdate)=> void): ()=>void{
        const priceFeeder = this.getPriceFeeder(platform);
        if (!priceFeeder){
            throw `${platform.name} has no price feed registered`;
        }
        priceFeeder.subscribe(pair,interval);
        this.eventEmitter.on(pair.toString(), callback);
        return () => this.unsubscribe(pair, callback);
    }

    private unsubscribe(pair: IPair, callback: (priceUpdate: IPriceUpdate)=> void){
        this.eventEmitter.removeListener(pair.toString(), callback)
    }

    subscribeOnClose(pair: IPair, interval:number, platform: IPlatform, callback: (priceUpdate: IPriceUpdate)=> void){
        this.subscribe(pair, interval, platform,(priceUpdate: IPriceUpdate)=>{
            if (priceUpdate.candle.isClose && priceUpdate.meta.interval === interval){
                callback(priceUpdate);
            }
        })
    }


}
export default PriceFeedAggregator;
