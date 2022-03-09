import {React, useState} from 'react';
import PropTypes from 'prop-types';
import shelterInfo from '../mockData/shelterInfo'
import UserReview from '../components/UserReview';
import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ImageGallery from '../components/ImageGallery'
import Rating from '@mui/material/Rating';
import appTheme from '../theme/appTheme.json';
import ReadOnlyTags from '../components/ReadOnlyTags/ReadOnlyTags';
import Button from '@mui/material/Button';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import IosShareIcon from '@mui/icons-material/IosShare';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Modal from '@mui/material/Modal';
import text from "../text/text.json";
import { useNavigate } from 'react-router-dom'
import PostReviewForm from '../components/PostReviewForm/PostReviewForm';


const ShelterDetail = props => {

    const navigate = useNavigate();

    const shelterData = shelterInfo.shelters[0];
    const highlightedReview = <UserReview item reviewData={shelterInfo.reviews[0]}/>
    
    const reviews = shelterInfo.reviews.slice(1, shelterInfo.reviews.length).map((reviewData, idx) => {
        return <UserReview item reviewData={reviewData} key={idx}/>
    })

    const ADDRESS_PLACEHOLDER = "1234 NE ST Sweet Home Shelter"
    const WEBSITE_PLACEHOLDER = "https://www.google.com/"

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
                spacing={1}
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
                    <Typography variant="h4">{text.shelterDetail.pageHeader}</Typography>
                    <Grid>
                        <BookmarkBorderIcon/>
                        <IosShareIcon/>
                        <MoreHorizIcon/>
                    </Grid>
                </Grid>

                <ImageGallery item imgAddr={shelterData.imgAddr}/>
                <Grid
                    item
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center">
                        <Typography>{shelterData.name}</Typography>
                        <Typography>{shelterData.distanceToUserLocation + " km"}</Typography>
                </Grid>
                <Grid
                    item
                    container
                    direction="column"
                    alignItems="flex-start">
                    <Rating value={shelterData.starRating} readOnly precision={0.5} style={{color: appTheme.palette.primary.main }}/>
                    <ReadOnlyTags tagData={shelterData.tags}/>
                </Grid>
                <Grid
                    item
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center">
                        <Typography>{ADDRESS_PLACEHOLDER}</Typography>
                        <Button variant="contained" onClick={handleGetDirection}>{text.shelterDetail.directToHereButtonText}</Button>
                </Grid>
                <Divider item style={{width: "100%", marginTop: "20px", marginBottom: "20px"}}/>
            
                {highlightedReview}
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
                                shelterName: shelterData.name,
                                userName: "Yichi-temp"}}
                            handleClose={handleClose}
                        />
                    </Modal>
            
                </Grid>
                <Divider item style={{width: "100%", marginTop: "20px", marginBottom: "20px"}}/>
                <Grid
                    item
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center">
                    <Typography>{text.shelterDetail.otherReviewSectionHeader}</Typography>
                </Grid>
                {reviews}
            </Grid>
        </Grid>
    );
};

ShelterDetail.propTypes = {
    shelterName: PropTypes.string,
    reviews: PropTypes.array
};

export default ShelterDetail;