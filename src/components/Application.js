import { React, useEffect, useState } from 'react';
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
    const navigate = useNavigate();
    const { apiStore } = useStore();
    const requiredStatus = "pending"
    const [pendingClaims, setPendingClaims] = useState(undefined)
    const [loaderActive, setLoaderActive] = useState(false);
    console.log('pendingClaims', pendingClaims)

    const getApplication = async () => {
        try {
            setLoaderActive(true);
            let claims = await apiStore.getClaimsByStatus(requiredStatus);
            console.log('claims', claims);
            setPendingClaims(claims);
            setLoaderActive(false);
        } catch (err) {
            console.error(err);
            navigate("/app/dashboard")
        }

    }

    const applicationCards = () => {
        return (
            pendingClaims == undefined || loaderActive ?
                <LoadingSpinner text={"Loading Data"} size={LOADING_SPINNER_SIZE.large} />
                :
                pendingClaims && pendingClaims.length == 0 ?
                  <Grid
                        container
                        direction="column" 
                        justifyContent="center" 
                        alignItems="center"
                        style={{marginTop: "40vh"}}>
                        <Typography style={{fontWeight: "bold", fontSize: "1.2rem"}}>No applicatoin submitted</Typography>
                    </Grid>:
                    (pendingClaims.map((claimInfo) => { return <ClaimCard claimInfo={claimInfo} reloadApplication={getApplication}></ClaimCard> })
                    )

        )
    }


    useEffect(() => {
        (async () => {
            await getApplication();
        })()
    }, [])

    return (
        // <Card 
        // onClick={() => {
        //     // console.log("shelterData for card", shelterData);
        //     // appStore.setShelterData(shelterData);
        // }}
        // style={{
        //     padding: "5px 20px 5px 20px",
        //     margin: "20px",
        //     boxShadow: "0px 16px 16px rgba(50, 50, 71, 0.08), 0px 24px 32px rgba(50, 50, 71, 0.08)",
        //     borderRadius: "8px"
        // }}
        // >
        <Grid>
            {applicationCards()}
        </Grid>

        //  </Card>
    );
};


export default Application;