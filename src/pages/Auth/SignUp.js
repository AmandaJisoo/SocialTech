import React from 'react';
import { Button, Checkbox, Typography } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Grid } from '@mui/material';
import text from "../../text/text.json"
import { TextField } from '@mui/material';
import Divider from '@mui/material/Divider';
import { Link, useNavigate } from 'react-router-dom';
import appTheme from '../../theme/appTheme.json'



const SignUp = () => {

  const navigate = useNavigate()

  const handleSignUp = () => {
    //TODO: handle sign Up
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
                    name="first-name"
                    label="first-name"
                    type="first-name"
                    id="first-name"
                />
              </Grid >
              <Grid item>
                <TextField
                    margin="normal"
                    name="middle-name"
                    label="middle-name"
                    type="middle-name"
                    id="middle-name"
                  />
              </Grid>
              <Grid item>
                <TextField
                    margin="normal"
                    required
                    name="last-name"
                    label="last-name"
                    type="last-name"
                    id="last-name"
                  />
              </Grid>
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
              justifyContent="flex-end"
              alignItems="center">
              <FormControlLabel control={<Checkbox defaultChecked />} label="Remember me" />
            </Grid>

            <Button 
              fullWidth 
              variant="contained"
              onClick={handleSignUp}>
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
      </Grid>
  )
}

export default SignUp;
