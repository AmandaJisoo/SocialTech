import {React, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import shelterInfo from "../mockData/shelterInfo.js"
import text from "../text/text.json"
import { Grid } from '@mui/material';
import ShelterCard from '../components/ShelterCard/ShelterCard';
import Typography from '@mui/material/Typography';
import SearchBar from '../components/SearchBar'
import { Button } from '@mui/material';
import { AUTH_TOKEN_KEYNAME, getWithExpiry } from '../utils/utilityFunctions.js';

import mockUser from '../mockData/mockUser.json';
import Tag from '../components/SelectableTags/Tag.js';
const ShelterList = ({user, setUser, setShelterData}) => {
    
    useEffect(() => {
        if (getWithExpiry(AUTH_TOKEN_KEYNAME) || sessionStorage.getItem(AUTH_TOKEN_KEYNAME)) {
            setUser(mockUser.userData)
        }

        // data-fetching placeholder 
        setShelterData(shelterInfo.shelters)
    })

    const navigate = useNavigate();

    const handleSignOut = () => {
        setUser(null)
        localStorage.removeItem(AUTH_TOKEN_KEYNAME)
        sessionStorage.removeItem(AUTH_TOKEN_KEYNAME)
    }

    const shelterCards = shelterInfo.shelters.map(cardInfo => {
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
                    <Typography>Welcome, {user.userName}</Typography>
                    <Button onClick={handleSignOut }>Log out</Button>
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
                spacing={5}
                wrap="nowrap"
                style={{height: "100vh", width: "100vw", maxWidth: "50em"}}>

                <Grid item>
                    <Typography variant="h4" sx={{marginTop: "1em"}}>{text.shelterList.header}</Typography>
                </Grid>

                {welcomeMsg}

                <Tag data={"test"}/>

                <Grid item container style={{width: "90%"}}>
                    <SearchBar />
                </Grid>

                <Grid item>{shelterCards}</Grid>
        </Grid>
    </Grid>
    );
};

ShelterList.propTypes = {
    user: PropTypes.object
};

export default ShelterList;