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

const ShelterClaim = ({ claimData }) => {
    const { apiStore } = useStore(); 
    const [open, setOpen] = useState(undefined)
    const buttonRef = useRef(null);
    const appCtx = useContext(AppContext);
    const [likeState, setLikeState] = useState(undefined);
    const [numOfLikes, setNumOfLikes] = useState(undefined);
    const navigate = useNavigate();


    useEffect(() => {

    }, [])

    return (
      <Card 
        style={{
            padding: "20px",
            margin: "20px 0px",
            boxShadow: "0px 16px 16px rgba(50, 50, 71, 0.08), 0px 24px 32px rgba(50, 50, 71, 0.08)",
            borderRadius: "8px"
        }}>

                
      </Card>
    );
};

export default ShelterClaim;
