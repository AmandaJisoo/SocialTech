import { React, useContext, useEffect } from 'react';
import { Button, Typography } from '@mui/material';
import { Grid } from '@mui/material';

import text from "../../text/text.json"
import { useNavigate } from 'react-router-dom';
import ToggleButton from '@mui/material/ToggleButton';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HouseIcon from '@mui/icons-material/House';
import OnBoardContext from './OnBoardContext';

const USER_STATUS = {
    regularUser: "user",
    orgUser: "shelter_owner",
    admin: "admin"
}

const SelectAccountPage = () => {
    const navigate = useNavigate();
    
    const ctx = useContext(OnBoardContext);
    
    useEffect(() => {
        ctx.setActiveStep(1)
    }, [ctx, ctx.activeStep])

    return( 
        <>
            <Grid
                item
                container 
                direction="column" 
                justifyContent="center" 
                alignItems="center">
                <Typography variant="h3" style={{marginBottom: "20px"}}>{text.onboard.mainPrompt}</Typography>
                <Typography>
                    Select a <span className="primary-color" style={{color: "#F34343"}}>option</span> below. This will tell us how we can help you reach your goals!
                </Typography>
            </Grid>
            <Grid
                item
                container 
                justifyContent="space-between" 
                alignItems="center"
                style={{maxWidth: "30em", marginTop: "2em"}}>
                <ToggleButton
                    value={USER_STATUS.regularUser}
                    selected={ctx.regularUserButtonSelected}
                    onChange={() => {
                        ctx.setAccountType(USER_STATUS.regularUser)
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
                    value={USER_STATUS.orgUser}
                    selected={ctx.orgUserButtonSelected}
                    onChange={() => {
                        ctx.setAccountType(USER_STATUS.orgUser)
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
                style={{maxWidth: "50em", margin: "2em 0"}}>

                <Button variant='contained' onClick={() => {
                    navigate("/app/onboard/intro")
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
                    }}>
                    Continue
                </Button>
            </Grid>
        </>
    )
}

export default SelectAccountPage;
