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
    const [loaderActive, setLoaderActive] = useState(false);
    const [shelterBookmarkData, setShelterBookmarkData] = useState([])
    const [shelterData, setShelterData] = useState([])
    const [commentData, setCommentData] = useState(null)
    const [userProfileData, setUserProfileData] = useState(null)
    const [errorMsg, setErrorMsg] = useState([])
    const appCtx = useContext(AppContext)
    const navigate = useNavigate()

    const loadBookmarks = async () => {
        try {
            let authRes = await Auth.currentAuthenticatedUser();
            let username = authRes.username;
            console.log("username for bookmarks", username);
            let bookmarksResponse = await apiStore.getSavedBookmarks(username);
            setShelterBookmarkData(bookmarksResponse)
            let shelterDataResponse = await Promise.all(bookmarksResponse.map(async (post_id) => apiStore.loadSummary(post_id)));
            //we can keep this code in case we want to load one by one async
            // bookmarksResponse.forEach(async (post_id) => {
            //     const shelterDataResponse = await apiStore.loadSummary(post_id);
            //     shelterData.push(shelterDataResponse)
            //     setShelterData(shelterData)
            //     setLoaderActive(false)
            // })
            setShelterData(shelterDataResponse)
          } catch(err) {
            console.log("load bookmarks error: " + err.message)
            setErrorMsg(err.message)
        }
    }

    const loadUserProfile = async () => {
        try {
            let userProfileResponse = await apiStore.getUserProfile(appCtx.user);
            setUserProfileData(userProfileResponse)
          } catch(error) {
            console.log("load user profile err " + error.message)
            setErrorMsg(error.message)
        }
    }

    const loadAllComments = async () => {
        try {
            let commentDataResponse = await apiStore.loadAllComments(appCtx.user);
            setCommentData(commentDataResponse)
          } catch(error) {
            console.log("load all comment err" + error.message)
            setErrorMsg(error.message)
        }
    }

    useEffect(() => {
        setLoaderActive(true)
        loadBookmarks();
        loadAllComments()
        loadUserProfile()
        setLoaderActive(false)
    }, [])

    const comments = () => {
        if (commentData !== null) {
            return commentData.length === 0 ? <Typography>You haven't post any comments</Typography> :
                commentData.map(data => {
                return <UserReview key={data.comment_id} reviewData={data} isHighLighted={false} />
            })
        }
    }

    console.log(`comments by user ${appCtx.user}: ` + commentData)
    console.log(`${appCtx.user}'s profile: ` + userProfileData)

    return (
        <>
            <Grid 
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                wrap="nowrap"
                style={{height: "100vh", width: "100vw"}}>
                <Grid
                    container
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="center"
                    wrap="nowrap"
                    rowSpacing={2}
                    style={{height: "100vh", width: "100vw", maxWidth: "50em", padding: "20px"}}>
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
                                item
                                container
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                style={{}}>
                                <Button
                                    onClick={() => {
                                        navigate("/app/dashboard")
                                    }}>
                                    Back
                                </Button>
                                    <Typography>{"Hi, " + appCtx.user}</Typography>
                                <Button
                                    onClick={() => {
                
                                    }}>
                                    Edit Profile
                                </Button>
                            </Grid>
                            <Divider style={{width: "100%", marginTop: "20px", marginBottom: "20px"}}/>
                            {/* bookmarks */}
                            <Grid
                                container
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="center"
                                style={{}}>
                                    <Typography variant='h5'>Bookmarked Shelters</Typography>
                            </Grid>
                            
                            <ShelterList
                                loaderActive={loaderActive}
                                user={props.user}
                                setUser={props.setUser}
                                shelterData={shelterData}
                                setShelterData={setShelterData}
                                bookmarks={shelterBookmarkData}/>

                            <Divider style={{width: "100%", marginTop: "20px", marginBottom: "20px"}}/>

                            <Grid
                                item
                                container
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="center"
                                style={{}}>
                                    <Typography variant='h5'>Posted Reviews</Typography>
                            </Grid>

                            <Grid style={{width: "100%", margin: "20px", padding: "20px"}}>
                                {comments()}
                            </Grid>
                            {/* <UpdateProfileForm profileData={userProfileData}/> */}
                        </>
                    }
                </Grid>
            </Grid>
        </>
    );
};

export default RegularUserProfile;


const UpdateProfileForm = ({profileData}) => {
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
                style={{}}>
                <Grid
                    container
                    direction="column" 
                    justifyContent="flex-start" 
                    alignItems="center"
                    wrap="nowrap"
                    rowSpacing={3}
                    style={{ width: "100vw", maxWidth: "50em"}}>
                    
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
                            value={city}
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
