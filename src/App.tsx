import React from 'react';
import {BrowserRouter, Link, Route, Routes} from 'react-router-dom';
import './App.css';
import Account from "./views/Account/Account";
import Edit from "./views/Edit/Edit";
import Login from "./views/Login/Login";
import Main from "./views/Main/Main";
import {Store} from "./reducers/reduxStore";
import {useDispatch, useSelector} from "react-redux";
import {toggle} from "./reducers/themeSlice";
import FileModal from "./views/Other/FileModal";
import {Button} from "@material-ui/core";
import {User} from "./objects/user";
import {Preference} from "./objects/preference";
import {setPreferences} from "./reducers/preferenceSlice";
import {updateUsers} from "./reducers/userSlice";
import {setFiles} from "./reducers/fileSlice";

interface UsersJson { users: Array<User> }
interface PreferencesJson { preferences: Array<Preference> }

export default function App() {
    const dispatch = useDispatch();
    const theme = useSelector((state: Store) => state.theme.value);
    const users = useSelector((state: Store) => state.users.users);
    const preferences = useSelector((state: Store) => state.preferences.preferences);

    function logState(){
        // console.log(JSON.stringify(users),JSON.stringify(preferences));
        const app = document.getElementById("app");
        if (app !== null && app.dataset.loaded === "") {
            app.addEventListener("click",init);
            app.click();
        }
    }
    async function init() {
        // console.log("running app init");
        const cacheName = "journal-app-files";
        const files = ["users.json","preferences.json","files.json"];
        const cache = await caches.open(cacheName);
        for (let file of files) {
            const name = file.split('.')[0];
            const url = `http://localhost:3000/files/${file}`;
            const response = await cache.match(url);
            if (response === undefined) {
                console.log(`failed to load ${file} from cache into store`);
                continue;
            }
            const data = await response.text();
            if (name === "users") {
                const newState = JSON.parse(data) as UsersJson;
                dispatch(updateUsers(newState.users));
            } else if (name === "preferences") {
                const newState = JSON.parse(data) as PreferencesJson;
                dispatch(setPreferences(newState.preferences));
            } else if (name === "preferences") {
                const newState = JSON.parse(data) as {files: Array<string>};
                dispatch(setFiles(newState.files));
            }
        }
        // console.log("ran app init");
        const app = document.getElementById("app")!;
        app.removeEventListener("click",init);
        app.dataset.loaded = "true";
    }

    return (
        <div id="app" data-loaded="" onClick={logState}>
            <BrowserRouter>
                <div style={{border: '1px solid'}}>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <FileModal/>
                        <Button variant="contained" onClick={() => {
                            (theme === 'light') ? dispatch(toggle('dark')) : dispatch(toggle('light'));
                        }}>Change Theme</Button>
                        <span style={{flexGrow: '1'}}></span>
                        <Button variant="contained" component={Link} to="login">Login</Button>
                        <Button variant="contained" component={Link} to="account">Account</Button>
                        <Button variant="contained" component={Link} to="home">Home</Button>
                        <Button variant="contained" component={Link} to="edit">Edit</Button>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <input id="file-input"/>
                        <Button variant="contained" onClick={() => {
                            document.getElementById("file-output")!.innerText = "";
                        }}>Clear output</Button>
                        <div id="file-output"></div>
                    </div>
                </div>
                <Routes>
                    <Route path="/" element={<Login/>}/>
                    <Route path="login" element={<Login/>}/>
                    <Route path="account" element={<Account/>}/>
                    <Route path="home" element={<Main/>}/>
                    <Route path="edit" element={<Edit/>}/>
                </Routes>
            </BrowserRouter>
        </div>);
}
