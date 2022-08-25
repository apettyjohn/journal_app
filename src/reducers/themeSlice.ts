import {createAction, createSlice} from "@reduxjs/toolkit";

interface themeState {
    value: string
}

// Setup
const initialState: themeState = {value: 'light'};
export const toggleTheme = createAction<string>('toggleTheme');

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
        builder.addCase(toggleTheme, (state, { payload }) => {
            const appClasses = document.getElementsByTagName("body").item(0)!.classList;
            state.value = payload;
            if (payload === 'light') {
                appClasses.replace("dark-mode", "light-mode");
            } else if (payload === 'dark') {
                appClasses.replace("light-mode", "dark-mode");
            }
        });
    }
});
export type themeSliceType = ReturnType<typeof themeSlice.getInitialState>;
export const { reset } = themeSlice.actions;
export default themeSlice.reducer;
