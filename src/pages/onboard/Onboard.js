import {React, useState, useContext} from 'react';
import { Grid, Box } from '@mui/material';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import OnBoardContext from './OnBoardContext';
import { useNavigate, Outlet,  } from 'react-router-dom';
import { useStore } from '../Hook';
import AppContext from '../../AppContext';

const steps = ['Welcome', 'Select account type', 'Detail', "Complete"];

const Onboard = props => {
    const { apiStore } = useStore();

    const [activeStep, setActiveStep] = useState(0);
    const [accountType, setAccountType] = useState(null);
    const [regularUserButtonSelected, setRegularUserButtonSelected] = useState(false);
    const [orgUserButtonSelected, setOrgUserButtonSelected] = useState(false);
    const [gender, setGender] = useState("")
    const [city, setCity] = useState(undefined)
    const [state, setState] = useState("")
    const [email, setEmail] = useState(undefined)
    const appCtx = useContext(AppContext);
    
    console.log("current user name: " + appCtx.user)
    
    const handleOnboardAPICall =  async () => {
        console.log("account type: ", accountType)
        const createAccountResult = await apiStore.createUser({
            username: "wd1204",
            profile_pic_path: "PATH_RETURNED FROM S3",
            user_role: accountType,
            gender: gender,
            city: city,
            state: state,
            country: "USA"
        })
    }

    const handleGenderChange = (event) => {
        setGender(event.target.value)
    };

    const handleStateChange = (event) => {
        setState(event.target.value)
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value)
    };

    const handleCityChange = (event) => {
        setCity(event.target.value.replace(/[^a-zA-Z]/g, ""))
    };
  
    return(
        <OnBoardContext.Provider value={{
            activeStep: activeStep,
            setActiveStep: setActiveStep,
            accountType: accountType, 
            setAccountType: setAccountType,
            regularUserButtonSelected: regularUserButtonSelected,
            setRegularUserButtonSelected: setRegularUserButtonSelected,
            orgUserButtonSelected: orgUserButtonSelected, 
            setOrgUserButtonSelected: setOrgUserButtonSelected,
            gender: gender,
            city: city,
            state: state,
            email: email,
            handleGenderChange: handleGenderChange,
            handleCityChange: handleCityChange,
            handleStateChange: handleStateChange,
            handleEmailChange: handleEmailChange,
            handleOnboardAPICall: handleOnboardAPICall
        }}>
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                wrap='nowrap'
                style={{height: "100vh", padding: "2em"}}
            >
                <Outlet/>
                <Box style={{marginTop: "3em"}}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    return (
                        <Step key={label} {...stepProps}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                    })}
                    </Stepper>
                </Box>
            </Grid>
        </OnBoardContext.Provider>
    )
};

Onboard.propTypes = {};

export default Onboard;
