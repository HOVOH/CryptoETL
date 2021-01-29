interface IPipeError {
    throwAway: boolean;
}

class PipeError extends Error implements IPipeError{

    throwAway: boolean;

    constructor(throwAway: boolean, message: string) {
        super(message);
        this.throwAway = throwAway;
    }

}
export default PipeError;
