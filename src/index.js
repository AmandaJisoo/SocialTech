import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { Amplify } from 'aws-amplify';


ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter> 
      <App />
    </BrowserRouter> 
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

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
