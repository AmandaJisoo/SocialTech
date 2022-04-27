import {React, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import text from "../text/text.json"
import { Grid, Button } from '@mui/material';
import ShelterCard from '../components/ShelterCard/ShelterCard';
import Typography from '@mui/material/Typography';
import ShelterDisplayControlWidget from '../components/ShelterDisplayControlWidget';
import CircularProgress from '@mui/material/CircularProgress'
import { Auth } from 'aws-amplify';
import { useStore } from './Hook.js';
import AppContext from '../AppContext.js';
import ShelterList from './ShelterList';

const Dashboard = ({user, setUser, shelterData, setShelterData}) => {
    const appCtx = useContext(AppContext);
    const { apiStore } = useStore(); 
    const [bookmarks, setBookmarks] = useState([]);

    const navigate = useNavigate();

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
                        navigate("/app/regular-user-profile/" + appCtx.user)
                    } }>Profile</Button>
                </> :
                 <>
                 <Button onClick={() => {
                     navigate("/app/auth/sign-in")
                 }}>Sign in</Button>
                </> 
            }    
        </Grid>

        return (
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
                        
                    <Grid item>
                        <Typography variant="h4" sx={{marginTop: "1em"}}>{text.shelterList.header}</Typography>
                    </Grid>
    
                    {welcomeMsg}
    
                    <Grid item container style={{width: "90%"}}>
                        <ShelterDisplayControlWidget shelterData={shelterData} setShelterData={setShelterData} />
                    </Grid>
    
                    {/* change this to <ShelterList/> element */}
                    
                    <ShelterList 
                        loaderActive={false} 
                        user={user} 
                        setUser={setUser} 
                        shelterData={shelterData} 
                        setShelterData={setShelterData}
                        bookmarks={bookmarks}/>
            </Grid>
        </Grid>
    );
};

export default Dashboard
