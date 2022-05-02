import { React, useContext, useEffect } from 'react';
import { Button, Typography } from '@mui/material';
import text from "../../text/text.json"
import { useNavigate } from 'react-router-dom';
import OnBoardContext from './OnBoardContext';
import AppContext from '../../AppContext';

const IntroPage = () => {
    const navigate = useNavigate();

    const ctx = useContext(OnBoardContext);
    const appCtx= useContext(AppContext);

    const username = appCtx.user;

    useEffect(() => {
        ctx.setActiveStep(0)
    }, [ctx, ctx.activeStep])

    return(
        <>
            <Typography variant="h3">{"Hi, " + username}</Typography>
            <Typography variant="h3">{text.onboard.Intro}</Typography>
            <Typography
                style={{marginBottom: "5em", width: "300px"}}>
                {text.onboard.subIntro}
            </Typography>
            <Button variant='contained' onClick={() => {
                navigate("/app/onboard/select-account-type")
                
            }}>Continue</Button>

        </>
    )
}

export default IntroPage
