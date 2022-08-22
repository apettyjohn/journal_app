import {createAction, createSlice} from "@reduxjs/toolkit";

interface fileState {
    files: Array<string>
}

// Setup
const initialState: fileState = { files: [] };
export const add = createAction<string>('add');
export const remove = createAction<string>('remove');
export const setFiles = createAction<Array<string>>('set');

// Slice
export const fileSlice = createSlice({
    name: 'files',
    initialState: initialState,
    reducers: {
        reset (state = initialState) {
            return {...state};
        },
    },
    extraReducers: (builder) => {
        builder.addCase(add, (state, { payload }) => {
            state.files.push(payload);
        });
        builder.addCase(remove, (state, { payload }) => {
            state.files.splice(state.files.indexOf(payload),1);
        });
        builder.addCase(setFiles, (state, { payload }) => {
            state.files = payload;
        });
    }
});
export type fileSliceType = ReturnType<typeof fileSlice.getInitialState>;
export const { reset } = fileSlice.actions;
export default fileSlice.reducer;
