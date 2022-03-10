import {React, useState } from 'react';
import { Route, Routes, useNavigate, Navigate } from "react-router-dom"
import './App.css';
import { ThemeProvider } from "@mui/material";
import appThemeMui from "./theme/appThemeMui";
import Onboard from "./pages/Onboard";
import ShelterList from "./pages/ShelterList";
import ShelterDetail from "./pages/ShelterCardDetail";
import Auth from "./pages/Auth/Auth";
import SignUp from "./pages/Auth/SignUp";
import SignIn from "./pages/Auth/SignIn";

const App = () => {

  const [user, setUser] = useState(null);
  const [shelterData, setShelterData] = useState(null);

  const navigate = useNavigate();

  // useEffect(() => {
  //  navigate('/app/dashboard')
  // }, [])

  return (
    <>
      <ThemeProvider theme={appThemeMui}>
        <Routes>

          <Route index path="/app/dashboard" element={
            <ShelterList user={user} setUser={setUser} setShelterData={setShelterData}/>
          } />

          <Route path="/app/auth" element={<Auth/>}>
            <Route path="sign-up" element={
              <SignUp setUser={setUser}/>
            } />
            <Route path="sign-in" element={
              <SignIn setUser={setUser}/>
            } />    
          </Route>

          <Route exact path="/app/onboard" element={
            <Onboard/>
          } />

          <Route path="app/shelter-detail/:id" element={
            <ShelterDetail data={shelterData}/>
          } />

          <Route path="*" element={
            <Navigate to="/app/dashboard"/>
          } />
        </Routes>
      </ThemeProvider>
    </>
  );
}

export default App;
