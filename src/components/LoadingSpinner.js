import React from "react";
import { Alert, Card, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress'

const LoadingSpinner = ({text, size}) => {
  return  (
  <Grid   
    container
    direction="column"
    justifyContent="center" 
    alignItems="center"
    style={{height: size}}>
        <CircularProgress/>
        <Typography>{text}</Typography>
    </Grid>);
}

export default LoadingSpinner
