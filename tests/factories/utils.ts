export const under = (max:number) => {
    return between(0, max);
}

export const over = (min: number) => {
    return between(min, 100000)
}

export const between = (min:number, max:number) => {
    return Math.random() * (max - min) + min;
}
