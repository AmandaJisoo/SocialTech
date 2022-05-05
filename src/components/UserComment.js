import { React, useContext, useState, useRef, useEffect } from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Grid, Button } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import appTheme from '../theme/appTheme.json';
import Rating from '@mui/material/Rating';
import TagContainer from './SelectableTags/TagContainer';
import AppContext from '../AppContext';
import { useStore } from '../pages/Hook';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import Popover from '@mui/material/Popover';
import { useNavigate } from 'react-router-dom';
import UserNotLoggedInPopOverContent from './UserNotLoggedInPopOverContent';
import ImageThumbNailWithLightBox from './ImageThumbNailWithLightBox';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PostCommentForm from './PostCommentForm/PostCommentForm';
import { observer } from 'mobx-react';


const public_url = process.env.PUBLIC_URL;

const UserComment = observer(({shelterName, shelter_post_id, reloadData = undefined, commentData, onLike = undefined, isHighLighted, isEditAndDeleteable, setCommentData}) => {

    const { apiStore, appStore } = useStore(); 
    console.log("commentData0", commentData)
    console.log("osEdit", isEditAndDeleteable)
    console.log("name", commentData.username == appStore.username)
    console.log("shelterName", shelterName)
    console.log("UserCommentshelter_post_id", shelter_post_id)
    const [open, setOpen] = useState(false)
    const favoritebBttonRef = useRef(null);
    const appCtx = useContext(AppContext);
    const [likeState, setLikeState] = useState(undefined);
    const [numOfLikes, setNumOfLikes] = useState(commentData.likes);
    const [userProfile, setUserProfile] = useState(undefined);
    const [isEditAccordionOpen, setIsEditAccordionOpen] = useState(false);
    const [isDeletePopoverOpen, setIsDeletePopoverOpen] = useState(false);
    const [isHover, setIsHover] = useState(false);
    const [isOpenEditComment, setIsOpenEditComment] = useState(false);

    
    const deleteButtonRef = useRef(null);
    const navigate = useNavigate();
    console.log("commentData1",  commentData)
    console.log("commentData1 likes",  commentData.likes)
    console.log("numOfLikes", numOfLikes)

    const highlightedText = 
    (isHighLighted && commentData && commentData.likes > 0)?
        <Typography style={{color: appTheme.palette.accent1.main}}>Highlighted Comment</Typography> :
        <span/>;

    console.log('user comment post id', shelter_post_id)

    const handleClose = async() => {
        //TODO: Amanda
        if (reloadData) {
            await reloadData();
        }
        setIsOpenEditComment(false)
    }

    const loadLike = async() => {
        try {
            if (appCtx.user) {
                let likeStatus = await apiStore.getLikeStatus(appCtx.user, commentData.comment_id, commentData.post_id)
                setLikeState(likeStatus.like_status)
                setNumOfLikes(likeStatus.num_of_likes)
            }
        } catch {

        }
    }

    const handleLike = async () => {
        try {
            if (appCtx.user) {
                console.log('appCtx.user', appCtx.user)
                let likeResponse = await apiStore.handleLike(commentData.comment_id, commentData.post_id, appCtx.user)
                console.log('likeResponse', likeResponse)
                setLikeState(likeResponse.like)
                setNumOfLikes(likeResponse.num_of_likes)
                console.log("likeState after clicking", likeState)
                if (onLike) {
                    await onLike();
                }
            } else {
                setOpen(true)
            }
            } catch {
        }
    }

    const getUserPofile = async () => {
        try {
            if (commentData.username in appStore.userProfilePic) {
                setUserProfile(appStore.userProfilePic[commentData.username])
            } else {
                let profile = await apiStore.getUserProfile(commentData.username)
                console.log("profile", profile)
                appStore.setUserProfilePic(commentData.username, profile.profile_pic_path)
                console.log('profile', profile)
                setUserProfile(profile)
            }
            } catch {
        }
    }

    const handleDeleteComment = async () => {
        try {
            let deleteCommentResponse = await apiStore.deleteComment(commentData.comment_id, commentData.post_id)
            console.log("detetion status", deleteCommentResponse)
            let commentDataResponse = await apiStore.loadAllComments(appStore.username);
            setCommentData(commentDataResponse)
            } catch (error) {
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
                <IconButton onClick={handleLike} ref={favoritebBttonRef}>
                    <FavoriteBorderOutlinedIcon fontSize="large" style={{color: appTheme.palette.primary.main, width: "32px" }}/>
                        {numOfLikes}
                </IconButton>
            </Grid>
            </Grid>
            <Popover open={open} onClose={() => setOpen(false)} anchorEl={favoritebBttonRef.current}>
                <Grid style={{padding: "20px"}}>
                    <UserNotLoggedInPopOverContent/>
                </Grid>
            </Popover>
        </>)

        const imageThumbnailAndLightBox = commentData.pics.map((data, index) => {
            return <ImageThumbNailWithLightBox key={index} index={index} imgs={commentData.pics} isDeletable={false}/>
        })

    useEffect(() => {
        loadLike();
        getUserPofile();
    }, [])

    console.log("comment data", commentData)
    return (
      <Card 
        onMouseEnter={() => {
            setIsHover(true)
        }}
        onMouseLeave={() => {
            setIsHover(false)}}
        style={{
            padding: "20px",
            margin: "20px 0px",
            boxShadow: "0px 16px 16px rgba(50, 50, 71, 0.08), 0px 24px 32px rgba(50, 50, 71, 0.08)",
            borderRadius: "8px",
            backgroundColor: isHover? 'rgba(114,114,114,0.1)' : "rgba(0,0,0,0)"
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
                        justifyContent="flex-end" 
                        wrap="nowrap"
                        rowSpacing={1}
                        alignItems="center">

                            <Grid item
                                container
                                direction="col" 
                                alignItems="flex-start"
                                style={{width: "100%", justifyContent: "left"}}>
                            <img 
                            style={{width: 60, height: 60, borderRadius: 60/ 2}} 
                            src={appStore.userProfilePic[commentData.username]}
                            alt='user profile placeholder'
                            />
                            </Grid>

                            {isEditAndDeleteable && <Grid item
                                container
                                alignItems="center"
                                style={{justifyContent: "right"}}>
                                <Button
                                ref={deleteButtonRef}
                                onClick={() => {
                                    setIsDeletePopoverOpen(true)
                                }}>
                                    Delete
                                </Button>
                                <Popover 
                                    open={isDeletePopoverOpen} 
                                    onClose={() => setIsDeletePopoverOpen(false)} 
                                    anchorEl={deleteButtonRef.current}>
                                    <Grid style={{padding: "20px", width: "350px"}}
                                        container
                                        justifyContent="center">
                                        <Typography>
                                            Are you sure to delete this comment?
                                        </Typography>

                                        <Grid item
                                            container
                                            alignItems="center"
                                            justifyContent="right">
                                            <Button 
                                                onClick={() => {
                                                setIsDeletePopoverOpen(false);
                                            }}>
                                                Cancel
                                            </Button>
                                            <Button
                                            onClick={() => {
                                                handleDeleteComment()
                                                setIsDeletePopoverOpen(false);
                                            }}>
                                                Yes
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Popover>
                            </Grid>}

                        </Grid>}
                        <Grid
                        item
                        container
                        direction="row" 
                        justifyContent="space-between" 
                        alignItems="center">
                            <Typography>{commentData.username}</Typography>
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
                        <Rating value={commentData.rating} readOnly precision={0.5} style={{color: appTheme.palette.primary.main }}/>
                        <div style={{marginTop: "-1px", marginLeft:"10px"}}>
                        <Typography style={{fontSize: "large"}}>{commentData.post_time.split("T")[0]}</Typography>
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
                        <TagContainer tagData={commentData.tags} isSelectable={false}/>
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
                            <Typography>{commentData.comment_body}</Typography>
                        </Grid>
                    
                </Grid>

                <Grid 
                    item
                    container 
                    justifyContent='flex-start' >
                    {imageThumbnailAndLightBox}
                </Grid>

                {isEditAndDeleteable &&
                <Accordion style={{width: "100%"}} expanded={isOpenEditComment}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                        onClick={() => setIsOpenEditComment(!isOpenEditComment)}
                        >
                    <Typography>Edit comment</Typography>
                    </AccordionSummary>

                    <AccordionDetails>
                        <PostCommentForm 
                            shelterName={shelterName}
                            shelter_post_id={shelter_post_id}
                            commentData={commentData}
                            setCommentData={setCommentData}
                            handleClose={handleClose}
                            isUpdateComment={true}/>
                    </AccordionDetails> 
                </Accordion>}
            </Grid>
      </Card>
    );
});

export default UserComment;
