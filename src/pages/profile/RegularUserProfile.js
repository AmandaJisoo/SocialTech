import {React, useState, useEffect, useContext } from 'react';
import ShelterList from "../ShelterList";
import { useStore } from '../Hook';
import { useNavigate } from 'react-router-dom';
import text from "../../text/text.json"
import { Grid, Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { TextField } from '@mui/material';
import Divider from '@mui/material/Divider';
import UserComment from '../../components/UserComment';
import AppContext from '../../AppContext.js';
import Alert from '@mui/material/Alert';
import { observer } from "mobx-react";
import Link from '@mui/material/Link';
import { DEFAULT_COUNTRY, LOADING_SPINNER_SIZE } from '../../utils/utilityFunctions';
import LoadingSpinner from '../../components/LoadingSpinner';

//TODO: Yichi only show this when user is logged in as a part of menu
const RegularUserProfile = observer(props => {
    const { apiStore } = useStore();
    const [page, setPage] = useState(0);
    const [loaderActive, setLoaderActive] = useState(false);
    const [shelterBookmarkData, setShelterBookmarkData] = useState([])
    const [shelterData, setShelterData] = useState([])
    const [commentData, setCommentData] = useState(null)
    const [userProfileData, setUserProfileData] = useState(null)
    const [errorMsg, setErrorMsg] = useState([])
    const appCtx = useContext(AppContext)
    const { appStore } = useStore()
    const navigate = useNavigate()

    const loadBookmarks = async () => {
        try {
            if (!appStore.username) {
                await appStore.getUsername()
            }
            let bookmarksResponse = await apiStore.getSavedBookmarks(appStore.username);
            setShelterBookmarkData(bookmarksResponse)
            let shelterDataResponse = await Promise.all(bookmarksResponse.map(async (post_id) => apiStore.loadSummary(post_id)));
            setShelterData(shelterDataResponse)
          } catch(err) {
            console.log("load bookmarks error: " + err.message)
            setErrorMsg(err.message)
        }
    }

    const loadUserProfile = async () => {
        try {
            if (!appStore.username) {
                await appStore.getUsername()
            }
            let userProfileResponse = await apiStore.getUserProfile(appStore.username);
            setUserProfileData(userProfileResponse)
          } catch(error) {
            console.log("load user profile err " + error.message)
            setErrorMsg(error.message)
        }
    }

    const loadAllComments = async () => {
        try {
            if (!appStore.username) {
                await appStore.getUsername()
            }
            let commentDataResponse = await apiStore.loadAllComments(appStore.username);
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
            return commentData.length === 0 ? 
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                style={{height: "20vh"}}>
                <Typography>You haven't post any comments</Typography>
                </Grid> :
                commentData.map(data => {
                return (
                    <div> 
                        <Typography style={{color: "#F34343", fontWeight:"bold", fontSize: "1.2em"}}>Comment on <Link
                        onClick={() => {
                            navigate("/app/shelter-detail/" + data.post_id)
                        }} color="inherit">
                            {data.post_id.slice(0, -6)}</Link>
                        </Typography>
                        <UserComment 
                            key={data.comment_id} 
                            shelterName={data.post_id.slice(0, -6)}
                            shelter_post_id={data.post_id}
                            commentData={data} 
                            isUpdateComment={false}
                            isHighLighted={false} 
                            isEditAndDeleteable={true}
                            setCommentData={setCommentData}/>
                    </div>
                )
            })
        }
    }

    // console.log(`comments by user ${appCtx.user}: ` + commentData)
    // console.log(`${appCtx.user}'s profile: ` + userProfileData)

    return (
        <>
           {page === 0 ? <Grid 
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
                    <LoadingSpinner text={"Loading your profile"} size={LOADING_SPINNER_SIZE.large} />
                    :
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
                                        setPage(1)
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
                            


                            {shelterBookmarkData.length === 0 ? 
                            <Grid
                                container
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                                style={{height: "20vh"}}>
                                    <Typography>You haven't bookmarked any shelters</Typography>
                            </Grid> : 
                            
                            <ShelterList
                                loaderActive={loaderActive}
                                user={props.user}
                                setUser={props.setUser}
                                shelterData={shelterData}
                                setShelterData={setShelterData}
                                bookmarks={shelterBookmarkData}/>}

                            <Divider style={{width: "100%", marginTop: "20px", marginBottom: "20px"}}/>

                            <Grid
                                item
                                container
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="center"
                                style={{}}>
                                    <Typography variant='h5'>Posted Comments</Typography>
                            </Grid>

                            <Grid style={{width: "100%", margin: "20px", padding: "20px"}}>
                                {comments()}
                            </Grid>
                        </>
                    }
                </Grid>
            </Grid> :
            <UpdateProfileForm profileData={userProfileData} setPage={setPage}/>}
        </>
    );
});

export default RegularUserProfile;


const UpdateProfileForm = ({profileData, setPage}) => {
    const [gender, setGender] = useState(profileData.gender)
    const [city, setCity] = useState(profileData.city)
    const [state, setState] = useState(profileData.state)
    const [errorMsg, setErrorMsg] = useState(profileData.email)
    const appCtx = useContext(AppContext)
    const { apiStore } = useStore()
    const navigate = useNavigate()

    const genderMenuItems = text.onboard.regular.genderOptions.map(val => {
        return <MenuItem value={val}>{val}</MenuItem>
    })
    
    const stateMenuItems = text.usStates.map(val => {
        return <MenuItem value={val}>{val}</MenuItem>
    })

    const errorMsgEle = errorMsg ? <Alert severity="error">{errorMsg}</Alert> : null;

    const handleUpdateUserProfile = async () => {
        console.log(appCtx.userStatus, appCtx.user)
        try {
            const createAccountResult = await apiStore.createUser({
                username: appCtx.user,
                profile_pic_path: "",
                user_role: appCtx.userStatus,
                gender: gender,
                city: city,
                state: state,
                country: DEFAULT_COUNTRY
            })
            console.log("account info update result: ", createAccountResult)
        } catch(err) {
            setErrorMsg(err.message)
        }
    }

    const handleGenderChange = (event) => {
        setGender(event.target.value)
    };

    const handleStateChange = (event) => {
        setState(event.target.value)
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
                    justifyContent="center" 
                    alignItems="center"
                    wrap="nowrap"
                    rowSpacing={3}
                    style={{ width: "100vw", maxWidth: "50em"}}>

                    <Grid
                        item
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        style={{}}>
                        <Button
                            onClick={() => {
                                setPage(0)
                            }}>
                            Back
                        </Button>
                            <Typography>{"Hi, " + appCtx.user}</Typography>
                        <Button
                            onClick={() => {
                                setPage(1)
                            }}>
                            Edit Profile
                        </Button>
                    </Grid>
                    
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