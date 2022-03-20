import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Navigate } from "react-router-dom";

const SignIn = () => {
  return <Navigate to='/'/>
}

export default withAuthenticator(SignIn, {
  signUpConfig: {
    hiddenDefaults: ['phone_number']
  },
  signUpAttributes: ['email']
});