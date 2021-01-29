export const roundTimeToS = (time: number) => {
    return Math.floor(time/1000)*1000;
}

export const timeToDate = (timestamp: number) => {
    const time = new Date(timestamp);
    time.setUTCHours(0);
    time.setUTCMinutes(0);
    time.setUTCSeconds(0);
    time.setUTCMilliseconds(0);
    return time;
}
