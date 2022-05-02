import { React, useContext, useEffect, useState } from 'react';
import { Button, Typography } from '@mui/material';
import { Grid } from '@mui/material';

import text from "../../text/text.json"
import { TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import OnBoardContext from './OnBoardContext';
import Alert from '@mui/material/Alert';
import { useStore } from '../Hook.js';
import { DEFAULT_COUNTRY } from '../../utils/utilityFunctions';
import AppContext from '../../AppContext';
import { Auth } from 'aws-amplify';

const RegularUserPage = () => {
    const navigate = useNavigate();

    const onboardCtx = useContext(OnBoardContext);
    const appCtx = useContext(AppContext);
    const [errorMsg, setErrorMsg] = useState(null);
    const apiStore = useStore().apiStore;

    useEffect(() => {
        onboardCtx.setActiveStep(2)
    }, [onboardCtx, onboardCtx.activeStep])

    const handleNext = async () => {
       
        setErrorMsg(null)
        try {
            const createAccountResult = await apiStore.createUser({
                username: appCtx.user,
                profile_pic_path: "",
                user_role: onboardCtx.accountType,
                gender: onboardCtx.gender,
                city: onboardCtx.city,
                state: onboardCtx.state,
                country: DEFAULT_COUNTRY
            })       
            navigate("/app/onboard/completed")
        } catch(err) {
            setErrorMsg(err.message)
        }
    }

    const genderMenuItems = text.onboard.regular.genderOptions.map(val => {
        return <MenuItem key={val} value={val}>{val}</MenuItem>
    })
    
    const stateMenuItems = text.usStates.map(val => {
        return <MenuItem key={val} value={val}>{val}</MenuItem>
    })

    const errorMsgEle = errorMsg ? <Alert severity="error">{errorMsg}</Alert> : null;

    return ( 
        <>
            <Grid style={{maxWidth: "50em"}}>
                <Typography variant="h3">{text.onboard.regular.prompt}</Typography>
                
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} fullWidth>
                      <InputLabel id="demo-simple-select-standard-label">Gender</InputLabel>
                      <Select 
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={onboardCtx.gender}
                        label="Gender"
                        onChange={onboardCtx.handleGenderChange}
                      >
                          {genderMenuItems}
                      </Select>
                </FormControl>
                <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center">
                
                    <TextField
                        margin="normal"
                        required
                        name="City"
                        label="City"
                        type="City"
                        id="City"
                        onChange={onboardCtx.handleCityChange}
                    />
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel id="demo-simple-select-standard-label">State</InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        label="State"
                        value={onboardCtx.state}
                        onChange={onboardCtx.handleStateChange}
                      >
                          {stateMenuItems}
                      </Select>
                    </FormControl>
                </Grid>
                
                <Grid
                    container
                    justifyContent="center"
                    alignItems="center"
                    style={{margin: "20px 0 40px 0"}}>
                    {/* <TagContainer tagData={["place-holder"]} isSelectable={true}/> */}
                </Grid>
                <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center">
                    <Button variant='contained' style={{marginRight: "10px"}}onClick={() => {
                        navigate("/app/onboard/select-account-type")
                    }}>
                        Back
                    </Button>
                    <Button variant='contained' style={{marginRight: "10px"}} onClick={() => {
                        handleNext()
                    }}>
                        Continue
                    </Button>
                </Grid>

                {errorMsgEle}
            </Grid>
        </>
    )
}

export default RegularUserPage;
