import {React, useContext, useState} from 'react';
import { Button, Typography, Alert } from '@mui/material';
import { Grid } from '@mui/material';
import { TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
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
      await Auth.resendSignUp(username);
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
          style={{width: "100%", maxWidth: "50em", fontSize:"3rem" }}>
            <Grid
              item
              container
              wrap="nowrap"
              justifyContent="center"
              alignItems="center"
              style={{}}>
              <Typography>Enter Verification Code</Typography>
            </Grid>
          <Grid
              item
              container
              spacing={12}
              wrap="nowrap"
              justifyContent="center"
              alignItems="center">
      
              <Grid item >
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

                <Button variant='contained' style={{margin:"15px"}} onClick={() => {
                    setSignUpPage(prev => prev - 1)
                }}>
                    Back
                </Button>

                <Button variant='contained'  style={{margin:"15px"}} onClick={() => {
                    handleConfirmSignUp()
                }}>
                    Submit
                </Button>
                <Button variant='contained'  style={{margin:"15px"}} onClick={() => {
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
