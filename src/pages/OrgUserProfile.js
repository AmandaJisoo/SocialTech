import {React, useState, useEffect, useContext } from 'react';
import ShelterList from "./ShelterList";
import { useStore } from './Hook';
import { Grid, Button } from '@mui/material';
import ShelterCard from '../components/ShelterCard/ShelterCard';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider';
import UserReview from './UserReview';
import AppContext from '../AppContext.js';
import LoadingSpinner from '../components/LoadingSpinner'
import { LOADING_SPINNER_SIZE } from '../utils/utilityFunctions';

//TODO: Yichi only show this when user is logged in as a part of menu
const OrgUserProfile = props => {
    const { apiStore } = useStore();
    const [loaderActive, setLoaderActive] = useState(true);
    const [shelterData, setShelterData] = useState([])
    const [claimData, setClaimData] = useState(null)
    const [errorMsg, setErrorMsg] = useState([])
    const appCtx = useContext(AppContext)

    const loadShelter = async () => {
        // try {
        //     let authRes = await Auth.currentAuthenticatedUser();
        //     let username = authRes.username;
        //     console.log("username for bookmarks", username);
        //     let bookmarksResponse = await apiStore.getSavedBookmarks(username);
        //     let shelterDataResponse = await Promise.all(bookmarksResponse.map(async (post_id) => apiStore.loadSummary(post_id)));
        //     setLoaderActive(false);
        //     setShelterData(shelterDataResponse)
        //   } catch(error) {
        //     console.log(error.message)
        //     setErrorMsg(error.message)
        // }
    }

    const loadClaims = async () => {
        // try {
        //     let commentDataResponse = await apiStore.loadCommentByUser(appCtx.user);
        //     setCommentData(commentDataResponse)
        //   } catch(error) {
        //     console.log(error.message)
        //     setErrorMsg(error.message)
        // }
    }

    useEffect(() => {
        setLoaderActive(true)
        loadShelter();
        loadClaims()
        setLoaderActive(false)
    }, [])

    const claims = () => {
        if (claimData.length === 0) {
            return <Typography>You haven't post any comments</Typography>
        } else {
            return claimData.map(data => {
                return <UserReview reviewData={data} isHighLighted={false} />
            })
        }
    }

    // this.context
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
                        <LoadingSpinner text={"Loading your profile"} size={LOADING_SPINNER_SIZE.large} /> : 
                        <>
                            <Grid   
                                container
                                direction="row"
                                justifyContent="flex-end" 
                                alignItems="center"
                                style={{height: "80vh"}}>
                                    <Typography>Help</Typography>
                                    <Typography>Me</Typography>
                                    <Typography>Edit Profile</Typography>
                            </Grid> 

                          
                            <Typography>{appCtx.user}</Typography>
                             

                            <Divider style={{width: "100%", marginTop: "20px", marginBottom: "20px"}}/>
                            
                            <Grid   
                                container
                                direction="row"
                                justifyContent="flex-start" 
                                alignItems="center"
                                style={{height: "80vh"}}>
                                    <Typography>My Shelters</Typography>
                            </Grid> 
                            <ShelterList loaderActive={loaderActive} user={props.user} setUser={props.setUser} shelterData={shelterData} setShelterData={setShelterData} />

                            <Divider style={{width: "100%", marginTop: "20px", marginBottom: "20px"}}/>

                            <Grid   
                                container
                                direction="row"
                                justifyContent="flex-start" 
                                alignItems="center"
                                style={{height: "80vh"}}>
                                    <Typography>My Claims</Typography>
                            </Grid> 

                            {claims()}

                        </>
                    }
                </Grid>
            </Grid>
        </>
    );
};

export default OrgUserProfile;
