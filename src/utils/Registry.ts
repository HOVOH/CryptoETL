export abstract class Registry<K, T>{
    private values: T[];

    constructor(values: T[] = []) {
        this.values = values;
    }

    add(t: T){
        this.values.push(t);
    }

    protected abstract findPredicate(key: K): (value: T)=>boolean;

    find(key: K): T{
        const value = this.values.find(this.findPredicate(key));
        if (value){
            return value;
        }
        return this.orDefault(key);
    }

    orDefault(key: K): T{
        return null;
    }

}
