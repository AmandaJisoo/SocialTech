import { React, useContext, useEffect, useState } from 'react';
import { Button, Typography } from '@mui/material';
import { Grid } from '@mui/material';

import text from "../../text/text.json"
import { useNavigate } from 'react-router-dom';
import OnBoardContext from './OnBoardContext';
import { useStore } from '../Hook';
import { Auth } from 'aws-amplify';

const CompletedPage = () => {
    const navigate = useNavigate();
    const public_url = process.env.PUBLIC_URL;
    const ctx = useContext(OnBoardContext);
    const { apiStore, appStore } = useStore(); 
    useEffect(() => {
        ctx.setActiveStep(3)
    }, [ctx, ctx.activeStep])

    useEffect(() => {
        (async () => {
            try {
                const userData = await Auth.currentAuthenticatedUser();
                const userProfile = await apiStore.getUserProfile(userData.username);
                console.log('userProfile', userProfile)
                appStore.setUserProfilePic(userData.username, userProfile.profile_pic_path)
    
            } catch (err) {
                console.error(err)
            }
        })()
    }, [])

    return(
        <>
            <Grid item>
                <Typography variant="h3">{text.onboard.completion.message1}</Typography>
            </Grid> 


            <Grid item>
                <Typography>{text.onboard.completion.message2}</Typography>
            </Grid>
            
            <img
                src={public_url + text.onboard.completion.regularUserCompletionImgAddr}
                alt="onboard complete img"
                style={{width: "200px", height: "200px", margin: "30px"}}
            />

            <Grid item>
                <Button variant='contained' onClick={() => {
                    navigate("/app/dashboard")
                }}>
                    Get Started
                </Button>
            </Grid>

        </>
    )
}

export default CompletedPage;
