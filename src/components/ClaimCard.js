import {React, useContext, useEffect, useState} from 'react';
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
import TagContainer from './SelectableTags/TagContainer';
import AppContext from '../AppContext';


const ClaimCard = ({claimInfo, reloadApplication}) => {
    const appCtx = useContext(AppContext);
    const { apiStore } = useStore(); 

    const handleApprove = async() => {
        try {
            const shelterData = await apiStore.approveClaim(claimInfo.post_id, claimInfo.claimed_utilities);
        } catch(err) {
            console.error(err)
        } finally {
            const createClaimResponse = await apiStore.createClaim(claimInfo.username, claimInfo.post_id, "claimed", claimInfo.claimed_utilities)
            console.log('createClaimResponse', createClaimResponse)
            await reloadApplication();
        }
    }

    const handleReject = async() => {
        try {
            //delete the claim
            let res =  await apiStore.deleteClaim(claimInfo.post_id, claimInfo.username)
        } catch (err) {
            console.error(err)
        } finally {
            await reloadApplication();
        }
    }

    return( 
    <Card 
        onClick={() => {
            // console.log("shelterData for card", shelterData);
            // appStore.setShelterData(shelterData);
        }}
        style={{
            padding: "5px 20px 5px 20px",
            margin: "25px",
            boxShadow: "0px 16px 16px rgba(50, 50, 71, 0.08), 0px 24px 32px rgba(50, 50, 71, 0.08)",
            borderRadius: "8px"
        }}
    >
        <Typography><Typography style={{fontWeight: "bold"}}>Shelter Name:</Typography> {claimInfo.post_id.slice(0, -6)}</Typography>
        <Typography><Typography style={{fontWeight: "bold"}}>Applicant:</Typography> {claimInfo.username}</Typography> 
        <Typography><Typography style={{fontWeight: "bold"}}>Status:</Typography> {claimInfo.status}</Typography>
        <Typography style={{fontWeight: "bold"}}>Claimed Utilities:</Typography>
        <TagContainer tagData={claimInfo.claimed_utilities} isSelectable={false}/>
        <Button variant='outlined'style={{marginRight: "30px", marginTop: "30px"}} onClick={() => {handleApprove()}}>
            Approve
        </Button>
        <Button variant='outlined'style={{marginTop: "30px"}} onClick={() => {handleReject()}}>
            reject
        </Button>
    </Card>
    );
};


export default ClaimCard;