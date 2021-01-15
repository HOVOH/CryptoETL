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

}

export default TaLib;
