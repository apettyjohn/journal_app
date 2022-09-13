import {createAction, createSlice} from "@reduxjs/toolkit";
import {Preference} from "../objects/preference";

interface preferenceState {
    lastLoggedIn: number | null,
    users: Array<Preference>
}
interface preferenceChange {
    id: number,
    theme?: string,
    accentColor?: string,
    stayLoggedIn?: boolean
}

// Setup
const initialState: preferenceState = { lastLoggedIn: null, users: [] };
export const changePreference = createAction<preferenceChange>('changePreference');
export const setPreferences = createAction<preferenceState>('setPreferences');
export const changeLastLoggedIn = createAction<number | null>('changeLastLoggedIn');

// Slice
export const preferenceSlice = createSlice({
    name: 'preferences',
    initialState: initialState,
    reducers: {
        reset (state = initialState) {
            return {...state};
        },
    },
    extraReducers: (builder) => {
        builder.addCase(setPreferences, (state, { payload }) => {
            state.users = payload.users;
            state.lastLoggedIn = payload.lastLoggedIn;
        });
        builder.addCase(changePreference, (state, { payload }) => {
            let index = -1;
            state.users.forEach((user,i) => {
                if (user.id === payload.id) index = i;
            });
            if (index >= 0) state.users[index] = {...state.users[index],...payload};
        });
        builder.addCase(changeLastLoggedIn, (state, { payload }) => {
            state.lastLoggedIn = payload;
        });
    }
});
export const { reset } = preferenceSlice.actions;
export default preferenceSlice.reducer;
