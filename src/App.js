import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from "react-router-dom"
import './App.css';
import { ThemeProvider } from "@mui/material";
import appThemeMui from "./theme/appThemeMui";
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
import RegularUserProfile from './pages/profile/RegularUserProfile';
import { Button } from '@mui/material';
import AppContext from './AppContext'
import { Amplify } from 'aws-amplify';
import Dashboard from './pages/Dashboard'
import OrgUserProfile from './pages/profile/OrgUserProfile';
import AppMenu from './components/AppMenu'
import AboutUs from './pages/AboutUs';
// window.LOG_LEVEL = 'DEBUG';

let cookieDomain = 'localhost';
let redirectSignIn = 'http://localhost:3000';
let redirectSignOut = 'http://localhost:3000';
let secureCookie = false;
const API_KEY = "AIzaSyAuMD4BYcnn_dTDIe0RJIKjsjNElEEk2Xw"

const deployConfig = {
  'https://uw-social-tech.netlify.app': {
    cookieDomain: 'uw-social-tech.netlify.app',
    redirectSignIn: 'https://uw-social-tech.netlify.app',
    redirectSignOut: 'https://uw-social-tech.netlify.app',
    secureCookie: true
  }
}

const location = window.location.origin

if (location in deployConfig) {
  cookieDomain = deployConfig[location].cookieDomain
  redirectSignIn = deployConfig[location].redirectSignIn
  redirectSignOut = deployConfig[location].redirectSignOut
  secureCookie = deployConfig[location].secureCookie
}

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
          // domain: 'localhost',
          domain: cookieDomain,
      // OPTIONAL - Cookie path
          path: '/',
      // OPTIONAL - Cookie expiration in days
          expires: 365,
      // OPTIONAL - Cookie secure flag
      // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
          secure: secureCookie,
      },
      authenticationFlowType: 'USER_PASSWORD_AUTH',
      oauth: {
        domain: 'socialtech.auth.us-east-1.amazoncognito.com',
        scope: ['openid', 'aws.cognito.signin.user.admin'],
        // redirectSignIn: 'http://localhost:3000',//TODO: update later when deploying 
        // redirectSignOut: 'http://localhost:3000',
        redirectSignIn: redirectSignIn,//TODO: update later when deploying 
        redirectSignOut: redirectSignOut,
        responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
    }
  }
});

const App = () => {
  const [user, setUser] = useState(null);
  const [shelterData, setShelterData] = useState([]);
  const [userStatus, setUserStatus] = useState(null)
  const { apiStore, appStore } = useStore(); 
  const [dataLoading, setDataLoading] = useState(true)
  const navigate = useNavigate()

  Auth.currentAuthenticatedUser()
      .then(userData => setUser(userData.username))
      .catch(() => console.log('Not signed in'));

  useEffect(() => {
    // get user zipcode 
    const successLookup = async (position) => {
      const { latitude, longitude } = position.coords;
      let response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=` + API_KEY);
      response = await response.json();
      let zipcode;
      for (let o of response['results']) {
        o = o['address_components']
        for (let e of o) {
            if (e['types'][0] === 'postal_code') {
               zipcode = e['long_name'];
            }
        }
      }
      appStore.setZipcode(zipcode);
      appStore.setSearchOption("zipcode");
      appStore.setSearchQuery(zipcode);
      // zipcode = 98108
      const shelterDataResponse = await apiStore.loadOverview(zipcode, zipcode)
      console.log("Shelter data: ", shelterDataResponse)
        //get distance between user and shetler for each shelter in shelterDataResponse
      for (const shelterPostData of shelterDataResponse) {
          const streetAddress = shelterPostData ? shelterPostData.street.toUpperCase() : ""
          const cityAddress = shelterPostData ? `${shelterPostData.city}, ${shelterPostData.state}, ${shelterPostData.zipcode}`.toUpperCase() : ""
          const fullAddress = `${streetAddress} ${cityAddress}`
          let distance = await apiStore.getDistanceBetweenZipcodes(zipcode, fullAddress)
          //console.log("distance: " + distance)
          shelterPostData['distanceToUserLocation'] = distance
        }
        setShelterData(shelterDataResponse)
        appStore.setShelterDataList(shelterDataResponse)
        setDataLoading(false)
    }
    const errorLookup = () => {
      appStore.setShowNoLocationError(true);
    }
    const getShelterData = async () => {
      try {
        //TODO: Amanda check
        window.navigator.geolocation.getCurrentPosition(successLookup, errorLookup)
        } catch (err) {
          console.log(err.message)
        }
    }
    const getUserStatus = async () => {
      try {
          const userData = await Auth.currentAuthenticatedUser();
          const userStatusResponse = await apiStore.getUserStatus(userData.username);
          setUserStatus(userStatusResponse.UserStatus)
          console.log("current status: " + userStatus)
      } catch (err) {
          console.log(err);
          console.log("Error in fetching user status: Not authenticated");
      }
    }
    getShelterData();
    getUserStatus();
  }, [user, userStatus, apiStore, appStore])


  return (
    <AppContext.Provider value={{
        user: user,
        setUser: setUser,
        userStatus: userStatus,
        setUserStatus: setUserStatus
    }}>
      <ThemeProvider theme={appThemeMui}>

        <AppMenu user={user} setUser={setUser}/> 
        
        <Routes>
          <Route index path="/app/dashboard" element={
            <Dashboard 
              user={user} 
              setUser={setUser} 
              shelterData={shelterData} 
              setShelterData={setShelterData} 
              dataLoading={dataLoading}/>
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

          <Route path="app/shelter-detail/:id" element={
            <ShelterDetail shelterData={shelterData}/>
          } />

          <Route path="app/regular-user-profile/:id" element={
            <RegularUserProfile user={user} setUser={setUser} />
          } >
          </Route>

          <Route path="app/org-user-profile/:id" element={
            <OrgUserProfile />
          } >
          </Route>

          <Route path="app/about-us" element={
            <AboutUs />
          }/>

          <Route path="*" element={
            <Navigate to="/app/dashboard"/>
          } />
        </Routes>
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export default App;