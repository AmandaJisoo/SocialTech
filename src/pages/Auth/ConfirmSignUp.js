import {React, useState} from 'react';
import { Button, Checkbox, Typography, Alert } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Grid } from '@mui/material';
import text from "../../text/text.json"
import { TextField } from '@mui/material';
import Divider from '@mui/material/Divider';
import { Link, useNavigate } from 'react-router-dom';
import appTheme from '../../theme/appTheme.json'
import mockUser from '../../mockData/mockUser.json';
import { Auth } from 'aws-amplify';
import { AUTH_TOKEN_KEYNAME, LENGTH_OF_AUTO_SIGN_IN, setWithExpiry } from '../../utils/utilityFunctions';

const ConfirmSignUp = ({username, setSignUpPage}) => {
  const [verificationCode, setVerificationCode] = useState(undefined)
  const [errorMsg, setErrorMsg] = useState(undefined)

  const navigate = useNavigate()

   const handleConfirmSignUp = async () => {
    setErrorMsg(undefined)

    try {
      await Auth.confirmSignUp(username, verificationCode) 
      navigate("/app/onboard/intro")
    } catch (error) {
      setErrorMsg(error.message)
    }
  }

  const handleResendCode = async () => {
    setErrorMsg(undefined)

    try {
      await Auth.resendSignUp(username, verificationCode) 
      console.log('code resent successfully')
      // using a tost message? 
    } catch (error) {
      setErrorMsg(error.message)
    }
  }
  
  const handleVerificationCodeChange = (event) => {
    setVerificationCode(event.target.value)
  };

  const errorEle = errorMsg ?
      <Alert severity="error">{errorMsg}</Alert> :
      null 

  return (
      <Grid 
          container 
          direction="column"
          justifyContent="center"
          alignItems="center"
          rowSpacing={2}
          style={{width: "100%", maxWidth: "50em", padding: "10px"}}>
          <Typography>Enter Verification Code</Typography>

          <Grid
              item
              container
              spacing={2}
              wrap="nowrap"
              justifyContent="space-between"
              alignItems="center">
      
              <Grid item>
                <TextField
                    margin="normal"
                    required
                    name="verification code"
                    label="verification code"
                    type="verification code"
                    id="verification code"
                    onChange={handleVerificationCodeChange}
                />
              </Grid >


        
          </Grid>
          <Grid
                container
                justifyContent="center"
                alignItems="center"
                style={{margin: "20px 0 40px 0"}}>

                <Button variant='contained' onClick={() => {
                    handleConfirmSignUp()
                }}>
                    Submit
                </Button>
                <Button variant='contained' onClick={() => {

                }}>
                    Resend code
                </Button>
            </Grid>
      
         {errorEle}

      </Grid>
  )
}

export default ConfirmSignUp;
