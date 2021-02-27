const talib = require("talib");

class TaLib {

    static execute(args: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            talib.execute(args, (error, result)=> {
                if (error){
                    reject(error)
                } else {
                    resolve(result);
                }
            })
        })
    }

    static async sma(array: number[], window: number, start = 0){
        const sma = await this.execute({
            name: "SMA",
            startIdx: start,
            endIdx: array.length - 1,
            inReal: array,
            optInTimePeriod: window
        });
        return sma.result.outReal
    }

}

export default TaLib;
