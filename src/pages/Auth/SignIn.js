import { withAuthenticator } from 'aws-amplify-react';
import { Navigate } from "react-router-dom";

const SignIn = () => {
  return <Navigate to='/'/>
}

export default withAuthenticator(SignIn, {
  signUpConfig: {
    hiddenDefaults: ['phone_number']
  }
});