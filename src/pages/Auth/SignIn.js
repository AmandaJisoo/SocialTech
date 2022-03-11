import {React, useState} from 'react';
import { Button, Checkbox, Typography } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Grid } from '@mui/material';
import text from "../../text/text.json"
import { TextField } from '@mui/material';
import Divider from '@mui/material/Divider';
import { Link, useNavigate } from 'react-router-dom';
import appTheme from '../../theme/appTheme.json'
import mockUser from '../../mockData/mockUser.json';
import {LENGTH_OF_AUTO_SIGN_IN, setWithExpiry, AUTH_TOKEN_KEYNAME} from '../../utils/utilityFunctions';

const SignIn = ({setUser}) => {
    const [isRememberMeChecked, setIsRememberMeChecked] = useState(false)
    
    const navigate = useNavigate();

    const handleCheckBoxChange = (event) => {
      setIsRememberMeChecked(event.target.checked)
    };

    const handleSignIn = () => {
        //TODO: handle sign In
        setUser(mockUser.userData)
        if (isRememberMeChecked) {
          setWithExpiry(AUTH_TOKEN_KEYNAME, mockUser.userData.authToken, LENGTH_OF_AUTO_SIGN_IN);
        }
        sessionStorage.setItem(AUTH_TOKEN_KEYNAME, mockUser.authToken)
        navigate("/app/dashboard")
    }

    return (
      <Grid 
          container 
          direction="column"
          justifyContent="center"
          alignItems="center"
          rowSpacing={2}
          style={{width: "100%", maxWidth: "50em", padding: "10px"}}>
  
          <Grid 
            item
            container direction="column"
            justifyContent="center"
            rowSpacing={2}
            alignItems="center">
            <Typography 
              variant="h3"
              style={{marginBottom: "1em"}}>
                {text.signIn.header}
            </Typography>
  
            <Typography
              style={{marginBottom: "3em"}}>
                {text.signIn.intro}
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
                autoComplete="current-password"
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
            />
  
            <Grid
              items
              container 
              direction="row"
              justifyContent="space-between"
              alignItems="center">
              <FormControlLabel control={
                <Checkbox 
                  checked={isRememberMeChecked}
                  onChange={handleCheckBoxChange} />
                } label="Remember me" />
  
              <Link to="">
                <Typography
                  style={{
                    fontWeight: "bold",
                    color: appTheme.palette.dark.main,
                    textDecorationLine: "underline"}}>
                  {text.signIn.forgotPassword}
                </Typography>
              </Link>
            </Grid>
  
            <Button 
                fullWidth 
                variant="contained"
                onClick={handleSignIn}>
                {text.signIn.signInBtnTxt}
            </Button>
  
            <Grid 
              items
              container 
              direction="row"
              justifyContent="center"
              alignItems="center"
              style={{marginTop: "2em"}}>
              <Typography>{text.signIn.unregisterUserPrompt}</Typography>
              <Link to="/app/auth/sign-up" 
                style={{marginLeft: "5px", textDecoration: "none", color: "black"}}>
                  <Typography style={{fontWeight: "bold", color: appTheme.palette.accent1.main}}>
                    {text.signIn.unregisterUserPromptTwo}
                  </Typography>
                </Link>
            </Grid>
          </Grid>
      </Grid>
    )
  }

export default SignIn;
