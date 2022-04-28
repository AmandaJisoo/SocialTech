import { React } from 'react';
import Typography from '@mui/material/Typography';
import appTheme from '../theme/appTheme.json';

const ShelterClaimStatusText = ({ claim_status }) => {
    let background, color, text
    if (claim_status === "no_claim") {
        text = "Unclaimed Shelter"
    } else if (claim_status === "pending") {
        text = "Claim In Progress"
    } else {
        text = "Claimed Shelter"

    }

    return (
    <Typography style={{fontSize: "18px", color: color}}>
        Business Status: {text}
    </Typography>
    )
    
};

export default ShelterClaimStatusText;
