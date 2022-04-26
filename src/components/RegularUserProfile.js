import {React, useState, useEffect, useContext } from 'react';
import { Auth } from 'aws-amplify';
import ShelterList from "../pages/ShelterList";
import { useStore } from '../pages/Hook';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import text from "../text/text.json"
import { Grid, Button } from '@mui/material';
import ShelterCard from './ShelterCard/ShelterCard';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider';
import UserReview from './UserReview';
import AppContext from '../AppContext.js';
import Alert from '@mui/material/Alert';


//TODO: Yichi only show this when user is logged in as a part of menu
const RegularUserProfile = props => {
    const { apiStore } = useStore();
    const [loaderActive, setLoaderActive] = useState(true);
    const [shelterData, setShelterData] = useState([])
    const [commentData, setCommentData] = useState(null)
    const [errorMsg, setErrorMsg] = useState([])
    const appCtx = useContext(AppContext)

    const loadBookmarks = async () => {
        try {
            let authRes = await Auth.currentAuthenticatedUser();
            let username = authRes.username;
            console.log("username for bookmarks", username);
            let bookmarksResponse = await apiStore.getSavedBookmarks(username);
            let shelterDataResponse = await Promise.all(bookmarksResponse.map(async (post_id) => apiStore.loadSummary(post_id)));
            //we can keep this code in case we want to load one by one async
            // bookmarksResponse.forEach(async (post_id) => {
            //     const shelterDataResponse = await apiStore.loadSummary(post_id);
            //     shelterData.push(shelterDataResponse)
            //     setShelterData(shelterData)
            //     setLoaderActive(false)
            // })
            setLoaderActive(false);
            setShelterData(shelterDataResponse)
          } catch(error) {
            console.log(error.message)
            setErrorMsg(error.message)
        }
    }

    const loadCommentsByUser = async () => {
        try {
            let commentDataResponse = await apiStore.loadCommentByUser(appCtx.user);
            setCommentData(commentDataResponse)
          } catch(error) {
            console.log(error.message)
            setErrorMsg(error.message)
        }
    }

    useEffect(() => {
        setLoaderActive(true)
        loadBookmarks();
        loadCommentsByUser()
        setLoaderActive(false)
    }, [])

    const comments = () => {
        if (commentData.length === 0) {
            return <Typography>You haven't post any comments</Typography>
        } else {
            return commentData.map(data => {
                return <UserReview reviewData={data} isHighLighted={false} />
            })
        }
    }

    return (
        <>
            <Grid
                container
                direction="column" 
                justifyContent="center" 
                alignItems="center"
                style={{height: "100vh"}}>
                <Grid
                    container
                    direction="column" 
                    justifyContent="flex-start" 
                    alignItems="center"
                    wrap="nowrap"
                    rowSpacing={3}
                    style={{height: "100vh", width: "100vw", maxWidth: "50em"}}>
    
                    {loaderActive ? 
                        <Grid   
                            container
                            direction="column"
                            justifyContent="center" 
                            alignItems="center"
                            style={{height: "80vh"}}>
                                <Typography>Loading your profile</Typography>
                                <CircularProgress/>
                        </Grid> : 
                        <>
                            <Grid   
                                container
                                direction="row"
                                justifyContent="flex-end" 
                                alignItems="center"
                                style={{height: "80vh"}}>
                                    <Typography>Edit Profile</Typography>
                            </Grid> 

                          
                            <Typography>{appCtx.user}</Typography>
                             

                            <Divider style={{width: "100%", marginTop: "20px", marginBottom: "20px"}}/>

                            {/* bookmarks */}

                            <Grid   
                                container
                                direction="row"
                                justifyContent="flex-start" 
                                alignItems="center"
                                style={{height: "80vh"}}>
                                    <Typography>Bookmarks</Typography>
                            </Grid> 
                            <ShelterList loaderActive={loaderActive} user={props.user} setUser={props.setUser} shelterData={shelterData} setShelterData={setShelterData}/>

                            <Divider style={{width: "100%", marginTop: "20px", marginBottom: "20px"}}/>

                            <Grid   
                                container
                                direction="row"
                                justifyContent="flex-start" 
                                alignItems="center"
                                style={{height: "80vh"}}>
                                    <Typography>Posted Reviews</Typography>
                            </Grid> 

                            {comments()}

                        </>
                    }
                </Grid>
            </Grid>
        </>
    );
};

export default RegularUserProfile;


const UpdateProfileForm = ({profileData}) => {
    const [username, setUsername] = useState(profileData.username)
    const [gender, setGender] = useState(profileData.gender)
    const [city, setCity] = useState(profileData.city)
    const [state, setState] = useState(profileData.state)
    const [email, setEmail] = useState(profileData.email)
    const [errorMsg, setErrorMsg] = useState(profileData.email)
    const navigate = useNavigate()

    const genderMenuItems = text.onboard.regular.genderOptions.map(val => {
        return <MenuItem value={val}>{val}</MenuItem>
    })
    
    const stateMenuItems = text.usStates.map(val => {
        return <MenuItem value={val}>{val}</MenuItem>
    })

    const errorMsgEle = errorMsg ? <Alert severity="error">{errorMsg}</Alert> : null;

    const handleUpdateUserProfile = async () => {
        try {
            // update profile api call
        } catch (err) {
            setErrorMsg(err.message)
        }
    }

    const handleUsernameChange = (event) => {
        setUsername(event.target.value)
    };

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
        setCity(event.target.value)
    };

    return (
        <>
            <Grid
                container
                direction="column" 
                justifyContent="center" 
                alignItems="center"
                style={{height: "100vh"}}>
                <Grid
                    container
                    direction="column" 
                    justifyContent="flex-start" 
                    alignItems="center"
                    wrap="nowrap"
                    rowSpacing={3}
                    style={{height: "100vh", width: "100vw", maxWidth: "50em"}}>
                    
                        
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="User name"
                        label="User name"
                        type="User name"
                        id="User name"
                        autoComplete="current-username"
                        onChange={handleUsernameChange}
                    />

                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} fullWidth>
                      <InputLabel id="demo-simple-select-standard-label">Gender</InputLabel>
                      <Select 
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={gender}
                        label="Gender"
                        onChange={handleGenderChange}
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
                            onChange={handleCityChange}
                        />
                        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="demo-simple-select-standard-label">State</InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            label="State"
                            value={state}
                            onChange={handleStateChange}
                        >
                            {stateMenuItems}
                        </Select>
                        </FormControl>
                    </Grid>


                    <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center">
                        <Button variant='contained' onClick={() => {
                            //navigate("/app/onboard/select-account-type")
                        }}>
                            Cancel
                        </Button>
                        <Button variant='contained' onClick={() => {
                            handleUpdateUserProfile()
                        }}>
                            Save
                        </Button>
                    </Grid>

                    
                    {errorMsgEle}

                </Grid>
            </Grid>
        </>
    )
}
