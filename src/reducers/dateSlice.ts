import {createAction, createSlice} from "@reduxjs/toolkit";
import {DateTime, monthDays, parseDate} from "../objects/dateTime";
import {Time} from "../objects/time";

interface dateState {
    today: DateTime,
    selected: DateTime
}

function getDate(): DateTime {
    const d0 = new Date();
    const d1 = d0.toLocaleString().split(' ');
    const d2 = d0.toString().split(' ');
    const date = d1[0].split("/");
    const time = d1[1].split(":");
    return {
        day: Number(date[1]),
        month: Number(date[0]),
        year: Number(date[2].substring(0,date[2].length-1)),
        weekdayName: d2[0],
        weekdayNumber: d0.getDay(),
        monthName: d2[1],
        time: {
            twelveHr: true,
            hour: Number(time[0]),
            minute: Number(time[1]),
            second: Number(time[0]),
            amOrPm: d1[2]
        } as Time
    } as DateTime;
}

// Setup
const initialState: dateState = {today: getDate(), selected: getDate()};
export const selectDate = createAction<DateTime>('selectDate');
export const forwardDay = createAction('forwardDay');
export const forwardMonth = createAction('forwardMonth');
export const backDay = createAction('backDay');
export const backMonth = createAction('backMonth');

// Slice
export const dateSlice = createSlice({
    name: 'date',
    initialState: initialState,
    reducers: {
        refresh(state = {today: getDate(), selected: getDate()}) {
            return {...state};
        },
    },
    extraReducers: (builder) => {
        builder.addCase(selectDate, (state, {payload}) => {
            state.today = getDate();
            state.selected = payload;
        });
        builder.addCase(forwardDay, (state) => {
            if (state.selected.day === monthDays[state.selected.month-1]){
                if (state.selected.month === 12) {
                    state.selected = parseDate(1,1, state.selected.year+1);
                } else {
                    state.selected = parseDate(1,state.selected.month+1, state.selected.year);
                }
            } else {
                state.selected = parseDate(state.selected.day+1,state.selected.month, state.selected.year);
            }
        });
        builder.addCase(forwardMonth, (state) => {
            if (state.selected.month === 12){
                state.selected = parseDate(state.selected.day,1, state.selected.year+1);
            } else {
                state.selected = parseDate(state.selected.day,state.selected.month+1, state.selected.year);
            }
        });
        builder.addCase(backDay, (state) => {
            if (state.selected.day === 1){
                if (state.selected.month === 1) {
                    state.selected = parseDate(31,12, state.selected.year-1);
                } else {
                    state.selected = parseDate(monthDays[state.selected.month-2],state.selected.month-1, state.selected.year);
                }
            } else {
                state.selected = parseDate(state.selected.day-1,state.selected.month, state.selected.year);
            }
        });
        builder.addCase(backMonth, (state) => {
            if (state.selected.month === 1){
                state.selected = parseDate(state.selected.day,12, state.selected.year-1);
            } else {
                state.selected = parseDate(state.selected.day,state.selected.month-1, state.selected.year);
            }
        });
    }
});
export const {refresh} = dateSlice.actions;
export default dateSlice.reducer;
