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
import { useStore } from '../pages/Hook';
import { useNavigate } from 'react-router-dom';
import Tag from './SelectableTags/Tag';

const ShelterClaim = ({ claim_data }) => {
    const { apiStore } = useStore(); 
    const [open, setOpen] = useState(undefined)
    const buttonRef = useRef(null);
    const appCtx = useContext(AppContext);
    const [likeState, setLikeState] = useState(undefined);
    const [numOfLikes, setNumOfLikes] = useState(undefined);
    const navigate = useNavigate();


    useEffect(() => {

    }, [])

    const claimedUtilitiesTags = () => {
      return claim_data.claimed_utilities.map(text => {
        return <Tag key={text} isSelectable={false} text={text} />
      })
    }

    return (
      <Card 
        style={{
            padding: "20px",
            margin: "20px 0px",
            boxShadow: "0px 16px 16px rgba(50, 50, 71, 0.08), 0px 24px 32px rgba(50, 50, 71, 0.08)",
            borderRadius: "8px"
        }}> 

        <Typography>Claim status: {claim_data.status}</Typography>
        <Typography>Claimed utilities:</Typography>
        {claimedUtilitiesTags()}
                
      </Card>
    );
};

export default ShelterClaim;
