import {React, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import text from "../text/text.json"
import { Grid, Button } from '@mui/material';
import ShelterCard from '../components/ShelterCard/ShelterCard';
import Typography from '@mui/material/Typography';
import SearchBar from '../components/SearchBar';
import CircularProgress from '@mui/material/CircularProgress'
import { Auth } from 'aws-amplify';
import { useStore } from './Hook.js';
import AppContext from '../AppContext.js';


const ShelterList = ({user, setUser, shelterData, setShelterData, loaderActive}) => {
    const appCtx = useContext(AppContext);
    const { apiStore } = useStore(); 
    const [bookmarks, setBookmarks] = useState([]);
    
    const navigate = useNavigate();

    const getShelterPostData = async () => {
        //TODO: Amanda maybe?
        try {
            let authRes = await Auth.currentAuthenticatedUser();
            let username = authRes.username;
            console.log("username for amanda", username);
            let bookmarksResponse = await apiStore.getSavedBookmarks(username)
            console.log("bookmarksResponse", bookmarksResponse);
            setBookmarks(bookmarksResponse);
          } catch {
            // TODO: Amanda show pop up 
            //do pop up 
        }
    }

    useEffect(() => {
        getShelterPostData();
    }, [])

    const handleSignOut = async () => {
        try {
            await Auth.signOut();
            setUser(null)
        } catch (error) {
            console.log('error signing out: ', error);
        }
    }


    const shelterCards = () => {
        return (
            shelterData === undefined || loaderActive ? 
                <Grid   
                container
                direction="column"
                justifyContent="center" 
                alignItems="center"
                style={{height: "80vh"}}>
                    <CircularProgress/>
                </Grid> : 
            shelterData.map((cardInfo) => {
                console.log("cardInfo", cardInfo);
                return <ShelterCard user={user} shelterData={cardInfo} key={cardInfo.id} isBookmarked={bookmarks.includes(cardInfo.post_id)} />
            })
        )
    }

    const welcomeMsg = 
        <Grid
            container
            justifyContent="center" 
            alignItems="center"
            style={{height: "100vh"}}>
            {appCtx.user ?
                <>
                    <Typography>Welcome, {appCtx.user}</Typography>
                    <Button onClick={ handleSignOut }>Log out</Button>
                </> :
                 <>
                 <Button onClick={() => {
                     navigate("/app/auth/sign-in")
                 }}>Sign in</Button>
                </> 
            }    
        </Grid>

    console.log("userStatus is ", appCtx.userStatus);
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
                        <SearchBar shelterData={shelterData} setShelterData={setShelterData} />
                    </Grid>
    
                    <Grid item>{shelterCards()}</Grid>
            </Grid>
        </Grid>
        );
    // }

};

ShelterList.propTypes = {
    user: PropTypes.string
};

export default ShelterList;