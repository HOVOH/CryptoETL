import {IKLine} from "../../../src/prices/KLine";

export const wrongOpenCloseKlines: IKLine[] = [
    {
        time: 5,
        open: 10,
        high: 15,
        low: 0,
        close: 5,
        volume: 10,
        takerBaseAssetVolume: 5,
        tradeQt: 5,
        isClose: true,
    },
    {
        time: 1,
        open: 10,
        high: 15,
        low: 0,
        close: 5,
        volume: 10,
        takerBaseAssetVolume: 5,
        tradeQt: 5,
        isClose: true,
    }
];
