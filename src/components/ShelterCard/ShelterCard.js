
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { useNavigate } from 'react-router-dom'
import Typography from '@mui/material/Typography';
import appTheme from '../../theme/appTheme.json';
import Rating from '@mui/material/Rating';
import { Grid, Button } from '@mui/material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import { 
    truncateComment, 
    SHELTER_CARD_DISPLAY_STATUS, 
    MAX_SHELTER_CARD_IMAGE_DIMENSION_SHELTER_CARD,
    MAX_SHELTER_CARD_IMAGE_DIMENSION_SHELTER_CARD_MOBILE, 
    MAX_NUMBER_OF_TAGS_IN_SHELTER_CARD} from '../../utils/utilityFunctions'
import TagContainer from '../SelectableTags/TagContainer';
import { React, useState, useRef, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import { Auth } from 'aws-amplify';
import ShelterClaimStatusText from '../ShelterClaimStatusText'
import { useStore } from '../../pages/Hook';
import UserNotLoggedInPopOverContent from '../UserNotLoggedInPopOverContent';
import { observer } from 'mobx-react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HelpIcon from '@mui/icons-material/Help';
import PendingIcon from '@mui/icons-material/Pending';
import InfoIcon from '@mui/icons-material/Info';

const ShelterCard = observer(({
    user,
    shelterData,
    isBookmarked,
    displayStatus = SHELTER_CARD_DISPLAY_STATUS.regular }) => {

    const [open, setOpen] = useState(false)
    const [bookmarkState, setBookmarkState] = useState(isBookmarked);
    const buttonRef = useRef(null);
    const [claimStatus, setClaimeStatus] = useState(undefined);
    const [highlightedComment, setHighlightedComment] = useState(undefined);
    const [userProfile, setUserProfile] = useState(undefined);
    const [shelterStatus, setShelterStatus] = useState(undefined)
    const { apiStore, appStore } = useStore();


    const loadBookmarks = async () => {
        try {
            let authRes = await Auth.currentAuthenticatedUser();
            let username = authRes.username;
            let bookmarksResponse = await apiStore.getSavedBookmarks(username);
            let res = bookmarksResponse.includes(shelterData.post_id)
            console.log("res", res)
            let shelterClaimRes = await apiStore.getIsClaimed(shelterData.post_id)
            console.log("shelterClaimRes", shelterClaimRes)
            setShelterStatus(shelterClaimRes)
            setBookmarkState(bookmarksResponse.includes(shelterData.post_id));
        } catch {
            //do pop up?
            setBookmarkState(false)
        }
    }

    const handleBookmark = async () => {
        try {
            if (user) {
                let bookmarkStatus = await apiStore.handleBookmark(shelterData.post_id, user)
                setBookmarkState(bookmarkStatus.message)

            } else {
                setOpen(true)
            }
        } catch {
        }
    }

    const getHighLightedComment = async () => {
        try {
            const topComment = await apiStore.getMostLikedComment(shelterData.post_id);
            if (topComment.length > 0) {
                setHighlightedComment(topComment[0]);
                appStore.setHighlightedComment(shelterData.post_id, topComment[0])
                let profile = await apiStore.getUserProfile(topComment[0].username)
                //console.log('profile card', profile)
                setUserProfile(profile)
                appStore.setUserProfilePic(topComment[0].username, profile.profile_pic_path)
            }
        } catch (err) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        getHighLightedComment();
        loadBookmarks();
    }, [])

    const navigate = useNavigate();

    const claimStatusWithIcon = () => {
        let res = <></>;
        if (shelterStatus == "claimed") {
            res = <div>
                <IconButton aria-label="business claim status">
                    <CheckCircleIcon style={{ color: '#48AAAD' }} />
                    <Typography style={{ marginRight: "20px", color: '#48AAAD' }}>Claimed Amenties</Typography>
                </IconButton>

                <Grid sx={{display: {xs: "block", sm: "block", md: "none"}}} >
                    <TagContainer
                        tagData={shelterData.utilities}
                        isSelectable={false}
                        isMobileDisplay={true}/>
                </Grid>
                <Grid sx={{display: {xs: "none", sm: "none", md: "block"}}}>
                    <TagContainer
                        tagData={shelterData.utilities}
                        isSelectable={false}
                        isMobileDisplay={false}/>
                </Grid>

            </div>
        } else if (shelterStatus == "pending") {
            res =
            <Grid container direction="row" alignItems="center">
            <Grid item>
                <IconButton aria-label="business claim status">
                    <PendingIcon style={{ color: '#48AAAD' }} />
                </IconButton>
            </Grid>
            <Grid item>
                <Typography style={{ fontSize: "17px", color: '#48AAAD' }}>
                    Pending 
                </Typography>
            </Grid>
        </Grid>
        } else if (shelterStatus == "no_claim") {
            res = <Grid container direction="row" alignItems="center">
                <Grid item>
                    <IconButton aria-label="business claim status">
                        <InfoIcon style={{ color: '#48AAAD' }} />
                    </IconButton>
                </Grid>
                <Grid item>
                    <Typography style={{ fontSize: "17px", color: '#48AAAD' }}>
                        Unclaimed
                    </Typography>
                </Grid>
            </Grid>
        }
        return res;
    }

    const favoriteIcon = () => bookmarkState ?
        <IconButton onClick={handleBookmark}>
            <BookmarkIcon sx={{ fontSize: 38 }} style={{ color: appTheme.palette.primary.main, marginTop: "-5px" }} />
        </IconButton> :
        (<>
            <IconButton onClick={handleBookmark} ref={buttonRef}>
                <BookmarkBorderOutlinedIcon sx={{ fontSize: 38, marginTop: "-5px" }} />
            </IconButton>
            <Popover open={open} onClose={() => setOpen(false)} anchorEl={buttonRef.current}>
                <UserNotLoggedInPopOverContent />
            </Popover>
        </>)

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
                borderRadius: "8px",

            }}
        >
            <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                spacing={1}
                sx={{flexDirection: {xs: 'column',sm: "column", md: "row"}}}>
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    item
                    sm={12}
                    md={5}
                    onClick={() => {
                        navigate("/app/shelter-detail/" + shelterData.post_id)
                    }}
                >
                    <CardMedia
                        component="img"
                        image={shelterData.profile_pic_path}
                        alt="shelter_preview"
                        style={{
                            maxWidth: MAX_SHELTER_CARD_IMAGE_DIMENSION_SHELTER_CARD.width,
                            maxHeight: MAX_SHELTER_CARD_IMAGE_DIMENSION_SHELTER_CARD.height,
                            borderRadius: MAX_SHELTER_CARD_IMAGE_DIMENSION_SHELTER_CARD.radius,
                        }} 
                        sx={{display: {xs: 'none',sm: "none", md: "block"}}}/>


                    <CardMedia
                        component="img"
                        image={shelterData.profile_pic_path}
                        alt="shelter_preview"
                        style={{
                            maxWidth: MAX_SHELTER_CARD_IMAGE_DIMENSION_SHELTER_CARD_MOBILE.width,
                            maxHeight: MAX_SHELTER_CARD_IMAGE_DIMENSION_SHELTER_CARD_MOBILE.height,
                            borderRadius: MAX_SHELTER_CARD_IMAGE_DIMENSION_SHELTER_CARD_MOBILE.radius
                        }} 
                        sx={{display: {xs: 'flex',sm: "flex", md: "none"}}}/>
                </Grid>

                

                <Grid
                    container
                    direction="column"
                    justifyContent="space-around"
                    alignItems="flex-start"
                    item
                    sm={12}
                    md={6}
                    style={{ minHeight: "300px" }}
                >
                    <Grid
                        style={{ width: "100%" }}
                        onClick={() => {
                            navigate("/app/shelter-detail/" + shelterData.post_id)
                        }}>
                        <Grid
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            style={{ width: "100%" }}>
                            <Typography style={{ fontWeight: "bold", marginTop: "10px" }}>{shelterData.title}</Typography>
                            <Typography>{`${shelterData.distanceToUserLocation} away`}</Typography>
                        </Grid>
                        <Rating value={shelterData.avg_rating} readOnly precision={0.5} style={{ color: appTheme.palette.primary.main }} />
                        {claimStatusWithIcon()}
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
                                    style={{ width: 40, height: 40, borderRadius: 40 / 2, borderWidth: 1, borderColor: "black", borderStyle: "solid" }}
                                    src={appStore.userProfilePic[userProfile.username]}
                                    alt='user profile placeholder'
                                />
                                <Typography style={{ marginLeft: "10px" }}>{userProfile.username}</Typography>
                            </Grid>

                            <Typography style={{ marginTop: "10px" }}>{truncateComment(highlightedComment.comment_body)}</Typography>

                            <Divider style={{ width: "100%", marginTop: "10px", marginBottom: "0px" }} />
                        </Grid>
                    )}

                    <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center">
                        {favoriteIcon()}
                    </Grid>

                </Grid>
            </Grid>
        </Card>)
});


export default ShelterCard; 

const ShelterCardMobile = () => {



    

}