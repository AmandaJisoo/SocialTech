import { React, } from 'react';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const SortOption = ({ optionName, sortOption, setSortOption }) => {

    return (
      <Grid 
        container
        justifyContent='space-between'
        style={{margin: "10px 0"}}
        onClick={() => {
          setSortOption(optionName)
        }}
        >
        <Typography>{optionName}</Typography>    

        {optionName === sortOption ? 
            <CheckCircleIcon color='primary'/> :
            <CheckCircleOutlineIcon/>
        }
      </Grid>
    );
};

export default SortOption;
