import {createAction, createSlice} from "@reduxjs/toolkit";

interface themeState {
    value: string
}

// Setup
const initialState: themeState = {value: 'light'};
export const toggle = createAction<string>('toggle');

// Slice
export const themeSlice = createSlice({
    name: 'theme',
    initialState: initialState,
    reducers: {
        reset (state = initialState) {
            return { ...state};
        },
    },
    extraReducers: (builder) => {
        builder.addCase(toggle, (state, { payload }) => {
            if (payload === 'light' || payload === 'dark') {
                state.value = payload;
            }
        });
    }
});
export type themeSliceType = ReturnType<typeof themeSlice.getInitialState>;
export const { reset } = themeSlice.actions;
export default themeSlice.reducer;
