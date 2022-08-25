import {createAction, createSlice} from "@reduxjs/toolkit";
import {Preference} from "../objects/preference";

interface preferenceState {
    preferences: Array<Preference>
}

// Setup
const initialState: preferenceState = { preferences: [] };
export const add = createAction<Preference>('addPreference');
export const remove = createAction<Preference>('removePreference');
export const setPreferences = createAction<Array<Preference>>('setPreferences');

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
        builder.addCase(add, (state, { payload }) => {
            state.preferences.push(payload);
        });
        builder.addCase(remove, (state, { payload }) => {
            state.preferences.splice(state.preferences.indexOf(payload),1);
        });
        builder.addCase(setPreferences, (state, { payload }) => {
            state.preferences = payload;
        });
    }
});
export type preferenceSliceType = ReturnType<typeof preferenceSlice.getInitialState>;
export const { reset } = preferenceSlice.actions;
export default preferenceSlice.reducer;
