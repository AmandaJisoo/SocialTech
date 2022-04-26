import { React, useContext, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import appTheme from '../theme/appTheme.json';
import Rating from '@mui/material/Rating';
import TagContainer from './SelectableTags/TagContainer';
import AppContext from '../AppContext';
import { handleReviewDateFormatting } from '../utils/utilityFunctions';
import { useStore } from '../pages/Hook';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import Popover from '@mui/material/Popover';
import { useNavigate } from 'react-router-dom';
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
