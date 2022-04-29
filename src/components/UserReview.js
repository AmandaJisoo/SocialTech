import { React, useContext, useState, useRef, useEffect, Image } from 'react';
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
import UserNotLoggedInPopOverContent from './UserNotLoggedInPopOverContent';
import ImageThumbNailWithLightBox from './ImageThumbNailWithLightBox';

const public_url = process.env.PUBLIC_URL;

const UserReview = ({ reviewData, isHighLighted }) => {
    const { apiStore, appStore } = useStore(); 
    const [open, setOpen] = useState(undefined)
    const buttonRef = useRef(null);
    const appCtx = useContext(AppContext);
    const [likeState, setLikeState] = useState(undefined);
    const [numOfLikes, setNumOfLikes] = useState(undefined);
    const [userProfile, setUserProfile] = useState(undefined);
    const navigate = useNavigate();

    const highlightedText = 
    (isHighLighted && reviewData && reviewData.likes > 0)?
        <Typography style={{color: appTheme.palette.accent1.main}}>Highlighted Review</Typography> :
        <span/>;

    const loadLike = async() => {
        try {
            let likeStatus = await apiStore.getLikeStatus(reviewData.username, reviewData.comment_id, reviewData.post_id)
            setLikeState(likeStatus.like_status)
            setNumOfLikes(likeStatus.num_of_likes)
        } catch {

        }
    }

    const handleLike = async () => {
        try {
            if (appCtx.user) {
                let likeResponse = await apiStore.handleLike(reviewData.comment_id, reviewData.post_id, reviewData.username)
                setLikeState(likeResponse.like)
                setNumOfLikes(likeResponse.num_of_likes)
                console.log("likeState after clicking", likeState)
            } else {
                setOpen(true)
            }
            } catch {
        }
    }

    const getUserPofile = async () => {
        try {
            if (reviewData.username in appStore.userProfilePic) {
                setUserProfile(appStore.userProfilePic[reviewData.username])
            } else {
                let profile = await apiStore.getUserProfile(reviewData.username)
                console.log("profile", profile)
                appStore.setUserProfilePic(reviewData.username, profile.profile_pic_path)
                console.log('profile', profile)
                setUserProfile(profile)
            }
            } catch {
        }
    }

    console.log("likeState", likeState);

    const likeIcon = () => likeState? 
        (<Grid container
        direction="col" 
        justifyContent="flex-start" 
        alignItems="center"
        spacing={1}>
            <Grid item xs={12}>
                <IconButton onClick={handleLike}>
                    <FavoriteIcon fontSize="large" style={{color: appTheme.palette.primary.main, width: "32px" }}/>
                    {numOfLikes}
                </IconButton>
            </Grid>
        </Grid>):
        (<><Grid container spacing={1}>
            <Grid item xs={12}>
                <IconButton onClick={handleLike} ref={buttonRef}>
                    <FavoriteBorderOutlinedIcon fontSize="large" style={{color: appTheme.palette.primary.main, width: "32px" }}/>
                        {numOfLikes}
                </IconButton>
            </Grid>
            </Grid>
            <Popover open={open} onClose={() => setOpen(false)} anchorEl={buttonRef.current}>
                <Grid style={{padding: "20px"}}>
                    <UserNotLoggedInPopOverContent/>
                </Grid>
            </Popover>
        </>)

        const imageThumbnailAndLightBox = reviewData.pics.map((data, index) => {
            return <ImageThumbNailWithLightBox index={index} imgs={reviewData.pics} />
        })

    useEffect(() => {
        loadLike();
        getUserPofile();
    }, [])

    console.log("reviewData", reviewData)
    return (
      <Card 
        style={{
            padding: "20px",
            margin: "20px 0px",
            boxShadow: "0px 16px 16px rgba(50, 50, 71, 0.08), 0px 24px 32px rgba(50, 50, 71, 0.08)",
            borderRadius: "8px"
        }}>
            <Grid
                container
                direction="col" 
                justifyContent="flex-start" 
                alignItems="center"
                spacing={1}>
                <Grid
                    item
                    container
                    direction="row" 
                    justifyContent="center" 
                    alignItems="center"
                    spacing={1}>
                    {userProfile&&
                        <Grid
                        item
                        container
                        direction="row" 
                        justifyContent="space-between" 
                        wrap="nowrap"
                        rowSpacing={1}
                        alignItems="center">

                            <Grid item
                                container
                                direction="col" 
                                alignItems="flex-start"
                                style={{width: "100%", display: "flex", justifyContent: "left"}}>
                            <img 
                            style={{width: 60, height: 60, borderRadius: 60/ 2}} 
                            src={public_url + "/assets/imgs/user_profile_img_placeholder.jpeg"}
                            alt='user profile placeholder'
                            />
                            </Grid>
                        </Grid>}
                        <Grid
                        item
                        container
                        direction="row" 
                        justifyContent="space-between" 
                        alignItems="center">
                            <Typography>{reviewData.username}</Typography>
                            {highlightedText}
                    </Grid>
                        <Grid container
                            direction="col" 
                            justifyContent="flex-start" 
                            alignItems="center"
                            spacing={1}>
                        <Grid item
                            xs={12}
                            container
                            direction="row" 
                            alignItems="flex-start"
                            style={{width: "100%", display: "flex", margin: "0px"}}>
                            {likeIcon()}  
                            </Grid>     
                        </Grid>
                    <Grid
                        item
                        container
                        direction="row" 
                        justifyContent="space-between" 
                        alignItems="center">
                        <Grid item
                            xs={12}
                            container
                            direction="row" >
                        <Rating value={reviewData.rating} readOnly precision={0.5} style={{color: appTheme.palette.primary.main }}/>
                        <div style={{marginTop: "-1px", marginLeft:"10px"}}>
                        <Typography style={{fontSize: "large"}}>{reviewData.post_time.split("T")[0]}</Typography>
                        </div>
                        </Grid>
                        <Grid item
                            xs={12}
                            container
                            direction="row" >
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        container
                        direction="row" 
                        justifyContent="flex-start" 
                        alignItems="center">
                        <TagContainer tagData={reviewData.tags} isSelectable={false}/>
                    </Grid>
                </Grid>

                <Grid
                    item
                    container
                    direction="row" 
                    justifyContent="space-between" 
                    wrap="nowrap"
                    alignItems="center">
                        <Grid item>
                            <Typography>{reviewData.comment_body}</Typography>
                        </Grid>
                    
                </Grid>

                <Grid 
                    item
                    container 
                    justifyContent='flex-start' >
                    {imageThumbnailAndLightBox}
                </Grid>
            </Grid>
      </Card>
    );
};

UserReview.propTypes = {
    userName: PropTypes.string,
    content: PropTypes.string,
    starRating: PropTypes.number,
    likes: PropTypes.number,
    date: PropTypes.string,
    isHighLighted: PropTypes.bool,
    tags: PropTypes.array,
};

export default UserReview;