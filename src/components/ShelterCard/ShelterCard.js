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
import text from "../../text/text.json"
import TagContainer from '../SelectableTags/TagContainer';
import { React, useState, useEffect, useRef } from 'react';
import IconButton from '@mui/material/IconButton';
import { Auth } from 'aws-amplify';
import Popover from '@mui/material/Popover';

import { useStore } from '../../pages/Hook';
import Alert from '@mui/material/Alert';

const public_url = process.env.PUBLIC_URL;

const WEBSITE_PLACEHOLDER = "https://www.google.com/"
const DISTANCE_PLACEHOLDER = 1.5 + "km"
const START_RATING_PLACEHOLDER = 3.5
const HIGHLIGHTED_REVIEW_PLACEHOLDER = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
const TAG_PLACEHOLDER = ["clean", "dirty", "horrible"]


const ShelterCard = ({ user, shelterData, isBookmarked }) => {
    const [alert, setAlert] = useState(false)
    const [open, setOpen] = useState(false)
    const [bookmarkState, setBookmarkState] = useState(isBookmarked);
    // const [anchorEl, setAnchorEl] = useState(null);
    const buttonRef = useRef(null);
    // const [isIconStatusUpdated, setIconStatus] = useState(false)
    const apiStore = useStore(); 

    const handleBookmark = async () => {
        try {
            if (user) {
                let bookmarkStatus = await apiStore.handleBookmark(shelterData.post_id ,user)
                setBookmarkState(bookmarkStatus.message)

            } else {
                setOpen(true)
            }
          } catch {
        }
    }

    const navigate = useNavigate();
    const favoriteIcon = () => bookmarkState? 
    <IconButton onClick={handleBookmark}>
    <BookmarkIcon style={{color: appTheme.palette.primary.main }}/>
    </IconButton> :
    (<>
    <IconButton onClick={handleBookmark} ref={buttonRef}>
        <BookmarkBorderOutlinedIcon/>
    </IconButton>
    {/* <button onClick={handleBookmark} ref={buttonRef}>
        does this shit work
    </button> */}
    <Popover open={open} onClose={() => setOpen(false)} anchorEl={buttonRef.current}>
        You are not logged in. Click here to log in.
    </Popover>
    </>)
    

    const unit = DEFAULT_UNIT;

    return (
    <Card 
        //TODO: fix it 
        // onClick={() => {
        //     // TODO: change "shelterData.title" to ".id" once we have the id field.
        //     navigate("/app/shelter-detail/" + shelterData.title)
        // }}
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
                item
                xs={5}
                >
                <CardMedia
                    component="img"
                    image={public_url + shelterData.profile_pic_path}
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
                item
                xs={6}>
                <Grid
                    container
                    direction="row" 
                    justifyContent="space-between" 
                    alignItems="center">
                    <Typography>{shelterData.title}</Typography>

                    <Typography>{DISTANCE_PLACEHOLDER}</Typography>
                </Grid>
                <Rating value={START_RATING_PLACEHOLDER} readOnly precision={0.5} style={{color: appTheme.palette.primary.main }}/>
                <TagContainer tagData={TAG_PLACEHOLDER} isSelectable={false}/>
                <Typography>{truncateReview(HIGHLIGHTED_REVIEW_PLACEHOLDER)}</Typography>
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