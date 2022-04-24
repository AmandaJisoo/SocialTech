import {React, useContext, useState, useEffect} from 'react';
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
import { useNavigate, useParams } from 'react-router-dom'
import PostReviewForm from '../components/PostReviewForm/PostReviewForm';
import TagContainer from '../components/SelectableTags/TagContainer';
import AppContext from '../AppContext';
import { useStore } from './Hook';
import { getHighLightedReivew } from '../utils/utilityFunctions';

const WEBSITE_PLACEHOLDER = "https://www.google.com/"
const DISTANCE_PLACEHOLDER = 1.5 + "km"

const ShelterDetail = ({ shelterData }) => {
    
    const [reviews, setReviews] = useState(undefined);
    const [shelterPostData, setShelterPostData] = useState(undefined);
    const apiStore = useStore();
    const navigate = useNavigate();
    const params = useParams();
    const appCtx = useContext(AppContext);

    useEffect(() => {
        const getShelterPostData = async () => {
            try {
                const shelterPostDataResponse = await apiStore.loadSummary(params.id);
                console.log("shelter data response: ", shelterPostDataResponse)
                //setShelterPostData(shelterPostDataResponse)
            } catch (err) {
                console.log(err.message)
            }
        }

        const getReviewsData = async () => {
            try {
                console.log("shleter id: ", params.id)
                const reviewsDataResponse = await apiStore.loadComment(params.id);
                console.log("review response: ", reviewsDataResponse)
                setReviews(reviewsDataResponse)
            } catch (err) {
                console.log(err.message)
            }
        }

        getShelterPostData()
        getReviewsData()

    }, [shelterPostData, apiStore, params.id])
    
    const highlightedReview = () => {
        if (reviews === undefined) {
            return (
                <Grid   
                container
                direction="column"
                justifyContent="center" 
                alignItems="center"
                style={{height: "40vh"}}>
                    <CircularProgress/>
                    <Typography>Loading reviews</Typography>
                </Grid>
            )
        } else if (reviews.length === 0) {
            return null
        } else {
            return <UserReview reviewData={getHighLightedReivew(reviews)} isHighLighted={true}/>
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
                style={{height: "40vh"}}>
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
                style={{height: "40vh"}}>
                    <Typography>No reviews for this shelter yet</Typography>
                </Grid>
            )
        } else {
            return reviews.slice(1, reviews.length).map((reviewData, idx) => {
                return <UserReview item reviewData={reviewData} isHighLighted={false} key={idx}/>
            })
        }
    }

    const [openPostReviewForm, setOpenPostReviewForm] = useState(false);

    const handleOpen = () => {
        setOpenPostReviewForm(true);
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
                    style={{height: "10vh"}}>
                    <CircularProgress/>
                    <Typography>Loading Shelter Data</Typography>
                </Grid> :
                <>
                    <ImageGallery imgAddr={shelterData.imgAddr}/>
                    <Grid
                        item
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center">
                            <Typography>{shelterData.title}</Typography>
                            <Typography>{DISTANCE_PLACEHOLDER}</Typography>
                    </Grid>
                    <Grid
                        item
                        container
                        direction="column"
                        alignItems="flex-start">
                        <Rating value={shelterData.avg_rating} readOnly precision={0.5} style={{color: appTheme.palette.primary.main }}/>

                        <TagContainer tagData={shelterData.tags} isSelectable={false}/>
                    </Grid>
                    <Grid
                        item
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center">
                            <Grid
                                container
                                direction="column"
                                justifyContent="space-between"
                                alignItems="center">
                                <Typography>{shelterData.street}</Typography>
                                <Typography>{shelterData.city + ", " + shelterData.zipcode + " , " + shelterData.state}</Typography>
                            </Grid>
                            <Button variant="contained" onClick={handleGetDirection}>{text.shelterDetail.directToHereButtonText}</Button>
                    </Grid>
                </>}
                

                <Divider style={{width: "100%", marginTop: "20px", marginBottom: "20px"}}/>
            
                {highlightedReview()}
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
                                shelterName: shelterData.title,
                                userName: appCtx.user}}
                            handleClose={handleClose}
                        />
                    </Modal>
            
                </Grid>
                <Divider style={{width: "100%", marginTop: "20px", marginBottom: "20px"}}/>
                <Grid
                    item
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center">
                    <Typography>{text.shelterDetail.otherReviewSectionHeader}</Typography>
                </Grid>
                {reviewEles()}
            </Grid>
        </Grid>
    );
};

ShelterDetail.propTypes = {
    data: PropTypes.array,
};

export default ShelterDetail;
