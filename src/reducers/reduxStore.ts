import {configureStore} from "@reduxjs/toolkit";
import {combineReducers} from "redux";
import themeReducer from "./themeSlice";
import userReducer from "./userSlice";
import loadingReducer from "./LoadingSlice";
import preferenceReducer from "./preferenceSlice";
import fileReducer from "./fileSlice";
import dateReducer from "./dateSlice";

const rootReducer = combineReducers({
    theme: themeReducer,
    users: userReducer,
    loading: loadingReducer,
    preferences: preferenceReducer,
    files: fileReducer,
    date: dateReducer,
});

const store = configureStore({
    reducer: rootReducer
});
export default store;
export type Store = ReturnType<typeof rootReducer>;
