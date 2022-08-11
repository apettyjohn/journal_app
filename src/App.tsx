import React from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.css';
import Account from "./views/Account";
import Edit from "./views/Edit";
import Login from "./views/Login";
import Main from "./views/Main";
import {Store} from "./reduxStore";
import {useDispatch, useSelector} from "react-redux";
import {toggle} from "./reducers/themeSlice";
import FileModal from "./views/components/FileModal";

function App() {
    const dispatch = useDispatch();
    const theme = useSelector((state: Store) => state.theme.value);

    function swapThemeClass () {
        const appClasses = document.getElementsByTagName("body").item(0)!.classList;
        (theme === 'light')?
            appClasses.replace("light-mode", "dark-mode") :
            appClasses.replace("dark-mode", "light-mode");
    }

    return (
      <div id="app">
          <FileModal />
          <div id="file-output"></div>
          <button onClick={() => {
              swapThemeClass();
              (theme === 'light')? dispatch(toggle('dark')): dispatch(toggle('light'));
          }}>Change Mode</button>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="login" element={<Login />} />
                <Route path="account" element={<Account />} />
                <Route path="home" element={<Main />} />
                <Route path="edit" element={<Edit />} />
            </Routes>
        </BrowserRouter>
      </div>);
}

export default App;
