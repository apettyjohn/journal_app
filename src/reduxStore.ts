import {configureStore} from "@reduxjs/toolkit";
import {combineReducers} from "redux";
import themeReducer from "./reducers/themeSlice";
import userReducer from "./reducers/userSlice";
import loadingReducer from "./reducers/LoadingSlice";

const rootReducer = combineReducers({
    theme: themeReducer,
    user: userReducer,
    loading: loadingReducer,
});

const store = configureStore({
    reducer: rootReducer
});
export default store;
export type Store = ReturnType<typeof rootReducer>;
