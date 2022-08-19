import React from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {BrowserRouter, Link, Route, Routes} from 'react-router-dom';
import './App.css';
import Account from "./views/Account/Account";
import Edit from "./views/Edit/Edit";
import Login from "./views/Login/Login";
import Main from "./views/Main/Main";
import {Store} from "./reduxStore";
import {useDispatch, useSelector} from "react-redux";
import {toggle} from "./reducers/themeSlice";
import FileModal from "./views/Other/FileModal";
import {Button} from "@material-ui/core";

function App() {
    const dispatch = useDispatch();
    const theme = useSelector((state: Store) => state.theme.value);

    function swapThemeClass() {
        const appClasses = document.getElementsByTagName("body").item(0)!.classList;
        (theme === 'light') ?
            appClasses.replace("light-mode", "dark-mode") :
            appClasses.replace("dark-mode", "light-mode");
    }
    async function init() {

    }

    return (
        <div id="app" data-loaded="" onClick={init}>
            <BrowserRouter>
                <div style={{border: '1px solid'}}>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <FileModal/>
                        <Button variant="contained" onClick={() => {
                            swapThemeClass();
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

export default App;
