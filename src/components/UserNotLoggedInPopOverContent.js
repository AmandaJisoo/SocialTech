import { React } from 'react';
import Typography from '@mui/material/Typography';
import appTheme from '../theme/appTheme.json';
import { useNavigate } from 'react-router-dom';

const UserNotLoggedInPopOverContent = () => {
    const navigate = useNavigate();

    return (
        <Typography>
            You are not logged in. Click
         <span 
            style={{color: appTheme.palette.primary.main, cursor: "pointer"}}
            onClick={() => {
                navigate("/app/auth/sign-in")
            }}> here </span> 
         to log in
        </Typography>
    );
};

export default UserNotLoggedInPopOverContent;
