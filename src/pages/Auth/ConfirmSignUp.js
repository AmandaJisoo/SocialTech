import {React, useContext, useState} from 'react';
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
import Snackbar from '@mui/material/Snackbar';
import AppContext from '../../AppContext';

const ConfirmSignUp = ({username, password, setSignUpPage}) => {
  const [verificationCode, setVerificationCode] = useState(undefined)
  const [errorMsg, setErrorMsg] = useState(undefined)
  const [resendCodeStatusMsg, setResendCodeStatusMsg] = useState("")
  const [resendCodeSnackBarOpen, setResendCodeSnackBarOpen] = useState(false);
  const AppCtx = useContext(AppContext);

  const navigate = useNavigate()

   const handleConfirmSignUp = async () => {
    setErrorMsg(undefined)

    try {
      await Auth.confirmSignUp(username, verificationCode)
      await Auth.signIn(username, password);
      navigate("/app/onboard/intro")
    } catch (error) {
      setErrorMsg(error.message)
    }
  }

  const handleResendCode = async () => {
    setErrorMsg(undefined)
    setResendCodeStatusMsg("")

    try {
      await Auth.resendSignUp(username, verificationCode) 
      setResendCodeStatusMsg('code resent successfully')
      setResendCodeSnackBarOpen(true)
    } catch (error) {
      setErrorMsg(error.message)
      setResendCodeStatusMsg("Error in resending code, please try again")
    }
  }

  const handleClose = () => {
    resendCodeSnackBarOpen(false);
  };

  
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
                    setSignUpPage(prev => prev - 1)
                }}>
                    Back
                </Button>

                <Button variant='contained' onClick={() => {
                    handleConfirmSignUp()
                }}>
                    Submit
                </Button>
                <Button variant='contained' onClick={() => {
                    handleResendCode()
                }}>
                    Resend code
                </Button>
            </Grid>
      
         {errorEle}

         <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            //autoHideDuration={3000} 
            open={resendCodeSnackBarOpen}
            onClose={handleClose}
            message={resendCodeStatusMsg}
            key={"resend-code-message"}
          />

      </Grid>
  )
}

export default ConfirmSignUp;
