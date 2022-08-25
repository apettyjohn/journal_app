import {createAction, createSlice} from "@reduxjs/toolkit";
import {parseName} from "../views/Login/Components/ProfilePic";
import {User} from "../objects/user";

interface fileState {
    allFiles: Array<string>,
    userFiles: Array<string>
}
interface setFilesPayload {
    files: Array<string>,
    user: User | undefined
}

// Setup
const initialState: fileState = { allFiles: [], userFiles: [] };
export const setAllFiles = createAction<setFilesPayload>('setAllFiles');


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
        builder.addCase(setAllFiles, (state, { payload }) => {
            state.allFiles = payload.files;
            const user = payload.user;
            if (user) {
                let temp: Array<string> = [];
                payload.files.forEach((file) => {
                    const fileStr = file.split('_');
                    const initials = fileStr[0];
                    const id = Number(fileStr[fileStr.length - 1].split('.')[0]);
                    if (parseName(user.name) === initials && user.id === id) temp.push(file);
                });
                state.userFiles = temp;
            }
        });
    }
});

export const { reset } = fileSlice.actions;
export default fileSlice.reducer;
