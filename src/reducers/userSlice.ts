import {createAction, createSlice} from "@reduxjs/toolkit";
import {User} from "../objects/user";

interface userState {
    user?: User,
    users: Array<User>
}

// Setup
const initialState: userState = {user: undefined,users: []};
export const add = createAction<User>('add');
export const update = createAction<User>('update');
export const remove = createAction<number>('remove');
export const select = createAction<User>('select');

// Slice
export const userSlice = createSlice({
    name: 'theme',
    initialState: initialState,
    reducers: {
        reset (state = initialState) {
            return { ...state};
        },
    },
    extraReducers: (builder) => {
        builder.addCase(add, (state, { payload }) => {
            state.users.push(payload);
        });
        builder.addCase(update, (state, { payload }) => {
            let temp = [...state.users];
            temp[temp.indexOf(payload)] = payload;
            state.users = temp;
        });
        builder.addCase(remove, (state, { payload }) => {
            if (payload > -1 && payload < state.users.length) {
                state.users.splice(payload,1);
            }
        });
        builder.addCase(select, (state, { payload }) => {
            state.user = payload;
        });
    }
});
export type userSliceType = ReturnType<typeof userSlice.getInitialState>;
export const { reset } = userSlice.actions;
export default userSlice.reducer;
