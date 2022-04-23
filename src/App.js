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
import Bookmarks from './components/Bookmarks';
import AppContext from './AppContext'
import { Amplify } from 'aws-amplify';
// window.LOG_LEVEL = 'DEBUG';

//TODO: (Amanda) update the endpoint stage
Amplify.configure({
  Storage: {
    AWSS3: {
        bucket: 'socialtechcapstone', //REQUIRED -  Amazon S3 bucket name 
        region: 'us-east-1'   
    }
  },
  API : {
    endpoints: [
      {
        name: "SocialTechService",
        endpoint: "https://wf5o6g6zs3.execute-api.us-east-1.amazonaws.com/test",
        region: "us-east-1"
      }
    ]
  },
  Auth: {
      // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
      identityPoolId: 'us-east-1:59aad359-d8f3-4941-93dd-3b6b6606c66c',
      
      // REQUIRED - Amazon Cognito Region
      region: 'us-east-1',

      // OPTIONAL - Amazon Cognito Federated Identity Pool Region 
      // Required only if it's different from Amazon Cognito Region
      identityPoolRegion: 'us-east-1',

      // OPTIONAL - Amazon Cognito User Pool ID
      userPoolId: 'us-east-1_cpkAakPIu',

      // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolWebClientId: '59k6mv91ts53u5ld578kvllink',

      // OPTIONAL - Enforce user authentication prior to accessing AWS resources or not
      mandatorySignIn: false,

      // OPTIONAL - Configuration for cookie storage
      // Note: if the secure flag is set to true, then the cookie transmission requires a secure protocol
      cookieStorage: {
      // REQUIRED - Cookie domain (only required if cookieStorage is provided)
          domain: 'localhost',
      // OPTIONAL - Cookie path
          path: '/',
      // OPTIONAL - Cookie expiration in days
          expires: 365,
      // OPTIONAL - Cookie secure flag
      // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
          secure: false
      },
      authenticationFlowType: 'USER_PASSWORD_AUTH',
      oauth: {
        domain: 'socialtech.auth.us-east-1.amazoncognito.com',
        scope: ['openid', 'aws.cognito.signin.user.admin'],
        redirectSignIn: 'http://localhost:3000',//TODO: update later when deploying 
        redirectSignOut: 'http://localhost:3000',
        responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
    }
  }
});

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
        //TODO: Amanda check
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
  //TODO: Amanda: add the post_id
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
            <ShelterList loaderActive={false} user={user} setUser={setUser} shelterData={shelterData} setShelterData={setShelterData}/>
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

          <Route path="app/bookmarks" element={
            <Bookmarks user={user} setUser={setUser} />
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