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
import OnBoardContext from './OnBoardContext';
import Alert from '@mui/material/Alert';
import { useStore } from '../Hook.js';
import { formatShelterAddress } from '../../utils/utilityFunctions';
import AppContext from '../../AppContext'
import { DEFAULT_COUNTRY, DEFAULT_PROFILE_PATH, LOADING_SPINNER_SIZE } from '../../utils/utilityFunctions';
import AmenityFilterTab from '../../components/AmenityFilterTab';
import { Auth } from 'aws-amplify';
import LoadingSpinner from '../../components/LoadingSpinner';

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
    const { apiStore, appStore } = useStore();
    const [email, setEmail] = useState(null);

    useEffect(() => {
        Auth.currentAuthenticatedUser()
        .then(userData => setEmail(userData.attributes.email))
        .catch(() => console.log('Not signed in'));
        onboardCtx.setActiveStep(2)
    }, [onboardCtx, onboardCtx.activeStep])
    const fetchAvailableShelterData = () => {
        const getShelterDataByCity = async () => {
            try {
              const shelterDataResponse = await apiStore.getShelterByCity(onboardCtx.city);
              shelterDataResponse.sort((a, b) => a.post_id.localeCompare(b.post_id))
              if (shelterDataResponse.length == 0) {
                setErrorMsg(`No shelters found in city: '${onboardCtx.city}'`)
                setSelectedShelter("")
                setAvailableShelterData(undefined)
              } else {
                setSelectedShelter("")
                setAvailableShelterData(shelterDataResponse);
              }
            } catch (err) {
              console.log(err.message)
              setErrorMsg(err.message)
            } finally {
              setLoadingAvailableShleter(false);
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


    const stateCityMap = new Map(Object.entries(text.usStates));
    const stateList = Array.from(stateCityMap.keys());
    stateList.sort();
    const stateMenuItems = stateList.map(val => {
        return <MenuItem value={val}>{val}</MenuItem>
    })

    const cityMenuItems = onboardCtx.state? stateCityMap.get(onboardCtx.state).map(val => {
        return <MenuItem value={val}>{val}</MenuItem>
    }) : [<MenuItem value={""}>{}</MenuItem>];

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
                    let menuItemText = formatShelterAddress(data)
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
                rowSpacing={2}>
                <Grid item>
                    <Typography variant="h3">{text.onboard.org.prompt}</Typography>
                </Grid>

                <Grid
                container 
                direction="row" 
                justifyContent="center"
                alignItems="center" 
                wrap="nowrap"
                style={{marginTop: "10px"}}>
                {/* <TextField
                    margin="normal"
                    required
                    name="email"
                    type="email"
                    disabled
                    id="email"
                    value={email}
                  /> */}
                  </Grid>
                <Grid
                    item
                    container
                    direction="row" 
                    justifyContent="space-between"
                    alignItems="center">
                        
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                      <InputLabel required id="demo-simple-select-standard-label">State</InputLabel>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        label="State"
                        required
                        value={onboardCtx.state}
                        onChange={onboardCtx.handleStateChange}
                      >
                          {stateMenuItems}
                      </Select>
                    </FormControl>
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120, marginTop :"23px" }}>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            margin="normal"
                            required
                            label="City"
                            value={onboardCtx.city}
                            onChange={onboardCtx.handleCityChange}
                            disabled = {!onboardCtx.state}
                        >   
                            {cityMenuItems}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item
                    container
                    justifyContent="center">
                    <Button variant='outlined' 
                    disabled={!onboardCtx.city || !onboardCtx.state}
                    onClick={() => {
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

                {(loadingAvailableShleter) &&
                    <LoadingSpinner text={"Loading available shelters"} size={LOADING_SPINNER_SIZE.small} />
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
                        disabled={!onboardCtx.city || !onboardCtx.state || !selectedShelter || selectedShelter === ""}
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
    const [selectedAmenityTags, setSelectedAmenityTags] = useState([]);
    const [errorMsg, setErrorMsg] = useState(null);
    const { apiStore, appStore } = useStore();
    const [email, setEmail] = useState(null);


    useEffect(() => {
        Auth.currentAuthenticatedUser()
        .then(userData => setEmail(userData.attributes.email))
        .catch(() => console.log('Not signed in'));
    }, [onboardCtx, onboardCtx.activeStep])

    const handleNext = async () => {
        setErrorMsg(null)
        try {
            // create account
            const createAccountResult = await apiStore.createUser({
                username: appCtx.user,
                profile_pic_path: DEFAULT_PROFILE_PATH,
                user_role: "shelter_owner",
                gender: "NOT_APPLIERD",
                city: onboardCtx.city,
                state: onboardCtx.state,
                country: DEFAULT_COUNTRY
            })
            console.log("create account result: ", createAccountResult)

            // file claim
            console.log(appCtx.user, selectedShelter, selectedAmenityTags)
            const createClaimResponse = await apiStore.createClaim(appCtx.user, selectedShelter, "pending", selectedAmenityTags)
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
                    <Typography variant="h3">{text.onboard.org.prompt}</Typography>
                </Grid>
                <Grid
                    item
                    container 
                    direction="column" 
                    justifyContent="center" 
                    alignItems="center"
                    // rowSpacing={5}
                    >    
                    <Grid item >
                        <Typography style={{marginRight: "70px"}}>Select all that</Typography>
                    </Grid>
                    <Grid item >
                        <Typography style={{marginRight: "70px", marginBottom: "10px"}}>your shelter owns/represents</Typography>
                    </Grid>
                    <Grid item >
                        
                        <AmenityFilterTab 
                            selectedAmenityTags={selectedAmenityTags} 
                            setSelectedAmenityTags={setSelectedAmenityTags}
                            displayShowResultButton={false} />
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
