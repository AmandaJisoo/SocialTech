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
import ConfirmSignUp from './ConfirmSignUp';

const SignUp = ({setUser}) => {
  const [signUpPage, setSignUpPage] = useState(0);
  const [isRememberMeChecked, setIsRememberMeChecked] = useState(false)
  const [username, setUsername] = useState(undefined)
  const [password, setPassword] = useState(undefined)
  const [email, setEmail] = useState(undefined)
  const [errorMsg, setErrorMsg] = useState(undefined)

  const navigate = useNavigate()

   const handleSignUp = async () => {
    setErrorMsg(undefined)

    try {
      const { user } = await Auth.signUp({
        username, password,
        attributes: {
          email
        }
      }) 
      
      setUser(user.getUsername());

      setSignUpPage(prev => prev + 1)

    } catch (error) {
      setErrorMsg(error.message)
    }
  }
  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  };
  
  const handleCheckBoxChange = (event) => {
    setIsRememberMeChecked(event.target.value)
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

          {signUpPage === 0 ?  
          <>
            <Grid 
              item
              container direction="column"
              justifyContent="center"
              rowSpacing={2}
              alignItems="center">
              <Typography 
                variant="h3"
                style={{marginBottom: "1em"}}>
                  {text.signUp.welocmeHeader}
              </Typography>

              <Typography
                style={{marginBottom: "3em"}}>
                  {text.signUp.welcomeIntro}<span style={{color: appTheme.palette.primary.main}}>shelters!</span>
              </Typography>
              <Button 
                fullWidth
                variant="contained" 
                color="google_white"
                style={{marginBottom: "8px"}}>Continue with Google</Button>
              <Button
                fullWidth
                variant="contained" 
                color="fb_blue"
                style={{marginBottom: "8px"}}>Continue with Facebook</Button>
              <Button 
                fullWidth 
                variant="contained" 
                color="twitter_blue"
                style={{marginBottom: "8px"}}>Continue with Twitter</Button>
            </Grid>

            <Grid container item>
              <Divider style={{width: "100%"}}>OR</Divider>
            </Grid>

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
                      name="username"
                      label="username"
                      type="username"
                      id="username"
                      onChange={handleUsernameChange}
                  />
                </Grid >
            </Grid>
        
            <Grid
              item
              container 
              direction="column"
              justifyContent="center"
              rowSpacing={2}
              alignItems="center">
              <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="email"
                  label="email"
                  type="email"
                  id="email"
                  autoComplete="current-email"
                  onChange={handleEmailChange}
                />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handlePasswordChange}
              />

              <Grid
                items
                container 
                direction="row"
                justifyContent="flex-end"
                alignItems="center">
                <FormControlLabel control={
                  <Checkbox  
                    checked={isRememberMeChecked}
                    onChange={handleCheckBoxChange}/>} 
                  label="Remember me" />
              </Grid>

              {errorEle}

              <Button 
                fullWidth 
                variant="contained"
                onClick={() => {
                  handleSignUp()
                }}>
                Sign Up
              </Button>

              <Grid 
                items
                container 
                direction="row"
                justifyContent="center"
                alignItems="center"
                style={{marginTop: "2em"}}>

                <Typography>{text.signUp.registeredUserPrompt}</Typography>

                <Link to="/app/auth/sign-in" 
                  style={{marginLeft: "5px", textDecoration: "none", color: "black"}}>
                    <Typography style={{fontWeight: "bold"}}>Log in here</Typography>
                </Link>
              </Grid>
            </Grid>
          </> : 
          <ConfirmSignUp username={username} password={password} setSignUpPage={setSignUpPage} />}
      </Grid>
  )
}

export default SignUp;
