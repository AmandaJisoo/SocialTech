import React from 'react';
import PropTypes from 'prop-types';
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import Paper from "@mui/material/Paper";
import { Button, Checkbox, Typography } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Grid } from '@mui/material';
import text from "../../text/text.json"
import { TextField } from '@mui/material';
import Divider from '@mui/material/Divider';
import { Link, useNavigate } from 'react-router-dom';
import appTheme from '../../theme/appTheme.json'

const SignIn = () => {
    
    const navigate = useNavigate();

    const handleSignIn = () => {
        //TODO: handle sign In
        navigate("/app/dashboard")
    }

    return (
      <Grid 
          container 
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          style={{width: "100%", maxWidth: "50em", padding: "0px"}}>
  
          <Grid 
            item
            container direction="column"
            justifyContent="center"
            spacing={2}
            alignItems="center">
            <Typography 
              variant="h3"
              style={{marginBottom: "1em"}}>
                {text.signIn.header}
            </Typography>
  
            <Typography
              style={{marginBottom: "3em"}}>
                {text.signIn.intro}<span style={{color: appTheme.palette.primary.main}}>shelters!</span>
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
            spacing={2}
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
              <FormControlLabel control={<Checkbox defaultChecked />} label="Remember me" />
  
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
