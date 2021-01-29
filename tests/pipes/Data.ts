class Data {
    modified: boolean = false;
    modifiedCounter: number = 0;
    valid: boolean = true;

    modify(){
        this.modified = true;
        this.modifiedCounter++;
    }
}

export default Data;

export const generateData = (quantity: number) => {
    const collection: Data[] = [];
    [...Array(quantity).keys()].forEach(() => collection.push(new Data()));
    return collection;
}
