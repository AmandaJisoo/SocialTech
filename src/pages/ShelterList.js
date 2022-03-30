import {React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import shelterInfo from "../mockData/shelterInfo.js"
import text from "../text/text.json"
import { Grid, Button } from '@mui/material';
import ShelterCard from '../components/ShelterCard/ShelterCard';
import Typography from '@mui/material/Typography';
import SearchBar from '../components/SearchBar';
import { AUTH_TOKEN_KEYNAME, getWithExpiry } from '../utils/utilityFunctions.js';
import CircularProgress from '@mui/material/CircularProgress'
import { API, Auth } from 'aws-amplify';
import APIStorage from './APIStorage';
import mockUser from '../mockData/mockUser.json';
import { signUpWithPhoneNumberFields } from 'aws-amplify-react/lib-esm/Auth/common/default-sign-up-fields';
import { useStore } from './Hook.js';



const ShelterList = ({user, setUser, shelterData, setShelterData}) => {
    const [userStatus, setUserStatus] = useState(undefined)
    const apiStore = useStore();  
    useEffect(() => {
        const getUserStatus = async () => {
            try {
                const userData = await Auth.currentAuthenticatedUser();
                console.log(userData);
                const userStatusResponse = await apiStore.getUserStatus(userData.username);
                console.log("userStatusResponse", userStatusResponse)
                setUserStatus(userStatusResponse.UserStatus)
                console.log("userStatus", userStatus);
            } catch (err) {
                console.log(err);
                console.log("not authenticated");
            }
        }
        getUserStatus()


        if (getWithExpiry(AUTH_TOKEN_KEYNAME) || sessionStorage.getItem(AUTH_TOKEN_KEYNAME)) {
            setUser(mockUser.userData)
        }

        // data-fetching placeholder 
        setShelterData(shelterInfo.shelters)
        console.log("data reset")
    }, [])
    

    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await Auth.signOut();
            setUser(null)
            localStorage.removeItem(AUTH_TOKEN_KEYNAME)
            sessionStorage.removeItem(AUTH_TOKEN_KEYNAME)
        } catch (error) {
            console.log('error signing out: ', error);
        }
    }



    const shelterCards = shelterData === null ? 
        <Grid   
        container
        direction="column"
        justifyContent="center" 
        alignItems="center"
        style={{height: "80vh"}}>
            <CircularProgress/>
        </Grid> : 
    shelterData.map(cardInfo => {
        return <ShelterCard shelterData={cardInfo} key={cardInfo.id}/>
    })

    const welcomeMsg = 
        <Grid
            container
            justifyContent="center" 
            alignItems="center"
            style={{height: "100vh"}}>
            {user ?
                <>
                    <Typography>Welcome, {user}</Typography>
                    <Button onClick={ handleSignOut }>Log out</Button>
                </> :
                 <>
                 <Button onClick={() => {
                     navigate("/app/auth/sign-in")
                 }}>Sign in</Button>
                </> 
            }    
        </Grid>
        
    console.log("userStatus is ", userStatus);
    //TODO: do redirect front end 
    if (userStatus == 'does_not_exist') {
        return <div>Redirect page to collect info</div>
    } else {
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
    
                    <Grid item>{shelterCards}</Grid>
            </Grid>
        </Grid>
        );
    }

};

ShelterList.propTypes = {
    user: PropTypes.object
};

export default ShelterList;