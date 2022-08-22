import {Time} from "./time";

export interface DateTime {
    day: number,
    month: number,
    year: number,
    weekdayNumber: number,
    weekdayName: string,
    monthName: string,
    time?: Time
}

export const weekDaysLong = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const weekDaysShort = ["S", "M", "T", "W", "T", "F", "S"];

export const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

export const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export function arrayMaker(start: number, end: number, includeEnd?: boolean){
    end = (includeEnd)? end + 1 : end;
    const temp = [];
    for (let i=start;i<end;i++){
        temp.push(i);
    }
    return temp;
}

export function parseDate(day: number, month: number, year: number) {
    const date = new Date(year,month-1,day).toString().split(' ');
    return {day: day,month: month, year: year, weekdayName: date[0], monthName: date[1],
        weekdayNumber: weekDaysLong.indexOf(date[0])} as DateTime;
}