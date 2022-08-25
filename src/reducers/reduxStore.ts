import {configureStore} from "@reduxjs/toolkit";
import {combineReducers} from "redux";
import themeReducer from "./themeSlice";
import userReducer from "./userSlice";
import loadingReducer from "./LoadingSlice";
import preferenceReducer from "./preferenceSlice";
import dateReducer from "./dateSlice";
import fileReducer from "./fileSlice";

const rootReducer = combineReducers({
    theme: themeReducer,
    users: userReducer,
    loading: loadingReducer,
    preferences: preferenceReducer,
    date: dateReducer,
    files: fileReducer,
});

const store = configureStore({
    reducer: rootReducer
});
export default store;
export type Store = ReturnType<typeof rootReducer>;
