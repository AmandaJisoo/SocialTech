import { React } from 'react';
import Typography from '@mui/material/Typography';
import appTheme from '../theme/appTheme.json';
import { useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';

const UserNotLoggedInPopOverContent = () => {
    const navigate = useNavigate();

    return (
        <Grid style={{padding: "20px"}}>
            <Typography>
                You are not logged in. Click
            <span 
                style={{color: appTheme.palette.primary.main, cursor: "pointer"}}
                onClick={() => {
                    navigate("/app/auth/sign-in")
                }}> here </span> 
            to log in
            </Typography>
        </Grid>
    );
};

export default UserNotLoggedInPopOverContent;
