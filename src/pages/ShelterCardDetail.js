import {React, useContext, useState, useEffect, useRef} from 'react';
import { observer } from "mobx-react";
import PropTypes from 'prop-types';
import UserReview from '../components/UserReview';
import { Card, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ImageGallery from '../components/ImageGallery'
import Rating from '@mui/material/Rating';
import appTheme from '../theme/appTheme.json';
import Button from '@mui/material/Button';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import IosShareIcon from '@mui/icons-material/IosShare';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CircularProgress from '@mui/material/CircularProgress'
import Modal from '@mui/material/Modal';
import text from "../text/text.json";
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Auth } from 'aws-amplify';
import PostReviewForm from '../components/PostReviewForm/PostReviewForm';
import TagContainer from '../components/SelectableTags/TagContainer';
import AppContext from '../AppContext';
import { useStore } from './Hook';
import { formatShelterAddress } from '../utils/utilityFunctions';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import ShelterClaimStatusText from '../components/ShelterClaimStatusText'

const WEBSITE_PLACEHOLDER = "https://www.google.com/"
const DISTANCE_PLACEHOLDER = 1.5 + "km"
const VERIFIYED_STATE_PLACEHOLDER = true;

const ShelterDetail = observer(({ shelterData }) => {

    console.log("shelterdetail sheter data", shelterData);
    const params = useParams();
    const { hash } = useLocation();
    const post_id = `${params.id}${hash}`;
    const { apiStore, appStore } = useStore();
    const currentShelterData = appStore.shelterData;
    console.log("currentShelterData", currentShelterData)
    const [reviews, setReviews] = useState(undefined);
    const [highlightedComment, setHighlightedComment] = useState(undefined);
    const shelterPostData = appStore.shelterData;
    const navigate = useNavigate();
    const appCtx = useContext(AppContext);
    console.log('highlightedComment', highlightedComment)
    const [isClaimed, setIsClaimed] = useState(undefined);
    const [loaderActive, setLoaderActive] = useState(true);
    const [isReviewSubmitted, setIsReviewSubmitted] = useState(false)
    const [bookmarkState, setBookmarkState] = useState(undefined);
    const [open, setOpen] = useState(false)
    const buttonRef = useRef(null);
    console.log("bookmarkState", bookmarkState)

    const getReviewsData = async () => {
        try {
            const reviewsDataResponse = await apiStore.loadComment(post_id);
            console.log("review response: ", reviewsDataResponse)
            setReviews(reviewsDataResponse)
        } catch (err) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        if (appStore.highlightedComment) {
            console.log("appStore.highlightedComment", appStore.highlightedComment.comment_id)

        }
        const getShelterPostData = async () => {
            try {
                console.log("post_id before load summary: " + post_id)
                const shelterPostDataResponse = await apiStore.loadSummary(post_id);
                appStore.setShelterData(shelterPostDataResponse);

                console.log("shelter data response: ", shelterPostDataResponse)

                if (appStore.highlightedComment) {
                    setHighlightedComment(appStore.highlightedComment);
                    console.log("using saved comment data");
                } else {
                    const topComment = await apiStore.getMostLikedComment(post_id);
                    if (topComment.length > 0) {
                        setHighlightedComment(topComment[0]);
                        console.log("loading new comment data");
                    }
                }
            } catch (err) {
                console.log(err.message)
            }
        }

        const loadBookmarks = async () => {
            try {
                let authRes = await Auth.currentAuthenticatedUser();
                let username = authRes.username;
                console.log("username for bookmarks", username);
                let bookmarksResponse = await apiStore.getSavedBookmarks(username);
                console.log("bookmarksResponse amanda", bookmarksResponse)
                let res = bookmarksResponse.includes(post_id)
                console.log("res", res)
                setBookmarkState(bookmarksResponse.includes(post_id));
                setLoaderActive(false);
              } catch {
                setBookmarkState(false)
            }
        }

        const getClaimStatus = async() => {
            try {
                const claimStatus = await apiStore.getIsClaimed(post_id);
                console.log("claimStatus response: ", claimStatus)
                setIsClaimed(claimStatus)
            } catch (err) {
                console.log(err.message)
            }
        }
        getShelterPostData();
        getReviewsData();
        getClaimStatus();
        loadBookmarks();
    }, [])

    const handleBookmark = async () => {
        try {
            if (appCtx.user) {
                let bookmarkStatus = await apiStore.handleBookmark(post_id ,appCtx.user)
                setBookmarkState(bookmarkStatus.message)

            } else {
                setOpen(true)
            }
          } catch {
        }
    }

    const highlightedReview = () => {
        if (reviews === undefined) {
            return (
                <Grid   
                container
                direction="column"
                justifyContent="center" 
                alignItems="center"
                style={{height: "15vh"}}>
                    <CircularProgress/>
                    <Typography>Loading reviews</Typography>
                </Grid>
            )
        } else if (reviews.length === 0) {
            return null
        } else {
            if (highlightedComment) {
                return <UserReview reviewData={highlightedComment} isHighLighted={true}/>
            }
        }
    }
    
    const reviewEles = () => {
        if (reviews === undefined) {
            return (
                <Grid   
                container
                direction="column"
                justifyContent="center" 
                alignItems="center"
                style={{height: "15vh"}}>
                    <CircularProgress/>
                    <Typography>Loading reviews</Typography>
                </Grid>
            )
        } else if (reviews.length === 0) {
            return (
                <Grid   
                container
                direction="column"
                justifyContent="center" 
                alignItems="center"
                style={{height: "15vh"}}>
                    <Typography>No reviews for this shelter yet</Typography>
                </Grid>
            )
        } else {
            return reviews.slice(0, reviews.length).map((reviewData, idx) => {
                if (highlightedComment && reviewData && (reviewData.comment_id != highlightedComment.comment_id)) {
                    return <UserReview item reviewData={reviewData} isHighLighted={false} key={idx}/>
                }
            })
        }
    }

    const [openPostReviewForm, setOpenPostReviewForm] = useState(false);

    const handleOpen = () => {
        if (appCtx.user !==null) {
            setOpenPostReviewForm(true);
        } else {
            navigate("/app/auth/sign-in")
        }
    }
    const handleClose = () => {
        //TODO: Amanda
        setOpenPostReviewForm(false);
        setIsReviewSubmitted(true);
        getReviewsData()
    }

    const handleGetDirection = (e) => {
          e.preventDefault();
          let url = "http://maps.google.com/?q=";
          let endAddress = "77 Massachusetts Ave, Cambridge, MA 02139";
          endAddress = endAddress.replace(/\s/g, "+")
          console.log(endAddress);
          url = url + endAddress
          console.log(url);
          window.location.href=url;
    }

    const favoriteIcon = () => bookmarkState? 
        <IconButton onClick={handleBookmark} >
            <BookmarkIcon sx={{ fontSize: 50 }} style={{color: appTheme.palette.primary.main, marginLeft: "0px"}}/>
        </IconButton> :
        (<>
        <IconButton onClick={handleBookmark} ref={buttonRef}>
            <BookmarkBorderOutlinedIcon sx={{ fontSize: 50}}/>
        </IconButton>
        <Popover open={open} onClose={() => setOpen(false)} anchorEl={buttonRef.current}>
            You are not logged in. Click here to log in.
        </Popover>
        </>)

    return (
        <Grid 
            container
            direction="column"
            justifyContent="flex-start"
            alignItems="center"
            style={{height: "100vh"}}
            >
            <Grid
                container
                direction="column"
                justifyContent="flex-start"
                alignItems="center"
                wrap="nowrap"
                rowSpacing={2}
                style={{maxWidth: "50em", padding: "20px"}}>
            {shelterPostData && 
                <Grid
                    item
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    style={{margin: "80px 0 30px 0"}}
                    spacing={1}
                    >
                    <Button 
                    onClick={() => {
                        navigate("/app/dashboard")
                    }}>
                        {text.shelterDetail.backButton
                    }</Button>
                    <Typography variant="h4"style={{marginRight: "40px" }}>{shelterPostData.title}</Typography>
                        {bookmarkState !== undefined && favoriteIcon()}  
                        {/* Disable share icon for now. May come back and implement it */}
                        {/* <IosShareIcon/> */}
                </Grid>
                }
                {shelterPostData === undefined ? 
                <Grid   
                    container
                    direction="column"
                    justifyContent="center" 
                    alignItems="center"
                    style={{height: "25vh"}}>
                    <CircularProgress/>
                    <Typography>Loading Shelter Data</Typography>
                </Grid> :
                <>
                    <ImageGallery imgAddr={shelterPostData.profile_pic_path}/>
                    <Grid
                        item
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center">
                        <Grid 
                            item
                            container
                            direction="row">
                            <Typography>{shelterPostData.title}</Typography>
                        </Grid>
                        <Grid 
                            item
                            container
                            direction="row">
                        <Typography>{DISTANCE_PLACEHOLDER}</Typography>
                        </Grid>
                        <Grid 
                            item
                            container
                            direction="row">
                        <ShelterClaimStatusText claim_status={isClaimed}/>
                        </Grid>
                    </Grid>

                    <Grid
                        item
                        container
                        direction="column"
                        alignItems="flex-start">
                        <Rating value={shelterPostData.avg_rating} readOnly precision={0.5} style={{color: appTheme.palette.primary.main }}/>

                        <TagContainer tagData={shelterPostData.utilities} isSelectable={false}/>
                    </Grid>
                    
                    <Grid
                        item
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        rowSpacing={2}>
                        <Grid
                            item
                            container
                            direction="column"
                            justifyContent="space-between"
                            alignItems="flex-start">
                            <Typography  style={{fontWeight: "bold"}}>{shelterPostData.street.toUpperCase()}</Typography>
                            <Typography style={{fontWeight: "bold"}}>{shelterPostData.city.toUpperCase() + ", " + shelterPostData.zipcode.toUpperCase() + " , " + shelterPostData.state.toUpperCase()}</Typography>
                        </Grid>

                        <Grid item>
                            <Button variant="contained" onClick={handleGetDirection}>{text.shelterDetail.directToHereButtonText}</Button>
                        </Grid>
                    </Grid>
                </>}                
                {shelterPostData !== undefined && 
                <Grid
                    item
                    container
                    direction="row"
                    justifyContent="space-around"
                    alignItems="center">
                    <Button variant="outlined">
                        <a href={WEBSITE_PLACEHOLDER} style={{textDecoration: "none", color: appTheme.palette.primary.main}}>
                            {text.shelterDetail.visitWebSiteButtonText}
                        </a>
                    </Button>
                </Grid>}
        {shelterPostData !== undefined && 
            <Grid
                container
                direction="column" 
                justifyContent="flex-start" 
                alignItems="center"
                spacing={1}>
                    <PostReviewForm
                        formData={{
                            shelterName: shelterPostData.title,
                            userName: appCtx.user}}
                        post_id={post_id}
                        handleClose={handleClose}
                    />
                    </Grid>
        }

            <Divider style={{width: "100%", marginTop: "20px", marginBottom: "20px"}}/>
            <Grid style={{width: "100%"}}>{highlightedReview()}</Grid>
                


                <Divider style={{width: "100%", marginTop: "20px", marginBottom: "20px"}}/>
                <Grid
                    item
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center">
                    <Typography>{text.shelterDetail.otherReviewSectionHeader}</Typography>
                </Grid>
                <Grid style={{width: "100%"}}>{reviewEles()}</Grid>
            </Grid>
        </Grid>
    );
});

ShelterDetail.propTypes = {
    data: PropTypes.array,
};

export default ShelterDetail;
