import { React } from 'react';
import appTheme from '../theme/appTheme.json';
import InfoIcon from '@mui/icons-material/Info';
import { Grid, Button, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import PendingIcon from '@mui/icons-material/Pending';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ShelterClaimStatusText = ({ claim_status }) => {
    let background, color, text, val
    if (claim_status === "no_claim") {
        val = 
        <Grid container direction="row" alignItems="center">
            <Grid item>
            <IconButton aria-label="business claim status">
                <InfoIcon style={{ color: '#48AAAD' }}/>
            </IconButton>
            </Grid>
            <Grid item>
                <Typography style={{fontSize: "17px", color: '#48AAAD' }}>
                Unclaimed
                </Typography>
            </Grid>
        </Grid>
    } else if (claim_status === "pending") {
        val = 
        <Grid container direction="row" alignItems="center">
            <Grid item>
                <IconButton aria-label="business claim status">
                    <PendingIcon style={{ color: '#48AAAD' }}/>
            </IconButton>
            </Grid>
            <Grid item>
                <Typography style={{fontSize: "17px", color: '#48AAAD' }}>
                    Pending Verification
                </Typography>
            </Grid>
        </Grid>
    } else {
        val = 
        <Grid container direction="row" alignItems="center">
            <Grid item>
            <IconButton aria-label="business claim status">
                <CheckCircleIcon style={{ color: '#48AAAD' }}/>
            </IconButton>
        </Grid>
        <Grid item>
            <Typography style={{fontSize: "17px", color: '#48AAAD' }}>
                Claimed 
            </Typography>
        </Grid>
    </Grid>
    }

    return val
};

export default ShelterClaimStatusText;
