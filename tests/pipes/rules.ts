import {IRule} from "../../src/pipeline/IRule";
import CriticalDataError from "../../src/pipeline/CriticalDataError";
import DataError from "../../src/pipeline/DataError";
import Data from "./Data";

export const criticalErrorRule: IRule<any> = () => {
    throw new CriticalDataError("always throw this error");
}

export const dataErrorRule: IRule<any> = () => {
    throw new DataError("always throw this error");
}

export const modifyDataRule: IRule<Data> = (data)=>{
    data.modify();
    return data;
}

export const validDataRule: IRule<Data> = (data)=>{
    if (!data.valid){
        throw new CriticalDataError("Data invalid");
    }
    return data;
}
