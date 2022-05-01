import {React, useState, useEffect, useContext } from 'react';
import ShelterList from "../ShelterList";
import { useStore } from '../Hook';
import { useNavigate } from 'react-router-dom';
import text from "../../text/text.json"
import { Grid, Button } from '@mui/material';
import ShelterCard from '../../components/ShelterCard/ShelterCard';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider';
import UserComment from '../../components/UserComment';
import AppContext from '../../AppContext.js';
import Alert from '@mui/material/Alert';
import { observer } from "mobx-react";
import Link from '@mui/material/Link';
import { DEFAULT_COUNTRY } from '../../utils/utilityFunctions';
import ShelterClaim from '../../components/ShelterClaim';

const SHLETER_CLAIM_PLACEHOLDER_DATA = [
    {
        "claimed_utilities": [ "shower", "bathroom" ], 
        "username": "fuckers1", 
        "post_id": "lori shelter#98001", 
        "status": "pending"
    },
    {
        "claimed_utilities": [ "shower", "bathroom" ], 
        "username": "fuckers1", 
        "post_id": "lori shelter#980012", 
        "status": "pending"
    },
    {
        "claimed_utilities": [ "shower", "bathroom" ], 
        "username": "fuckers1", 
        "post_id": "lori shelter#980013", 
        "status": "pending"
    }
]

const CLAIMED_SHELTER_PLACEHOLDER_DATA = [
    {
        "city": "seattle",
        "zipcode": "98105",
        "num_of_comments": 1,
        "post_id": "The BLOCK Project#98105",
        "profile_pic_path": "https://socialtechcapstone.s3.amazonaws.com/public/image_not_available.jpg?AWSAccessKeyId=ASIA3ZCWBAZCWO6ZZFR4&Signature=cqf8WAeOJUQh1AV7bYApXT2s1pA%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEGAaCXVzLWVhc3QtMSJIMEYCIQDCtFenHB8SPtnL1RaRb2WDMpl1xxwX8t%2FymM1uTkjm6AIhAOfP5TyJJbH0MsgWlFm74ZpgY7xyyvf1LLtjiXmc5uL6KpECCCgQAhoMODA5NzgxNzU3NTA5IgyeTgXirbk4K2A33Uoq7gFbCoaIeVh%2FwscWSQpmjYutBj2my1OZC0RXXN6YGXtZNSg4BPLIv8GSIP6%2FJDg4QRo%2Fkt%2Bwq%2FR62lqiplN3IPqyfO%2BsJmFnsEx2q0RYEO5zZSihvpaaIyF4FqV2KOoK5KOByypiPKlmN6dzDkUdvMTIfzVK%2F%2FQ%2BNhapJCI9KAu5SbOlvdzM%2Bsy20IPPNbZvFcply%2Fica2fe%2FIMH9yAVoSHgQj4opMZmTPWlx1SFGa53XnjOznqfEXy7SgvLwhrJN1HQvxaIlfasZQeLVZ1ptTO9t0vNKx8XKfkrpXEC8Sb63XO1OeM81M2ukELDgsd2MIXiuJMGOpkBpr9Frkjn1KerXWCGz%2BZL2FABgZy09pqjy%2FxjwSricFIhx6ndoF4ORDPuIuXh2Jfxbb5acCgL9qqJg8VsAQrZC7nRYTLm%2FqwzCM33vn9rdRBVW%2F6es%2Fwx12WJ8BZkReolkVEKICJRZVfZZF9fXNQlrwPFsJcbU4SsB%2FiVDmoz24rEsTmoFrXHgHUaFfCnDSpemVOzzvYary6i&Expires=1651993479",
        "utilities": [
            "Wheelchair Ramp",
            "Free Clothes",
            "Well-Maintained Amenities",
            "Free Hygiene kits"
        ],
        "num_of_bookmarks": 0,
        "state": "WA",
        "street": "4001 9th ave ne",
        "title": "The BLOCK Project",
        "avg_rating": 0,
        "distanceToUserLocation": "1.5 mi"
    },
    {
        "city": "seattle",
        "zipcode": "98105",
        "num_of_comments": 0,
        "post_id": "Roots Young Adult Shelter#98105",
        "profile_pic_path": "https://socialtechcapstone.s3.amazonaws.com/user_uploads/75fdb483-894b-444d-96f5-832abc4e1bd2-photo?AWSAccessKeyId=ASIA3ZCWBAZCWO6ZZFR4&Signature=WxKFdpCf96gM8bDuc9v8nmRsOFg%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEGAaCXVzLWVhc3QtMSJIMEYCIQDCtFenHB8SPtnL1RaRb2WDMpl1xxwX8t%2FymM1uTkjm6AIhAOfP5TyJJbH0MsgWlFm74ZpgY7xyyvf1LLtjiXmc5uL6KpECCCgQAhoMODA5NzgxNzU3NTA5IgyeTgXirbk4K2A33Uoq7gFbCoaIeVh%2FwscWSQpmjYutBj2my1OZC0RXXN6YGXtZNSg4BPLIv8GSIP6%2FJDg4QRo%2Fkt%2Bwq%2FR62lqiplN3IPqyfO%2BsJmFnsEx2q0RYEO5zZSihvpaaIyF4FqV2KOoK5KOByypiPKlmN6dzDkUdvMTIfzVK%2F%2FQ%2BNhapJCI9KAu5SbOlvdzM%2Bsy20IPPNbZvFcply%2Fica2fe%2FIMH9yAVoSHgQj4opMZmTPWlx1SFGa53XnjOznqfEXy7SgvLwhrJN1HQvxaIlfasZQeLVZ1ptTO9t0vNKx8XKfkrpXEC8Sb63XO1OeM81M2ukELDgsd2MIXiuJMGOpkBpr9Frkjn1KerXWCGz%2BZL2FABgZy09pqjy%2FxjwSricFIhx6ndoF4ORDPuIuXh2Jfxbb5acCgL9qqJg8VsAQrZC7nRYTLm%2FqwzCM33vn9rdRBVW%2F6es%2Fwx12WJ8BZkReolkVEKICJRZVfZZF9fXNQlrwPFsJcbU4SsB%2FiVDmoz24rEsTmoFrXHgHUaFfCnDSpemVOzzvYary6i&Expires=1651993480",
        "utilities": [
            "Shower",
            "Employment Help enter",
            "Bathroom",
            "Free Hygiene kits"
        ],
        "num_of_bookmarks": 0,
        "state": "WA",
        "street": "4541 19th ave ne",
        "title": "Roots Young Adult Shelter",
        "avg_rating": 0,
        "distanceToUserLocation": "1.8 mi"
    }
]


//TODO: Yichi only show this when user is logged in as a part of menu
const OrgUserProfile = observer(props => {
    const { apiStore } = useStore();
    const [page, setPage] = useState(0);
    const [loaderActive, setLoaderActive] = useState(false);
    const [shelterBookmarkData, setShelterBookmarkData] = useState([])
    const [shelterData, setShelterData] = useState([])
    const [commentData, setCommentData] = useState(null)
    const [userProfileData, setUserProfileData] = useState(null)
    const [pendingClaims, setPendingClaims] = useState(null)
    const [claimedShelters, setClaimedShelters] = useState(null)
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

    const loadPendingClaims = async () => {
        try {
            if (!appStore.username) {
                await appStore.getUsername()
            }

            // use placeholder data since API is not yet provided 
            setPendingClaims(SHLETER_CLAIM_PLACEHOLDER_DATA)
          } catch(error) {
            console.log("load pending claim err" + error.message)
        }
    }

    const loadClaimedShelter = async () => {
        try {
            if (!appStore.username) {
                await appStore.getUsername()
            }
            // let commentDataResponse = await apiStore.loadAllComments(appStore.username);
            // setCommentData(commentDataResponse)


            // use placeholder data since API is not yet provided 
            setClaimedShelters(CLAIMED_SHELTER_PLACEHOLDER_DATA)
          } catch(error) {
            console.log("load claimed shelter err" + error.message)
        }
    }


    useEffect(() => {
        setLoaderActive(true)
        // loadBookmarks();
        // loadAllComments()
        // loadUserProfile()
        loadPendingClaims()
        loadClaimedShelter()
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

    const claimedShelterEles = () => {
        if (claimedShelters !== null) {
            return claimedShelters.length === 0 ? 
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                style={{height: "20vh"}}>
                <Typography>You haven't claimed any chelters</Typography>
                </Grid> :
                 <ShelterList user={appCtx.user} shelterData={claimedShelters} loaderActive={false} /> 
            
        }
    }

    const pendingClaimsEles = () => {
        if (pendingClaims !== null) {
            return pendingClaims.length === 0 ? 
            <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                style={{height: "20vh"}}>
                <Typography>You have no pending claims</Typography>
                </Grid> :
                pendingClaims.map(claim => {
                return <ShelterClaim claim_data={claim} key={claim.post_id}/> 
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
                                        //setPage(1)
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
                                    <Typography variant='h5'>Claimed Shelters</Typography>
                            </Grid>
                            


                            {claimedShelterEles()}

                            <Divider style={{width: "100%", marginTop: "20px", marginBottom: "20px"}}/>

                            <Grid
                                item
                                container
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="center"
                                style={{}}>
                                    <Typography variant='h5'>Pending Claims</Typography>
                            </Grid>

                            <Grid style={{width: "100%", margin: "20px", padding: "20px"}}>
                                {pendingClaimsEles()}
                            </Grid>
                        </>
                    }
                </Grid>
            </Grid> :
            <UpdateProfileForm profileData={userProfileData} setPage={setPage}/>}
        </>
    );
});

export default OrgUserProfile;


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
                profile_pic_path: "DEFAULT_PROFILE_PATH",
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