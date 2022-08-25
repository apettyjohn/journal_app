import {createAction, createSlice} from "@reduxjs/toolkit";
import {User} from "../objects/user";

interface userState {
    user?: User,
    users: Array<User>
}

// Setup
const initialState: userState = {user: undefined,users: []};
export const add = createAction<User>('addUser');
export const updateUser = createAction<User>('updateUser');
export const updateUsers = createAction<Array<User>>('updateUsers');
export const remove = createAction<number>('removeUser');
export const selectUser = createAction<number>('selectUser');

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
        builder.addCase(selectUser, (state, { payload }) => {
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
