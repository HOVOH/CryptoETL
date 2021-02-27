import KLine, {IKLine} from "../prices/KLine";

export enum MoneyUnits {
    MILLIONS = 6,
    DOLLARS = 0,
    CENTS = -2,
    BASE = -18,
}

export const moneyConvert = (amount:number, from: MoneyUnits, to: MoneyUnits) => {
    const baseAmt = moneyToBase(amount, from);
    return baseToMoney(baseAmt, to);
}

export const moneyToBase = (amount: number, from: MoneyUnits) => {
    return Math.round(amount*Math.pow(10,from - MoneyUnits.BASE))
}

export const baseToMoney = (amount: number, to: MoneyUnits) => {
    return amount*Math.pow(10, MoneyUnits.BASE - to)
}

export const convertCandle = (candle: IKLine, from: MoneyUnits, to: MoneyUnits) => {
    return new KLine(
        candle.time,
        moneyConvert(candle.open,from, to),
        moneyConvert(candle.high,from, to),
        moneyConvert(candle.low,from, to),
        moneyConvert(candle.close,from, to),
        moneyConvert(candle.volume,from, to),
        moneyConvert(candle.takerBaseAssetVolume,from, to),
        candle.tradeQt,
        candle.isClose
    )
}
