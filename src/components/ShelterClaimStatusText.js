import { React } from 'react';
import Typography from '@mui/material/Typography';
import appTheme from '../theme/appTheme.json';

const ShelterClaimStatusText = ({ claim_status }) => {
    let background, color, text
    if (claim_status === "no_claim") {
        color = appTheme.palette.dark.darker
        text = "unclaimed shelter"
    } else if (claim_status === "pending") {
        color = appTheme.palette.secondary.main
        text = "claim processing"
    } else {
        color = appTheme.palette.primaryLight.main
        text = "claimed shelter"

    }

    return (
    <Typography style={{fontSize: "13px", color: color}}>
        {text}
    </Typography>
    )
    
};

export default ShelterClaimStatusText;
