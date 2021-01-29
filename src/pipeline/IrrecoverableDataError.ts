class IrrecoverableDataError extends Error implements IPipeError{
    throwAway = true;
    constructor(reason) {
        super(reason);
    }
}

export default IrrecoverableDataError;
