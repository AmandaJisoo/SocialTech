import {React, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import text from "../text/text.json"
import { Grid, Button, Divider } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import ShelterDisplayControlWidget from '../components/ShelterDisplayControlWidget';
import { Auth } from 'aws-amplify';
import { useStore } from './Hook.js';
import AppContext from '../AppContext.js';
import ShelterList from './ShelterList';
import LoadingSpinner from '../components/LoadingSpinner';
import { LOADING_SPINNER_SIZE } from '../utils/utilityFunctions';
import { observer } from "mobx-react"

const Dashboard = observer(({user, setUser, shelterData, setShelterData, dataLoading = false}) => {
    const appCtx = useContext(AppContext);
    const { apiStore, appStore } = useStore(); 
    const [bookmarks, setBookmarks] = useState([]);
    const [page, setPage] = useState(1)
    const pageSize = 10;
    console.log(page)
    const paginatedShelterData = shelterData.slice(pageSize * (page - 1), pageSize * page)
    const [isLoaderActive, setIsLoaderActive] = useState(false)
    // const [userStatus, setUserStatus] = useState("")

    const navigate = useNavigate();

    useEffect(() => {
        const getUserStatus = async () => {
            try {
                console.log("ctxt", appCtx.userStatus)
                const userData = await Auth.currentAuthenticatedUser();
                const userStatusResponse = await apiStore.getUserStatus(userData.username);
                // setUserStatus(userStatusResponse)
                if (userStatusResponse.UserStatus === "does_not_exist") {
                    console.log("here is called")
                    navigate("/app/onboard/intro")
                }
                console.log("current status in dashboard: ", userStatusResponse)
            } catch (err) {
                console.log(err);
                console.error("Error in fetching user status: Not authenticated");
            }
          }

          getUserStatus();
    }, [])
    useEffect(() => {
        const getShelterPostBookmarkData = async () => {
            //TODO: Amanda maybe?
            try {
                let authRes = await Auth.currentAuthenticatedUser();
                let username = authRes.username;
                console.log("username for amanda", username);
                let bookmarksResponse = await apiStore.getSavedBookmarks(username)
                console.log("bookmarksResponse", bookmarksResponse);
                setBookmarks(bookmarksResponse);
              } catch (err) {
                // TODO: Amanda show pop up 
                //do pop up 
            }
        }
    
        getShelterPostBookmarkData();
    }, [])

    useEffect(() => {
        setPage(1)
    }, [shelterData])

    const handleSignOut = async () => {
        try {
            await Auth.signOut();
            setUser(null)
        } catch (error) {
            console.log('error signing out: ', error);
        }
    }

    const welcomeMsg = 
        <Grid
            container
            justifyContent="center" 
            alignItems="center"
            style={{height: "10vh"}}>
            {appCtx.user ?
                <>
                    <Typography>Welcome, {appCtx.user}</Typography>
                    <Button onClick={ handleSignOut }>Log out</Button>
                    <Button onClick={ () => {
                        if (appCtx.userStatus === "shelter_owner") {
                            navigate('/app/org-user-profile/' + appCtx.user)
                        } else {
                            navigate("/app/regular-user-profile/" + appCtx.user)
                        }
                    } }>Profile</Button>
                </> :
                 <>
                 <Button onClick={() => {
                     navigate("/app/auth/sign-in")
                 }}>Sign in</Button>
                </> 
            }    
        </Grid>

        return (<Grid
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
            
            <Typography variant="h3" sx={{marginTop: "1em", color: "#F34343"}} >Shelp</Typography>
            <Typography style={{marginTop: "1px", fontSize:"1.1rem"}}>Find shelters that meet your needs</Typography>
           
            
            {welcomeMsg}

            <Grid item container style={{width: "90%"}}>
                <ShelterDisplayControlWidget setIsLoaderActive={setIsLoaderActive} shelterData={shelterData} setShelterData={setShelterData} />
            </Grid>

            {/* change this to <ShelterList/> element */}
            
            {appStore.showNoLocationError ? <>
                <Typography>Cannot load information without location enabled.</Typography>
            </>
            : !dataLoading? 
            (<>
                <ShelterList 
                    loaderActive={isLoaderActive} 
                    user={user} 
                    setUser={setUser} 
                    shelterData={paginatedShelterData} 
                    setShelterData={setShelterData}
                    bookmarks={bookmarks}/>
                {shelterData && shelterData.length === 0 ? 
                (<div style={{justifyContent: "center", alignItems:"center"}}>
                <Typography style={{marginTop: '25vh', fontSize: "1.3rem"}}>No shelter found at this zipcode.</Typography>
                <Typography style={{fontSize: "1.3rem"}}> Please try City or Name option</Typography>
                </div>)
                    :(<>
                    <Pagination count={Math.floor(shelterData.length / pageSize) + ((shelterData.length % pageSize == 0) ? 0 : 1)} page={page} onChange={(event, value) => {console.log(event); console.log(value); setPage(value)}} />
                    <Grid item>
                        <Divider style={{width: "100%", marginTop: "20px", marginBottom: "20px"}}/>
                    </Grid>
                    </>)
                }
            </>
            ): 
                <LoadingSpinner text={"Loading Data"} size={LOADING_SPINNER_SIZE.large} />
            }
    </Grid>
</Grid>)   
});

export default Dashboard
