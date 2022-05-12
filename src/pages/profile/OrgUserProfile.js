import { React, useState, useEffect, useContext, useRef } from 'react';
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
import { DEFAULT_COUNTRY, SHELTER_CARD_DISPLAY_STATUS, LOADING_SPINNER_SIZE } from '../../utils/utilityFunctions';
import ShelterClaim from '../../components/ShelterClaim';
import LoadingSpinner from '../../components/LoadingSpinner';
import Avatar from '@mui/material/Avatar';


//TODO: Yichi only show this when user is logged in as a part of menu
const OrgUserProfile = observer(props => {
    const { apiStore } = useStore();
    const [page, setPage] = useState(0);
    const [loaderActive, setLoaderActive] = useState(false);
    const [shelterBookmarkData, setShelterBookmarkData] = useState([])
    const [shelterData, setShelterData] = useState([])
    const [commentData, setCommentData] = useState(null)
    const [userProfileData, setUserProfileData] = useState(null)
    const [allClaims, setAllClaims] = useState(null)
    const [claimedShelters, setClaimedShelters] = useState(null)
    const [errorMsg, setErrorMsg] = useState([])
    const appCtx = useContext(AppContext)
    const { appStore } = useStore()
    const navigate = useNavigate()
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState([]);


    const handleNext = async (file) => {
        try {
            let s3Path = ""
            if (file) {
                s3Path = await apiStore.uploadImageToS3(file)
                console.log("s3Path", s3Path)
            }
            const createAccountResult = await apiStore.createUser({
                username: appCtx.user,
                profile_pic_path: s3Path,
                user_role: appCtx.userStatus,
            })
            let profile = await apiStore.getUserProfile(appCtx.user)
            appStore.setUserProfilePic(appCtx.user, profile.profile_pic_path)
            console.log("create account result: ", createAccountResult)
        } catch (err) {
            setErrorMsg(err.message)
        }
    }

    const selectFile = () => {
        console.log("selected file called")
        fileInputRef.current.click()
    }

    const loadBookmarks = async () => {
        try {
            if (!appStore.username) {
                await appStore.getUsername()
            }
            let bookmarksResponse = await apiStore.getSavedBookmarks(appStore.username);
            setShelterBookmarkData(bookmarksResponse)
            let shelterDataResponse = await Promise.all(bookmarksResponse.map(async (post_id) => apiStore.loadSummary(post_id)));
            setShelterData(shelterDataResponse)
        } catch (err) {
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
        } catch (error) {
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
        } catch (error) {
            console.log("load all comment err" + error.message)
            setErrorMsg(error.message)
        }
    }

    const loadAllClaims = async () => {
        try {
            if (!appStore.username) {
                await appStore.getUsername()
            }

            let loadClaimResponse = await apiStore.getAllClaims(appStore.username)
            loadClaimResponse.map(async (res) => {
                let claimShelterSummary = await apiStore.loadSummary(res.post_id)
                res['shelter_summary'] = claimShelterSummary
                return res;
            })

            for (const claim_data of loadClaimResponse) {
                let claimShelterSummary = await apiStore.loadSummary(claim_data.post_id)
                claim_data['shelter_summary'] = claimShelterSummary

                const streetAddress = claimShelterSummary ? claimShelterSummary.street.toUpperCase() : ""
                const cityAddress = claimShelterSummary ? `${claimShelterSummary.city}, ${claimShelterSummary.state}, ${claimShelterSummary.zipcode}`.toUpperCase() : ""
                const fullAddress = `${streetAddress} ${cityAddress}`

                let distance = await apiStore.getDistanceBetweenZipcodes(98103, fullAddress)
                //console.log("distance: " + distance)
                claim_data['shelter_summary']['distanceToUserLocation'] = distance
            }

            console.log(loadClaimResponse)
            const claimedShelters = loadClaimResponse.filter((claim_data) => {
                return claim_data.status === 'claimed';
            })

            setAllClaims(loadClaimResponse)
            setClaimedShelters(claimedShelters)
        } catch (error) {
            console.log("load pending claim err" + error.message)
        }
    }

    useEffect(() => {
        setLoaderActive(true)
        loadAllClaims()
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
                    style={{ height: "20vh" }}>
                    <Typography>You haven't post any comments</Typography>
                </Grid> :
                commentData.map(data => {
                    return (
                        <div>
                            <Typography style={{ color: "#F34343", fontWeight: "bold", fontSize: "1.2em" }}>Comment on <Link
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
                                setCommentData={setCommentData} />
                        </div>
                    )
                })
        }
    }

    const claimsEles = () => {
        if (allClaims !== null) {
            return allClaims.length === 0 ?
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    style={{ height: "20vh" }}>
                    <Typography>You have no claims</Typography>
                </Grid> :
                allClaims
                    .filter((claim) => claim.status == "pending")
                    .map(claim_data => {
                        return <ShelterCard
                            user={appStore.username}
                            shelterData={claim_data.shelter_summary}
                            isBookmarked={false}
                            displayStatus={SHELTER_CARD_DISPLAY_STATUS.shelterClaim} />
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
                    style={{ height: "20vh" }}>
                    <Typography>No Shelter claimed</Typography>
                </Grid> :
                claimedShelters.map(claim_data => {
                    return <ShelterCard
                        user={appStore.username}
                        shelterData={claim_data.shelter_summary}
                        isBookmarked={false}
                        displayStatus={SHELTER_CARD_DISPLAY_STATUS.shelterClaim} />
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
                alignItems="flex-start"
                wrap="nowrap"
                style={{ height: "100vh", width: "100vw" }}>
                <Grid
                    container
                    direction="column"
                    justifyContent="flex-start"
                    alignItems="center"
                    wrap="nowrap"
                    rowSpacing={2}
                    style={{ width: "100vw", maxWidth: "50em", padding: "20px" }}>

                    {loaderActive ?
                        <LoadingSpinner text={"Loading your profile"} size={LOADING_SPINNER_SIZE.large} /> :
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
                                    hello
                                </Button>
                            </Grid>
                            <Typography style={{ fontWeight: "bold" }}>{"Hi, " + appCtx.user}</Typography>

                            <Avatar sx={{ width: 100, height: 100 }} alt="Remy Sharp" src={appStore.userProfilePic[appStore.username]} />
                            <label htmlFor="contained-button-file">
                                å<input
                                    type="file"
                                    name="file"
                                    onChange={() => {
                                        console.log("selected files: ", fileInputRef.current.files)
                                        handleNext(fileInputRef.current.files[0])
                                        setSelectedFile(Array.from(fileInputRef.current.files))
                                    }}
                                    accept="image/*"
                                    ref={fileInputRef}
                                    style={{ display: "none" }} />
                                <Button variant="contained" component="span" style={{ marginTop: "13px" }} onClick={() => selectFile()}>
                                    Change Profile
                                </Button>
                            </label>
                            <Divider style={{ width: "100%", marginTop: "20px", marginBottom: "20px" }} />
                            <Grid
                                container
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="center"
                                style={{}}>
                                <Typography variant='h5'>Claimed Shelters</Typography>
                            </Grid>
                            <Grid>
                                {claimedShelterEles()}
                            </Grid>
                            <Divider style={{ width: "100%", marginTop: "20px", marginBottom: "20px" }} />
                            <Grid
                                item
                                container
                                direction="row"
                                justifyContent="flex-start"
                                alignItems="center"
                                style={{}}>
                                <Typography variant='h5'>Your Claims</Typography>
                            </Grid>

                            <Grid style={{ width: "100%", margin: "20px", padding: "20px" }}>
                                {claimsEles()}
                            </Grid>
                        </>
                    }
                </Grid>
            </Grid> :
                <UpdateProfileForm profileData={userProfileData} setPage={setPage} />}
        </>
    );
});

export default OrgUserProfile;

const UpdateProfileForm = ({ profileData, setPage }) => {
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
                {/* <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    wrap="nowrap"
                    rowSpacing={3}
                    style={{ width: "100vw", maxWidth: "50em" }}> */}
                <Grid
                    item
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    style={{}}>
                    <Grid
                        item xs={5}>
                        <Button
                            onClick={() => {
                                setPage(0)
                            }}>
                            Back
                        </Button>
                    </Grid>
                    <Grid item xs={7}>
                        <Typography style={{ fontWeight: "bold" }}>{"Hi, " + appCtx.user}</Typography>
                    </Grid>
                </Grid>
                {/* <Button
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
                        </Button> */}
                {/* </Grid> */}

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

                {/* </Grid> */}
            </Grid>
        </>
    )
}