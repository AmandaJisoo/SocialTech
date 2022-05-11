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


const ClaimCard = (claimInfo) => {

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
    <Typography>claimInfo</Typography>
    </Card>
    );
};


export default ClaimCard;