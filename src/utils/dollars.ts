
export enum MoneyUnits {
    MILLIONS = 6,
    DOLLARS = 0,
    CENTS = -2,
    BASE = -10,
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
