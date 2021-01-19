export abstract class Registry<K, T>{
    private values: T[];

    constructor(values: T[] = []) {
        this.values = values;
    }

    add(t: T){
        this.values.push(t);
    }

    protected abstract findPredicate(key: K): (value: T)=>boolean;

    find(key: K){
        return this.values.find(this.findPredicate(key));
    }

}
