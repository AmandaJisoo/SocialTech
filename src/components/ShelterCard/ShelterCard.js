import React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography';
import appTheme from '../../theme/appTheme.json';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import { Grid } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import { truncateReview, DEFAULT_UNIT } from '../../utils/utilityFunctions'
import ReadOnlyTags from '../ReadOnlyTags/ReadOnlyTags';
import text from "../../text/text.json"

const public_url = process.env.PUBLIC_URL;

const WEBSITE_PLACEHOLDER = "https://www.google.com/"

const ShelterCard = ({ shelterData }) => {

    const navigate = useNavigate();

    const favoriteIcon = () => shelterData.isFavorite ? 
    <BookmarkIcon style={{color: appTheme.palette.primary.main }}/> :
    <BookmarkBorderOutlinedIcon/>

    const unit = DEFAULT_UNIT;

    return (
    <Card 
        onClick={() => {
            navigate("/app/shelter-detail/" + shelterData.id)
        }}
        style={{
            padding: "20px",
            margin: "20px",
            boxShadow: "0px 16px 16px rgba(50, 50, 71, 0.08), 0px 24px 32px rgba(50, 50, 71, 0.08)",
            borderRadius: "8px"
        }}
    >
        <Grid
            container
            direction="row" 
            justifyContent="space-between" 
            alignItems="center"
            spacing={1}>
            <Grid
                container
                direction="row" 
                justifyContent="center" 
                alignItems="center"
                xs={5}>
                <CardMedia
                    component="img"
                    image={public_url + shelterData.imgAddr}
                    alt="shelter_preview"
                    style={{ 
                        maxWidth: "25em"
                    }}/>
            </Grid>
            <Grid
                container
                direction="column" 
                justifyContent="center" 
                alignItems="flex-start"
                xs={6}>
                <Grid
                    container
                    direction="row" 
                    justifyContent="space-between" 
                    alignItems="center">
                    <Typography>{shelterData.name}</Typography>

                    <Typography>{shelterData.distanceToUserLocation + " " + unit}</Typography>
                </Grid>
                <Rating value={shelterData.starRating} readOnly precision={0.5} style={{color: appTheme.palette.primary.main }}/>
                <ReadOnlyTags tagData={shelterData.tags}/>
                <Typography>{truncateReview(shelterData.highlightedReview)}</Typography>
                <Grid
                    container
                    direction="row" 
                    justifyContent="space-between" 
                    alignItems="center">
                    {favoriteIcon()}    

                    <Button>
                        <a href={WEBSITE_PLACEHOLDER} style={{textDecoration: "none", color: appTheme.palette.primary.main}}>
                            {text.shelterCard.visitWebSiteButtonText}
                        </a>
                    </Button>
                </Grid>

            </Grid>
        </Grid>
    </Card>);
};

ShelterCard.propTypes = {
    id: PropTypes.number,
    name: PropTypes.string,
    starRating: PropTypes.number,
    tags: PropTypes.array,
    distanceToUserLocation: PropTypes.number,
    highlightedReview: PropTypes.string,
    imgAddr: PropTypes.string,
    isFavorite: PropTypes.bool
};

export default ShelterCard; 