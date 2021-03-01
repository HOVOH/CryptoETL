const talib = require("talib");

interface ITaLibResult{
    begIndex: number,
    nbElement: number,
    result: {
        outReal: number[]
    }
}

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

    static async sma(array: number[], window: number, start = 0): Promise<number[]>{
        const sma = await this.execute({
            name: "SMA",
            startIdx: start,
            endIdx: array.length - 1,
            inReal: array,
            optInTimePeriod: window
        }) as ITaLibResult;
        return this.padResult(sma);
    }

    static padResult(result: ITaLibResult): number[]{
        let out = new Array(result.begIndex+result.nbElement);
        out = out.fill(null, 0, result.begIndex);
        for (let i = 0; i < result.nbElement; i++){
            out[i+result.begIndex] = result.result.outReal[i];
        }
        return out;
    }

}

export default TaLib;
