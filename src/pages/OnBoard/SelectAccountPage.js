import { React, useContext } from 'react';
import { Button, Typography } from '@mui/material';
import { Grid } from '@mui/material';

import text from "../../text/text.json"
import { useNavigate, useOutletContext } from 'react-router-dom';
import ToggleButton from '@mui/material/ToggleButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HouseIcon from '@mui/icons-material/House';
import OnBoardContext from './OnBoardContext';

const SelectAccountPage = () => {
    const navigate = useNavigate();
    
    const ctx = useContext(OnBoardContext);
    
    
    return( 
        <>
            <Grid
                item
                container 
                direction="column" 
                justifyContent="center" 
                alignItems="center">
                <Typography variant="h4" style={{marginBottom: "20px"}}>{text.onboard.mainPrompt}</Typography>
                <Typography>
                    Select a <span className="primary-color" style={{color: "#F34343"}}>option</span> below. This will tell us how we can help you reach your goals!
                </Typography>
            </Grid>
            <Grid
                item
                container 
                justifyContent="space-between" 
                alignItems="center"
                style={{maxWidth: "30em"}}>
                <ToggleButton
                    value="regular"
                    selected={ctx.regularUserButtonSelected}
                    onChange={() => {
                        ctx.setAccountType("regular")
                        ctx.setRegularUserButtonSelected(!ctx.regularUserButtonSelected)
                        ctx.setOrgUserButtonSelected(false)
                    }}>

                        <Grid
                            container 
                            direction="column"
                            justifyContent="center" 
                            alignItems="center"
                            style={{height: "110px"}}>
                            <AccountCircleIcon/>
                            Regular User
                        </Grid>
                </ToggleButton>

                <ToggleButton
                    value="shelter Staff"
                    selected={ctx.orgUserButtonSelected}
                    onChange={() => {
                        ctx.setAccountType("shelter Staff" )
                        ctx.setOrgUserButtonSelected(!ctx.orgUserButtonSelected)
                        ctx.setRegularUserButtonSelected(false)
                        
                    }}>
                        
                        <Grid
                            container 
                            direction="column"
                            justifyContent="center" 
                            alignItems="center"
                            style={{height: "110px"}}>
                            <HouseIcon/>
                            Shelter Staff
                        </Grid>
                </ToggleButton>
            </Grid>
        

            <Grid
                item
                container 
                justifyContent="space-around" 
                alignItems="center"
                style={{maxWidth: "50em"}}>

                <Button variant='contained' onClick={() => {
                    navigate("/app/onboard/intro")
                    ctx.handleBack()
                }}>
                    Back
                </Button>
                <Button 
                    variant='contained' 
                    disabled={
                        ctx.accountType === null || (!ctx.regularUserButtonSelected && !ctx.orgUserButtonSelected
                )}
                    onClick={() => {
                        if (ctx.regularUserButtonSelected) {
                            navigate("/app/onboard/reg-user")
                        } else {
                            navigate("/app/onboard/org-user")
                        }
                        ctx.handleNext()
                    }}>
                    Continue
                </Button>
            </Grid>
        </>
    )
}

export default SelectAccountPage;
