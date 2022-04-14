import { React, useContext } from 'react';
import { Button, Typography } from '@mui/material';
import text from "../../text/text.json"
import { useNavigate } from 'react-router-dom';
import OnBoardContext from './OnBoardContext';

const IntroPage = () => {
    const navigate = useNavigate();

    const ctx= useContext(OnBoardContext);

    const firstName = "temp, need to passed from prop" 
    console.log(ctx.activeStep)

    return(
        <>
            <Typography variant="h3">{"Hi, " + firstName}</Typography>
            <Typography variant="h4">{text.onboard.Intro}</Typography>
            <Typography
                style={{marginBottom: "5em", width: "300px"}}>
                {text.onboard.subIntro}
            </Typography>
            <Button variant='contained' onClick={() => {
                ctx.handleNext()
                navigate("/app/onboard/select-account-type")
                
            }}>Continue</Button>

        </>
    )
}

export default IntroPage
