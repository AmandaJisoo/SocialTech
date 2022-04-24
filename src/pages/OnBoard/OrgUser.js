import {React, useContext, useState, useEffect} from 'react';
import { Button, Typography } from '@mui/material';
import { Grid } from '@mui/material';
import text from "../../text/text.json"
import { TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TagContainer from '../../components/SelectableTags/TagContainer';
import OnBoardContext from './OnBoardContext';
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert';
import { useStore } from '../Hook.js';
import { processShelterDataForOrgOnboard } from '../../utils/utilityFunctions';
import { Auth } from 'aws-amplify';
import AppContext from '../../AppContext'
import { DEFAULT_COUNTRY, DEFAULT_PROFILE_PATH } from '../../utils/utilityFunctions';

const OrgOnBoardPages = {
    shelterInfoFormPage: "SHELTER_INFO_FORM_PAGE",
    shelterAdminInfoFormPage: "SHELTER_ADMIN_INFO_FORM_PAGE"
}

const OrgPage = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState("SHELTER_INFO_FORM_PAGE")
    const [selectedShelter, setSelectedShelter] = useState("");

    const onboardCtx = useContext(OnBoardContext);

    useEffect(() => {
        onboardCtx.setActiveStep(2)
    }, [onboardCtx, onboardCtx.activeStep])
    
    if (page === OrgOnBoardPages.shelterInfoFormPage) {
        return <ShelterInfoForm setPage={setPage} navigate={navigate} selectedShelter={selectedShelter} setSelectedShelter={setSelectedShelter}/>
    } else {
        return <ShelterAdminInfoForm navigate={navigate} setPage={setPage} selectedShelter={selectedShelter}/>
    }
}

const ShelterInfoForm = ({ setPage, navigate, selectedShelter, setSelectedShelter }) => {

    const [availableShelterData, setAvailableShelterData] = useState(undefined);
    const [loadingAvailableShleter, setLoadingAvailableShleter] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const onboardCtx = useContext(OnBoardContext);
    const apiStore = useStore(); 

    const fetchAvailableShelterData = () => {
        const getShelterDataByCity = async () => {
            try {
              //TODO: Amanda check
              const shelterDataResponse = await apiStore.getShelterByCity(onboardCtx.city)
              setSelectedShelter(processShelterDataForOrgOnboard(shelterDataResponse[0]))
              setAvailableShelterData(shelterDataResponse);
              setLoadingAvailableShleter(false);
            } catch (err) {
              console.log(err.message)
              setErrorMsg(err.message)
            }
        }
        if (onboardCtx.city.length === 0) {
            setErrorMsg("Please input your city")
            return;
        }

        setErrorMsg(null)
        setLoadingAvailableShleter(true);
        getShelterDataByCity();
    }

    const handleSelectedShelterChange = (event) => {
        setSelectedShelter(event.target.value)
    };


    const stateMenuItems = text.usStates.map(val => {
        return <MenuItem value={val}>{val}</MenuItem>
    })

    // I'm using tags temporaily to display shelters that are available for claim
    const availableShelterSelection = (availableShelterData && availableShelterData.length !== 0) ? 
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Select shelter</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedShelter}
                label="selected Shelter"
                onChange={handleSelectedShelterChange}
            >
                {availableShelterData.map((data) => {
                    let menuItemText = processShelterDataForOrgOnboard(data)
                    return <MenuItem value={data.post_id}>{menuItemText}</MenuItem>
                })}
            </Select>
        </FormControl>
        : <Typography>No shelter data found, please try again with different city</Typography>;


    const errorMsgEle = errorMsg ? <Alert severity="error">{errorMsg}</Alert> : null;

    return(
        <>
            <Grid
                container 
                direction="column" 
                justifyContent="center"
                alignItems="center" 
                style={{maxWidth: "50em"}}
                wrap="nowrap"
                rowSpacing={5}>
                <Grid item>
                    <Typography variant="h4">{text.onboard.org.prompt}</Typography>
                </Grid>

                <Grid
                    item
                    container
                    justifyContent="space-between"
                    alignItems="center">
                        
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel id="demo-simple-select-standard-label">State</InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        label="State"
                        value={"WA - Washington"}
                        onChange={onboardCtx.handleStateChange}
                      >
                          {stateMenuItems}
                      </Select>
                    </FormControl>

                    <TextField
                        margin="normal"
                        required
                        name="City"
                        label="City"
                        type="City"
                        id="City"
                        onChange={onboardCtx.handleCityChange}
                    />
                </Grid>

                <Grid item
                    container
                    justifyContent="center">
                    <Button variant='outlined' onClick={() => {
                        fetchAvailableShelterData();
                    }}>
                        Get Available Shelters
                    </Button>
                </Grid>

                <Grid
                    item
                    container
                    justifyContent="center">
                    {errorMsgEle}
                </Grid>

                {(loadingAvailableShleter && availableShelterData === undefined) &&
                    <Grid   
                    container
                    direction="column"
                    justifyContent="center" 
                    alignItems="center"
                    style={{height: "10vh"}}>
                        <CircularProgress/>
                    </Grid>
                }

                {(availableShelterData && !loadingAvailableShleter) && 
                    <Grid 
                        item
                        container
                        justifyContent="center">
                        {availableShelterSelection}
                    </Grid>
                }

                <Grid
                    item
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    style={{width: "70%"}}
                    >

                    <Button variant='contained' onClick={() => {
                        navigate("/app/onboard/select-account-type")
                    }}>
                        Back
                    </Button>
                    <Button variant='contained' 
                        onClick={() => {
                        setPage(OrgOnBoardPages.shelterAdminInfoFormPage)
                        }}
                        disabled={selectedShelter === undefined}
                    >
                        Continue
                    </Button>
                </Grid>
            </Grid>
        </>
    )
}

const ShelterAdminInfoForm = ({navigate, setPage, selectedShelter}) => {

    const onboardCtx = useContext(OnBoardContext);
    const appCtx = useContext(AppContext);
    const [selectedTags, setSelectedTags] = useState([]);
    const [errorMsg, setErrorMsg] = useState(null);
    const apiStore = useStore(); 
    
    const handleNext = async () => {
        setErrorMsg(null)
        try {
            // create account
            const createAccountResult = await apiStore.createUser({
                username: appCtx.user,
                profile_pic_path: DEFAULT_PROFILE_PATH,
                user_role: onboardCtx.accountType,
                gender: "NOT_APPLIERD",
                city: onboardCtx.city,
                state: onboardCtx.state,
                country: DEFAULT_COUNTRY
            })
            console.log("create account result: ", createAccountResult)

            // file claim
            console.log(appCtx.user, selectedShelter, selectedTags)
            const createClaimResponse = await apiStore.createClaim(appCtx.user, selectedShelter, "pending", selectedTags)
            console.log("create claim result: ", createClaimResponse)

            navigate("/app/onboard/completed")
        } catch(err) {
            setErrorMsg(err.message)
        }
    }

    const errorMsgEle = errorMsg ? <Alert severity="error">{errorMsg}</Alert> : null;

    return(
        <>
            <Grid
                container 
                direction="column" 
                justifyContent="center"
                alignItems="center" 
                style={{maxWidth: "50em"}}
                wrap="nowrap"
                rowSpacing={2}>
                <Grid item>
                    <Typography variant="h4">{text.onboard.org.prompt}</Typography>
                </Grid>

                <Grid
                    item
                    container 
                    direction="column" 
                    justifyContent="center" 
                    alignItems="flex-start">    
                    <Typography>{text.onboard.org.tagSelectionPrompt}</Typography>
                    <Grid style={{padding: "20px"}}>
                        <TagContainer tagData={text.onboard.claimed_amenities_tags} isSelectable={true} selectedTags={selectedTags} setSelectedTags={setSelectedTags}/>
                    </Grid>
                </Grid>

                <Grid
                    item
                    container 
                    justifyContent="space-between" 
                    alignItems="center"
                    style={{width:  "70%"}}
                    >
                    <Button variant='contained' onClick={() => {
                        setPage(OrgOnBoardPages.shelterInfoFormPage);
                    }}>
                        Back
                    </Button>
                    <Button 
                        variant='contained' 
                        onClick={() => {
                            handleNext()
                        }}
                        >
                        Continue
                    </Button>

                    <Grid
                        item
                        container 
                        justifyContent="center" 
                        alignItems="center">
                        {errorMsgEle}
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default OrgPage; 
