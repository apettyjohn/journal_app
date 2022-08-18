import {createAction, createSlice} from "@reduxjs/toolkit";

interface loadingState {
    value: boolean
}

// Setup
const initialState: loadingState = {value: false};
export const toggle = createAction<boolean>('toggle');

// Slice
export const loadingSlice = createSlice({
    name: 'loading',
    initialState: initialState,
    reducers: {
        reset (state = initialState) {
            return { ...state};
        },
    },
    extraReducers: (builder) => {
        builder.addCase(toggle, (state, { payload }) => {
            state.value = payload;
        });
    }
});
export type loadingSliceType = ReturnType<typeof loadingSlice.getInitialState>;
export const { reset } = loadingSlice.actions;
export default loadingSlice.reducer;
