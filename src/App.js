import React, { useState, createContext, useEffect } from 'react';
import { Route, Routes, useNavigate, Navigate } from "react-router-dom"
import './App.css';
import { ThemeProvider } from "@mui/material";
import appThemeMui from "./theme/appThemeMui";
import ShelterList from "./pages/ShelterList";
import ShelterDetail from "./pages/ShelterCardDetail";
import AuthenticatorGrid from "./pages/auth/AuthenticatorGrid";
import SignUp from "./pages/auth/SignUp";
import SignIn from "./pages/auth/SignIn";
import { Auth } from 'aws-amplify';
import { useStore } from './pages/Hook';
import Onboard from "./pages/onboard/Onboard";
import IntroPage from './pages/onboard/IntroPage';
import SelectAccountPage from './pages/onboard/SelectAccountPage';
import RegularUserPage from './pages/onboard/RegularUserPage';
import OrgPage from './pages/onboard/OrgUser';
import CompletedPage from './pages/onboard/CompletedPage';
import { Button, Typography } from '@mui/material';
import AppContext from './AppContext';
//window.LOG_LEVEL = 'DEBUG';

//TODO: (Amanda) update the endpoint stage

const ZIPCODE_PLACEHOLDER = 98105

const App = () => {
  const [user, setUser] = useState(null);
  const [shelterData, setShelterData] = useState(undefined);
  const [userStatus, setUserStatus] = useState(null)
  const navigate = useNavigate();
  const apiStore = useStore();  

  Auth.currentAuthenticatedUser()
      .then(userData => setUser(userData.username))
      .catch(() => console.log('Not signed in'));

  useEffect(() => {
    const getShelterData = async () => {
      try {
        const shelterDataResponse = await apiStore.loadOverview(ZIPCODE_PLACEHOLDER, ZIPCODE_PLACEHOLDER)
        console.log("Shelter data: ", shelterDataResponse)
        setShelterData(shelterDataResponse)
      } catch (err) {
        console.log(err.message)
      }
    }

    const getUserStatus = async () => {
      try {
          // const userData = await Auth.currentAuthenticatedUser();
          // console.log(userData);
          //Yichi: to call api do this 2
          const userStatusResponse = await apiStore.getUserStatus(user);
          setUserStatus(userStatusResponse.UserStatus)
      } catch (err) {
          console.log(err);
          console.log("Error in fetching user status: Not authenticated");
      }
    }

    getShelterData();
    getUserStatus();
  }, [user, userStatus, apiStore])
  
  //TODO: (Yichi) 
  //the following line 101 - 109 is a code to upload individual img to s3 bucket
  //you will need to modify react code to take the input to take mutiple images and call api on each image
  return (
    <AppContext.Provider value={{
        user: user,
        setUser: setUser,
        userStatus: userStatus,
        setUserStatus: setUserStatus
    }}>
      <ThemeProvider theme={appThemeMui}>
        <Routes>

          <Route index path="/app/dashboard" element={
            <ShelterList user={user} setUser={setUser} shelterData={shelterData} setShelterData={setShelterData}/>
          } />

          <Route path="/app/auth" element={<AuthenticatorGrid/>}>
            <Route path="sign-up" element={
              <SignUp setUser={setUser}/>
            } />
            <Route path="sign-in" element={
              <SignIn/>
            } />    
          </Route>

          <Route exact path="/app/onboard" element={<Onboard/>}>
            <Route path="intro" element={
              <IntroPage/>
            } />
            <Route path="select-account-type" element={
              <SelectAccountPage/>
            } />
            <Route path="reg-user" element={
              <RegularUserPage/>
            } />
            <Route path="org-user" element={
              <OrgPage/>
            } />
            <Route path="completed" element={
              <CompletedPage/>
            } />
          </Route>

          <Route path="app/shelter-detail/:id" element={
            <ShelterDetail shelterData={shelterData}/>
          } />

          <Route path="*" element={
            <Navigate to="/app/dashboard"/>
          } />
        </Routes>
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export default App;
