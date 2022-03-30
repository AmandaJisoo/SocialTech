import {React, useState } from 'react';
import { Route, Routes, useNavigate, Navigate } from "react-router-dom"
import './App.css';
import { ThemeProvider } from "@mui/material";
import appThemeMui from "./theme/appThemeMui";
import Onboard from "./pages/Onboard";
import ShelterList from "./pages/ShelterList";
import ShelterDetail from "./pages/ShelterCardDetail";
import AuthenticatorGrid from "./pages/Auth/AuthenticatorGrid";
import SignUp from "./pages/Auth/SignUp";
import SignIn from "./pages/Auth/SignIn";
import { Amplify, Auth } from 'aws-amplify';
window.LOG_LEVEL = 'DEBUG';

//TODO: update the endpoint stage
Amplify.configure({
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
        redirectSignIn: 'http://localhost:3000',
        redirectSignOut: 'http://localhost:3000',
        responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
    }
  }
});

const App = () => {
  const [user, setUser] = useState(null);
  const [shelterData, setShelterData] = useState(null);

  Auth.currentAuthenticatedUser()
      .then(userData => setUser(userData.username))
      .catch(() => console.log('Not signed in'));
  console.log(shelterData)
  const navigate = useNavigate();

  // useEffect(() => {
  //  navigate('/app/dashboard')
  // }, [])

  return (
    <>
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
