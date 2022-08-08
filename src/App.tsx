import React from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import './App.css';
import Account from "./views/Account";
import Edit from "./views/Edit";
import Login from "./views/Login";
import Main from "./views/Main";

function App() {
    return (
      <div id="app" className="light-mode">
          <button onClick={() => {
              const appClasses = document.getElementById("app")!.classList;
              console.log(appClasses);
              appClasses.contains("light-mode")? appClasses.replace("light-mode","dark-mode"): appClasses.replace("dark-mode","light-mode");
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
