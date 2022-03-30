import React from 'react';
import { Grid } from '@mui/material';
import { Outlet } from 'react-router-dom';

const AuthenticatorGrid = props => {
    return (
    
        <Grid
            container 
            direction="column"
            justifyContent="center"
            alignItems="center"
            style={{height: "100vh"}}>
            <Outlet/>
        </Grid>
    );
};

export default AuthenticatorGrid;
