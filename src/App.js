import React, { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme, GlobalStyles } from "./themes.js";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import NavBar from "./component/navbar/NavBar"
import Home from './component/home/Home';

import Register from './component/register/Register';
import Login from './component/login/Login';
import Layout from './component/Layout';
import Missing from './component/Missing';
import RequireAuth from "./component/RequireAuth.js";

import Contact from './component/contact/Contact';
import MyProfile from './component/myprofile/MyProfile';
import Settings from './component/settings/Settings';

import MySplit from './component/mysplit/MySplit';
import ChangeSplit from './component/mysplit/ChangeSplit';
import SelectWo from './component/workout/SelectWo';
import Workout from './component/workout/Workout';





import {
  Routes,
  Route
} from "react-router-dom";



const StyledApp = styled.div`
  color: ${(props) => props.theme.fontColor};
`;

function App() {
  const [theme, setTheme] = useState("dark");
  const [UserName, setUserName] = useState();

  const themeToggler = () => {
    theme === "light" ? setTheme("dark") : setTheme("light");
  };

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <GlobalStyles />
        <StyledApp>
            <NavBar/>

            <div className="mainContainer pb-3 pt-1 px-1 bg-dark text-white "> 
               <Routes>
                  <Route  path='/' element={<Layout/>}>
                     {/* PUBLIC ROUTES */}
                     <Route  path='/login' element={<Login/>}/>
                     <Route  path='/register' element={<Register/>}/>
                     <Route  path='/contact' element={<Contact/>}/>

                     {/* PROTECT ROUTES */}
                     <Route element={<RequireAuth/>}>
                        <Route  path='/' element={<Home/>}/>
                        <Route  path='/myprofile' element={<MyProfile/>}/>
                        <Route  path='/settings' element={<Settings/>}/>
                        <Route  path='/mysplit' element={<MySplit/>}/>
                        <Route  path='/changesplit' element={<ChangeSplit/>}/>
                        <Route  path='/select' element={<SelectWo/>}/>
                        <Route  path='/workout' element={<Workout/>}/>
                     </Route>
                  
                     {/* MISSING **************    */}
                     <Route  path='*' element={<Missing/>}/>
                  </Route>
               </Routes>
            </div>  
        </StyledApp>
    </ThemeProvider>
  );
}

export default App;

//<button onClick={() => themeToggler()}>Change Theme</button>