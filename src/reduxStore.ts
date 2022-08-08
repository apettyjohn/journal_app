import {configureStore, createSlice} from "@reduxjs/toolkit";

const counterSlice = createSlice({
    name: 'counter',
    initialState: {
        value: 0
    },
    reducers: {
        incremented: state => {
            state.value += 1
        },
        decremented: state => {
            state.value -= 1
        }
    }
});
export const { incremented, decremented } = counterSlice.actions;

const store = configureStore({
    reducer: counterSlice.reducer
});
export default store;
