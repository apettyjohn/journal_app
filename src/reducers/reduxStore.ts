import {configureStore} from "@reduxjs/toolkit";
import {combineReducers} from "redux";
import themeReducer from "./themeSlice";
import userReducer from "./userSlice";
import loadingReducer from "./LoadingSlice";
import preferenceReducer from "./preferenceSlice";

const rootReducer = combineReducers({
    theme: themeReducer,
    users: userReducer,
    loading: loadingReducer,
    preferences: preferenceReducer,
});

const store = configureStore({
    reducer: rootReducer
});
export default store;
export type Store = ReturnType<typeof rootReducer>;
