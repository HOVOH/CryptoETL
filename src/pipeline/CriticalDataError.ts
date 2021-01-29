import PipeError from "./PipeError";

class CriticalDataError extends PipeError{
    constructor(reason) {
        super(true, reason);
    }
}

export default CriticalDataError; //comment
