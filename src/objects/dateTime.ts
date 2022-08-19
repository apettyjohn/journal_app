import {Time} from "./time";

export interface DateTime {
    day: number,
    month: number,
    year: number,
    weekday?: string,
    time?: Time
}