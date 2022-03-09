import {React, useState} from 'react';
import PropTypes from 'prop-types';
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import Paper from "@mui/material/Paper";
import { Button, Checkbox, Typography } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Grid } from '@mui/material';
import text from "../text/text.json"
import { TextField } from '@mui/material';
import Divider from '@mui/material/Divider';
import { Link, useNavigate } from 'react-router-dom';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { color } from '@mui/system';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import SelectableTags from '../components/SelectableTags/ReadOnlyTags';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HouseIcon from '@mui/icons-material/House';

const firstName = "yichi"

const genderMenuItems = text.onboard.regular.genderOptions.map(val => {
    return <MenuItem>{val}</MenuItem>
})

const stateMenuItems = text.usStates.map(val => {
    return <MenuItem>{val}</MenuItem>
})

const Onboard = props => {
    const navigate = useNavigate();
    
    const [onboardState, setOnboardState] = useState(1);
    const [accountType, setAccountType] = useState(null);

    const [regularUserButtonSelected, setRegularUserButtonSelected] = useState(false);
    const [orgUserButtonSelected, setOrgUserButtonSelected] = useState(false);

    const handleExclusiveButtonToggle = () => {
        setRegularUserButtonSelected(!regularUserButtonSelected) 
        setOrgUserButtonSelected(!orgUserButtonSelected) 
    }

    const selectAccountTypePage = () => {
        return( 
            <Grid item
                container 
                direction="column" 
                justifyContent="center" 
                alignItems="center"
                spacing={8}
                style={{height: "100vh", padding: "2.5em"}}
            >
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
                        selected={regularUserButtonSelected}
                        onChange={() => {
                            setAccountType("regular")
                            if (accountType === null) {
                            setRegularUserButtonSelected(!regularUserButtonSelected)
                            } else {
                                handleExclusiveButtonToggle()
                            }
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
                        selected={orgUserButtonSelected}
                        onChange={() => {
                            setAccountType("shelter Staff" )
                            if (accountType === null) {
                                setOrgUserButtonSelected(!orgUserButtonSelected)
                            } else {
                                handleExclusiveButtonToggle()
                            }
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
                    justifyContent="flex-end" 
                    alignItems="center"
                    style={{maxWidth: "50em"}}>
                    <Button variant='contained' disabled={accountType === null}
                        onClick={() => {
                            setOnboardState(regularUserButtonSelected ? 3 : 4);
                        }}>
                        Continue
                    </Button>
                </Grid>
            </Grid>
        )
    }

    const onboardPageOne = () => {


        return(
            <Grid 
                container 
                direction="column" 
                justifyContent="center" 
                alignItems="center"
                style={{height: "100vh", padding: "2em"}}
            >
                <Typography variant="h3">{"Hi, " + firstName}</Typography>
                <Typography variant="h4">{text.onboard.Intro}</Typography>
                <Typography
                    style={{marginBottom: "5em", width: "300px"}}>
                    {text.onboard.subIntro}
                </Typography>
                <Button variant='contained' onClick={() => {
                    setOnboardState(2)
                }}>Continue</Button>
    
            </Grid>
        )
    }

        
    const regularUserOnBoard = () => {

        return( 
            <Grid 
                container direction="column" 
                justifyContent="center" 
                alignItems="center"
                style={{height: "100vh", padding: "2em"}}
            >
                <Grid style={{maxWidth: "50em"}}>
                    <Typography variant="h4">{text.onboard.regular.prompt}</Typography>
                    
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} fullWidth>
                          <InputLabel id="demo-simple-select-standard-label">Gender</InputLabel>
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={null}
                            label="Gender"
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
                        />
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                          <InputLabel id="demo-simple-select-standard-label">State</InputLabel>
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            label="State"
                          >
                              {stateMenuItems}
                          </Select>
                        </FormControl>
                    </Grid>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="email"
                        label="email"
                        type="email"
                        id="email"
                      />
                    <Grid
                        container
                        justifyContent="flex-start"
                        alignItems="center">
                        <Typography>{text.onboard.regular.tagPrompt}</Typography>
                    </Grid>
                    
                    {/* place holder tags. Need  */}
                    <Grid
                        container
                        justifyContent="center"
                        alignItems="center"
                        style={{margin: "20px 0 40px 0"}}>
                        <SelectableTags tagData={text.onboard.tags.slice(0, 4)}/>
                        <SelectableTags tagData={text.onboard.tags.slice(4, 8)}/>
                        <SelectableTags tagData={text.onboard.tags.slice(8, 12)}/>
                    </Grid>
                    <Button variant='contained' onClick={() => {
                        setOnboardState(5)
                    }}>
                        Continue
                    </Button>
                </Grid>
            </Grid>
        )
    
    }

    const orgOnBoard = () => {
        return(
            <Grid item
                container 
                direction="column" 
                justifyContent="center" 
                alignItems="center"
                style={{height: "100vh", padding: "2em"}}
            >
                <Grid
                    container 
                    direction="column" 
                    justifyContent="center" 
                    style={{maxWidth: "50em"}}
                    wrap="nowrap"
                    spacing={3}>
                    <Grid item>
                        <Typography variant="h4">{text.onboard.org.prompt}</Typography>
                    </Grid>
                    <Grid item>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="Sheler Name"
                            label="Sheler Name"
                            type="Sheler Name"
                            id="Sheler Name"
                          />
                    </Grid>
                    <Grid item>
                        <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="Your Position"
                        label="Your Position"
                        type="Your Position"
                        id="Your Position"
                        />
                    </Grid>
                    <Grid
                        item
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
                        />
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                          <InputLabel id="demo-simple-select-standard-label">State</InputLabel>
                          <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            label="State"
                          >
                              {stateMenuItems}
                          </Select>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="Shelter Location"
                            label="Shelter Location"
                            type="Shelter Location"
                            id="Shelter Location"
                          />
                    </Grid>
                    <Grid item>
                        <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="email"
                        label="email"
                        type="email"
                        id="email"
                        />
                    </Grid>
                    <Grid
                        item
                        container 
                        justifyContent="flex-end" 
                        alignItems="center"
                        >
                        <Button variant='contained' onClick={() => {
                            setOnboardState(5)
                        }}>
                            Continue
                        </Button>
                    </Grid>
                </Grid>
       
            </Grid>
        )
    }

    const orgOnBoardPageTwo = () => {
        return(
            <Grid item
                container 
                direction="column" 
                justifyContent="center" 
                alignItems="center"
                style={{height: "100vh", padding: "2em"}}
            >
                <Grid
                    container 
                    direction="column" 
                    justifyContent="center" 
                    style={{maxWidth: "50em"}}
                    wrap="nowrap"
                    spacing={3}>
                    <Grid item>
                        <Typography variant="h4">{text.onboard.org.prompt}</Typography>
                    </Grid>
                    <Grid item>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name={text.onboard.org.shelterScopeDropDownLabel}
                            label={text.onboard.org.shelterScopeDropDownLabel}
                            type={text.onboard.org.shelterScopeDropDownLabel}
                            id={text.onboard.org.shelterScopeDropDownLabel}
                          />
                    </Grid>
                    <Grid item>
                        <TextField
                        margin="normal"
                        required
                        fullWidth
                        name={text.onboard.org.FoodProvideDropDownLabel}
                        label={text.onboard.org.FoodProvideDropDownLabel}
                        type={text.onboard.org.FoodProvideDropDownLabel}
                        id={text.onboard.org.FoodProvideDropDownLabel}
                        />
                    </Grid>

                    <Grid
                        item
                        container 
                        direction="column" 
                        justifyContent="center" 
                        alignItems="flex-start">    
                        <Typography>{text.onboard.org.tagSelectionPrompt}</Typography>
                        
                         {/* place holder tags. Need  */}
                        <Grid
                            container
                            justifyContent="center"
                            alignItems="center"
                            style={{margin: "20px 0 40px 0"}}>
                            <SelectableTags tagData={text.onboard.tags.slice(0, 4)}/>
                            <SelectableTags tagData={text.onboard.tags.slice(4, 8)}/>
                            <SelectableTags tagData={text.onboard.tags.slice(8, 12)}/>
                        </Grid>
                    </Grid>

                    <Grid
                        item
                        container 
                        justifyContent="flex-end" 
                        alignItems="center"
                        >
                        <Button variant='contained' onClick={() => {
                            setOnboardState(6)
                        }}>
                            Continue
                        </Button>
                    </Grid>
                </Grid>
    
            </Grid>
        )
    }
    
    const onBoardCompleted = () => {
        return(
            <Grid 
                container 
                direction="column" 
                justifyContent="center" 
                alignItems="center"
                spacing={4}
                style={{height: "100vh"}}
            >
                <Grid item>
                    <Typography variant="h4">{text.onboard.completion.message1}</Typography>
                </Grid>


                <Grid item>
                    <Typography>{text.onboard.completion.message2}</Typography>
                </Grid>
    
                <Grid item>
                    <Button variant='contained' onClick={() => {
                        navigate("/app/shelter-list")
                    }}>
                        Get Start
                    </Button>
                </Grid>
    
            </Grid>
        )
    }

    if (onboardState === 1) return onboardPageOne()
    else if (onboardState === 2) return selectAccountTypePage()
    else if (onboardState === 3) return regularUserOnBoard();
    else if (onboardState === 4) return orgOnBoard();   
    else if (onboardState === 5) return orgOnBoardPageTwo();     
    else if (onboardState === 6) return onBoardCompleted();
    
    
};

export default Onboard;
