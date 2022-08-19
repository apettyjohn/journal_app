import {createAction, createSlice} from "@reduxjs/toolkit";
import {User} from "../objects/user";

interface userState {
    user?: User,
    users: Array<User>
}

// Setup
const initialState: userState = {user: undefined,users: []};
export const add = createAction<User>('add');
export const updateUser = createAction<User>('update');
export const updateUsers = createAction<Array<User>>('update users');
export const remove = createAction<number>('remove');
export const select = createAction<number>('select');

// Slice
export const userSlice = createSlice({
    name: 'users',
    initialState: initialState,
    reducers: {
        reset (state) {
            state.user = undefined;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(add, (state, { payload }) => {
            state.users.push(payload);
        });
        builder.addCase(updateUser, (state, { payload }) => {
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
            state.user = state.users[payload];
        });
        builder.addCase(updateUsers, (state, { payload }) => {
            state.users = payload;
        });
    }
});
export type userSliceType = ReturnType<typeof userSlice.getInitialState>;
export const { reset } = userSlice.actions;
export default userSlice.reducer;
