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
import { truncateReview, DEFAULT_UNIT, MAX_SHELTER_CARD_IMAGE_DIMENSION_SHELTER_CARD } from '../../utils/utilityFunctions'
import TagContainer from '../SelectableTags/TagContainer';
import { React, useState, useRef, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import { Auth } from 'aws-amplify';
import ShelterClaimStatusText from '../ShelterClaimStatusText'

import { useStore } from '../../pages/Hook';

const public_url = process.env.PUBLIC_URL;

const WEBSITE_PLACEHOLDER = "https://www.google.com/"
const DISTANCE_PLACEHOLDER = 1.5 + "km"
const START_RATING_PLACEHOLDER = 3.5
const HIGHLIGHTED_REVIEW_PLACEHOLDER = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
const TAG_PLACEHOLDER = ["clean", "dirty", "horrible"]
const VERIFIYED_STATE_PLACEHOLDER = true;

const ShelterCard = ({ user, shelterData, isBookmarked }) => {
    const [open, setOpen] = useState(false)
    const [bookmarkState, setBookmarkState] = useState(isBookmarked);
    const buttonRef = useRef(null);
    const [isClaimed, setIsClaimed] = useState(undefined);
    const [highlightedComment, setHighlightedComment] = useState(undefined);
    const [userProfile, setUserProfile] = useState(undefined);


    //console.log("userProfile", userProfile)

    const { apiStore, appStore } = useStore(); 
    
    const loadBookmarks = async () => {
        try {
            let authRes = await Auth.currentAuthenticatedUser();
            let username = authRes.username;
            let bookmarksResponse = await apiStore.getSavedBookmarks(username);
            let res = bookmarksResponse.includes(shelterData.post_id)
            console.log("res", res)
            setBookmarkState(bookmarksResponse.includes(shelterData.post_id));
          } catch {
            //do pop up?
            setBookmarkState(false)
        }
    }
    
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

    const getClaimStatus = async() => {
        try {
            const claimStatus = await apiStore.getIsClaimed(shelterData.post_id);
            //console.log("claimStatus response: ", claimStatus)
            setIsClaimed(claimStatus)
        } catch (err) {
            console.log(err.message)
        }
    }

    const getHighLightedComment = async () => {
        try {
            const topComment = await apiStore.getMostLikedComment(shelterData.post_id);
            if (topComment.length > 0) {
                setHighlightedComment(topComment[0]);
                appStore.setHighlightedComment(topComment[0])
                let profile = await apiStore.getUserProfile(topComment[0].username)
                console.log('profile card', profile)
                setUserProfile(profile)
                appStore.setUserProfilePic(topComment[0].username, profile.profile_pic_path)
            } 
        } catch (err) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        getClaimStatus();
        getHighLightedComment();
        loadBookmarks();   
    }, [])

    const navigate = useNavigate();

    const favoriteIcon = () => bookmarkState? 
        <IconButton onClick={handleBookmark}>
            <BookmarkIcon style={{color: appTheme.palette.primary.main }}/>
        </IconButton> :
        (<>
        <IconButton onClick={handleBookmark} ref={buttonRef}>
            <BookmarkBorderOutlinedIcon/>
        </IconButton>
        <Popover open={open} onClose={() => setOpen(false)} anchorEl={buttonRef.current}>
            You are not logged in. Click here to log in.
        </Popover>
        </>)

    const verifiedText = () => {
        if (isClaimed === "no_claim") {
            return <Typography>unclaimed shelter</Typography>
        } else if (isClaimed === "pending") {
            return <div>shelter in process of claiming</div>
        } else {
            return <div>claimed shelter</div>
        }
    }
       
    const unit = DEFAULT_UNIT;
    //TODO: yichi fix the profile pic line 206 

    return (
        <Card 
            onClick={() => {
                console.log("shelterData for card", shelterData);
                appStore.setShelterData(shelterData);
            }}
            style={{
                padding: "5px 20px 5px 20px",
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
                onClick={() => {
                    navigate("/app/shelter-detail/" + shelterData.post_id)
                }}
                >
                <CardMedia
                    component="img"
                    image={public_url + shelterData.profile_pic_path}
                    alt="shelter_preview"
                    style={{ 
                        maxWidth: MAX_SHELTER_CARD_IMAGE_DIMENSION_SHELTER_CARD.width,
                        maxHeight: MAX_SHELTER_CARD_IMAGE_DIMENSION_SHELTER_CARD.height
                    }}/>
            </Grid>
            
            <Grid
                container
                direction="column" 
                justifyContent="space-around" 
                alignItems="flex-start"
                item
                xs={6}
                style={{minHeight: "300px"}}
                >
                <Grid
                    style={{width: "100%"}}
                    onClick={() => {
                        navigate("/app/shelter-detail/" + shelterData.post_id)
                    }}>
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        style={{width: "100%"}}>
                        <Typography>{shelterData.title}</Typography>
                        <Typography>{DISTANCE_PLACEHOLDER}</Typography>
                    </Grid>
                    <Rating value={shelterData.avg_rating} readOnly precision={0.5} style={{color: appTheme.palette.primary.main }}/>
                    <TagContainer tagData={TAG_PLACEHOLDER} isSelectable={false}/>

                    

                </Grid>


                    {(userProfile && highlightedComment) && (
                    <Grid item
                        container
                        direction="column"
                        justifyContent="center"
                        alignItems="flex-start"
                        onClick={() => {
                            navigate("/app/shelter-detail/" + shelterData.post_id)
                        }}>
                        <Grid
                            item
                            container
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="center">
                            <img
                                style={{width: 40, height: 40, borderRadius: 40/ 2}}
                                src={public_url + "/assets/imgs/user_profile_img_placeholder.jpeg"}
                                alt='user profile placeholder'
                                />
                            <Typography style={{marginLeft: "10px"}}>{userProfile.username}</Typography>
                        </Grid>

                        <Typography style={{marginTop: "10px"}}>{truncateReview(highlightedComment.comment_body)}</Typography>

                        <Divider style={{width: "100%", marginTop: "10px", marginBottom: "0px"}}/>
                    </Grid>
                    )}

                <Grid
                    container
                    direction="row" 
                    justifyContent="space-between" 
                    alignItems="center">

                    {favoriteIcon()}  
                    <ShelterClaimStatusText claim_status={isClaimed} />
                </Grid>

            </Grid>
        </Grid>
    </Card>)
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
