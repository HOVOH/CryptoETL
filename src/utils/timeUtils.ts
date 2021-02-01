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

export const timeOfCandleStart = (timestamp: number, interval: number) => {
    const date = timeToDate(timestamp);
    const msElapsed = timestamp - date.getTime();
    return timestamp - (msElapsed)%(intervalToTime(interval));
}

export const intervalToTime = (interval: number) => {
    return interval*60000;
}
