import {React, useEffect, useState} from 'react';
import { SORT_OPTIONS } from '../utils/utilityFunctions';
import { Grid, Button, Typography } from '@mui/material';

import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../pages/Hook';
import LoadingSpinner from '../components/LoadingSpinner';
import { LOADING_SPINNER_SIZE } from '../utils/utilityFunctions';
import ClaimCard from './ClaimCard';

const Application = () => {
    const [user, setUser] = useState(undefined);
    const navigate = useNavigate();
    const { apiStore } = useStore();
    const requiredStatus = "pending"
    const [pendingClaims, setPendingClaims] = useState([])
    const [loaderActive, setLoaderActive] = useState(false);
    const getApplication = async() => {
        try {
            setLoaderActive(true);
            let claims = apiStore.getClaimsByStatus(requiredStatus);
            console.log('claims', claims);
            setPendingClaims(claims);
            setLoaderActive(false);
        } catch(err) {
            navigate("/app/dashboard")
        }

    }

    const applicationCards = () => {
        return (
            (loaderActive ? 
                <LoadingSpinner text={"Loading Data"} size={LOADING_SPINNER_SIZE.large} />
                : 
                pendingClaims.map((claimInfo) => {
                return <ClaimCard claimInfo={claimInfo}></ClaimCard>
            })
        ))
    }


    useEffect(() => { 
        getApplication();
    }, [])
    return( 
        <Card 
        onClick={() => {
            // console.log("shelterData for card", shelterData);
            // appStore.setShelterData(shelterData);
        }}
        style={{
            padding: "5px 20px 5px 20px",
            margin: "20px",
            boxShadow: "0px 16px 16px rgba(50, 50, 71, 0.08), 0px 24px 32px rgba(50, 50, 71, 0.08)",
            borderRadius: "8px"
        }}
    >
    <Typography>hello</Typography>
    </Card>
    );
};


export default Application;