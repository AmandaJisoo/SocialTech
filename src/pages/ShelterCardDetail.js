import {React, useContext, useState, useEffect} from 'react';
import { observer } from "mobx-react";
import PropTypes from 'prop-types';
import UserReview from '../components/UserReview';
import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ImageGallery from '../components/ImageGallery'
import Rating from '@mui/material/Rating';
import appTheme from '../theme/appTheme.json';
import Button from '@mui/material/Button';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import IosShareIcon from '@mui/icons-material/IosShare';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CircularProgress from '@mui/material/CircularProgress'
import Modal from '@mui/material/Modal';
import text from "../text/text.json";
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import PostReviewForm from '../components/PostReviewForm/PostReviewForm';
import TagContainer from '../components/SelectableTags/TagContainer';
import AppContext from '../AppContext';
import { useStore } from './Hook';
import { getHighLightedReivew } from '../utils/utilityFunctions';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';

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
    useEffect(() => {
        const getShelterPostData = async () => {
            try {
                const shelterPostDataResponse = await apiStore.loadSummary(post_id);
                console.log("shelter data response: ", shelterPostDataResponse)
                const topComment = await apiStore.getMostLikedComment(post_id);
                appStore.setShelterData(shelterPostDataResponse);
                console.log('topComment', topComment)
                if (topComment.length > 0) {
                    setHighlightedComment(topComment[0]);
                }
            } catch (err) {
                console.log(err.message)
            }
        }

        const getReviewsData = async () => {
            try {
                const reviewsDataResponse = await apiStore.loadComment(post_id);
                console.log("review response: ", reviewsDataResponse)
                setReviews(reviewsDataResponse)
            } catch (err) {
                console.log(err.message)
            }
        }

        getShelterPostData()
        getReviewsData()

    }, [])

    const verifiedIcon = () => VERIFIYED_STATE_PLACEHOLDER ? 
        <VerifiedUserIcon style={{color: appTheme.palette.primary.main}}/> :
        <VerifiedUserOutlinedIcon/>
    
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
                if (highlightedComment && (reviewData.comment_id != highlightedComment.comment_id)) {
                    return <UserReview item reviewData={reviewData} isHighLighted={false} key={idx}/>
                }
            })
        }xs
    }

    const [openPostReviewForm, setOpenPostReviewForm] = useState(false);

    const handleOpen = () => {
        if (appCtx.user != null) {
            setOpenPostReviewForm(true);
        } else {
            navigate("/app/auth/sign-in")
        }
    }
    const handleClose = () => {
        setOpenPostReviewForm(false);
    }

    const handleGetDirection = () => {
        // prompt to Google map, passing current location andtarget location
    }

    return (
        
        <Grid container
            direction="column"
            justifyContent="flex-start"
            alignItems="center"
            style={{height: "100vh"}}>
            <Grid
                container
                direction="column"
                justifyContent="center"
                alignItems="center"
                wrap="nowrap"
                rowSpacing={2}
                style={{maxWidth: "50em", padding: "20px"}}>

                <Grid
                    item
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    style={{margin: "30px 0 30px 0"}}>
                    <Button onClick={() => {
                        navigate("/app/dashboard")
                    }}>
                        {text.shelterDetail.backButton
                    }</Button>
                    <Typography variant="h4" style={{marginLeft: "-40px"}}>{text.shelterDetail.pageHeader}</Typography>
                    <Grid>
                        <BookmarkBorderIcon/>
                        <IosShareIcon/>
                        <MoreHorizIcon/>
                    </Grid>
                </Grid>

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
                                {verifiedIcon()}
                            </Grid>
                            <Typography>{DISTANCE_PLACEHOLDER}</Typography>
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
                                <Typography>{shelterPostData.street}</Typography>
                                <Typography>{shelterPostData.city + ", " + shelterPostData.zipcode + " , " + shelterPostData.state}</Typography>
                            </Grid>


                            <Grid item>
                                <Button variant="contained" onClick={handleGetDirection}>{text.shelterDetail.directToHereButtonText}</Button>
                            </Grid>
                    </Grid>
                </>}

                <Divider style={{width: "100%", marginTop: "20px", marginBottom: "20px"}}/>
            
                <Grid style={{width: "100%"}}>{highlightedReview()}</Grid>
                
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
                    <Button
                        variant="contained"
                        onClick={handleOpen}
                    >
                        {text.shelterDetail.writeReviewButton}
                    </Button>
                    <Modal
                        open={openPostReviewForm}
                        onClose={handleClose}
                        aria-labelledby="post-review-form"
                        aria-describedby="post-review-form"
                    >
                        <PostReviewForm
                            formData={{
                                shelterName: shelterPostData.title,
                                userName: appCtx.user}}
                            post_id={post_id}
                            handleClose={handleClose}
                        />
                    </Modal>
                </Grid>}
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
