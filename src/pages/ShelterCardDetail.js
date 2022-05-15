import {React, useContext, useState, useEffect, useRef} from 'react';
import { observer } from "mobx-react";
import PropTypes from 'prop-types';
import UserComment from '../components/UserComment';
import { Alert, Card, Grid, Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Rating from '@mui/material/Rating';
import appTheme from '../theme/appTheme.json';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined'
import IosShareIcon from '@mui/icons-material/IosShare';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CircularProgress from '@mui/material/CircularProgress'
import Modal from '@mui/material/Modal';
import text from "../text/text.json";
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Auth } from 'aws-amplify';
import PostCommentForm from '../components/PostCommentForm/PostCommentForm';
import TagContainer from '../components/SelectableTags/TagContainer';
import AppContext from '../AppContext';
import { useStore } from './Hook';
import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import ShelterClaimStatusText from '../components/ShelterClaimStatusText'
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import UserNotLoggedInPopOverContent from '../components/UserNotLoggedInPopOverContent';
import LoadingSpinner from '../components/LoadingSpinner';
import { LOADING_SPINNER_SIZE, ICON_RESPONSIVE_FONTSIZE } from '../utils/utilityFunctions';
import Pagination from '@mui/material/Pagination';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import AmenityFilterTab from '../components/AmenityFilterTab';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css"

const WEBSITE_PLACEHOLDER = "https://www.google.com/"
const DISTANCE_PLACEHOLDER = 1.5 + "km"

const ShelterDetail = observer(({ shelterData }) => {

    //console.log("shelterdetail sheter data", shelterData);
    const params = useParams();
    const { hash } = useLocation();
    const post_id = `${params.id}${hash}`;
    console.log("sheltercarddetail post_id", post_id)
    const { apiStore, appStore } = useStore();
    const currentShelterData = appStore.shelterData;
    //onsole.log("currentShelterData", currentShelterData)
    const [comments, setComments] = useState([]);
    const [highlightedComment, setHighlightedComment] = useState(undefined);
    const shelterPostData = appStore.shelterData;
    const navigate = useNavigate();
    const appCtx = useContext(AppContext);
    //console.log('highlightedComment', highlightedComment)
    const [isClaimed, setIsClaimed] = useState(undefined);
    const [loaderActive, setLoaderActive] = useState(true);
    const [isCommentSubmitted, setIsCommentSubmitted] = useState(false)
    const [bookmarkState, setBookmarkState] = useState(undefined);
    const [open, setOpen] = useState(false)
    const [openModal, setOpenModal] = useState(false);
    const [snackBarOpen, setSnackBarOpen] = useState(false)
    const buttonRef = useRef(null);
    //console.log("bookmarkState", bookmarkState)
    const streetAddress = shelterPostData ? shelterPostData.street.toUpperCase() : ""
    const cityAddress = shelterPostData ? `${shelterPostData.city}, ${shelterPostData.state}, ${shelterPostData.zipcode}`.toUpperCase() : ""
    const fullAddress = `${streetAddress} ${cityAddress}`
    const [page, setPage] = useState(1)
    const [distance, setDistance] = useState(undefined)
    const [modalTitleStatus, setModalTitleStatus] = useState("")
    const [modalSubTitleStatus, setModalSubTitleStatus] = useState("")
    const [filterOption, setFilterOption] = useState("latest");
    const [currentUsername, setCurrentUsername] = useState(appStore.username)
    const [openEdit, setOpenEdit] = useState(false)
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState([]);
    const [editTitle, setEditTitle] = useState("")
    const [editStreet, setEditStreet] = useState("")
    const [editCity, setEditCity] = useState("")
    const [editState, setEditState] = useState("")
    const [editZipcode, setEditZipcode] = useState("")
    const [editUtilities, setEditUtilities] = useState([])
    const [showEditLoader, setShowEditLoader] = useState(false)
    const [isOwner, setIsOwner] = useState(false);
    const [galleryImgs, setGalleryImgs] = useState([]);
    // console.log(comments)
    // console.log("selectedFile", selectedFile)

    useEffect(() => {
        (async () => {
            if (appStore.zipcode != "") {
                setDistance(await apiStore.getDistanceBetweenZipcodes(appStore.zipcode, fullAddress))
            }
        })()
    }, [appStore.zipcode])

    useEffect(() => {
        (async () => {
            await appStore.getUsername();
            const getClaimResponse = await apiStore.getClaim(appStore.username, post_id);
            setIsOwner(getClaimResponse && 'claimed' == getClaimResponse.status)
        })()
    }, [appStore.username])
    const pageSize = 10;

    const getCommentData = async () => {
        try {
            const commentDataRes = await apiStore.loadComment(post_id);
            
            console.log("comment response: ", commentDataRes)
            setComments(commentDataRes)
            let res = commentDataRes.reduce((a, b) => {
                return a.concat(b.pics)
            }, [])
            res = res.map(img => {
                return {
                    original: img,
                    thumbnail: img,
                    originalClass: "gallery-img-original",
                    thumbnailClass: "gallery-img-thumbnail",
                }
            })
            console.log("reduce res: ", res)
            setGalleryImgs(res)

        } catch (err) {
            console.log(err.message)
        }
    }

    const getShelterPostData = async () => {
        try {
            //console.log("post_id before load summary: " + post_id)
            const shelterPostDataResponse = await apiStore.loadSummary(post_id);
            appStore.setShelterData(shelterPostDataResponse);
            setEditTitle(shelterPostDataResponse.title)
            setEditStreet(shelterPostDataResponse.street)
            setEditCity(shelterPostDataResponse.city)
            setEditState(shelterPostDataResponse.state)
            setEditZipcode(shelterPostDataResponse.zipcode)
            setEditUtilities(shelterPostDataResponse.utilities)
            //console.log("before fetch")
            const fetchData = await fetch(shelterPostDataResponse.profile_pic_path)
            const blobData = await fetchData.blob()
            //console.log("blob", blobData)
            setSelectedFile([blobData])
            //console.log("after set")

            //console.log("shelter data response: ", shelterPostDataResponse)

            const topComment = await apiStore.getMostLikedComment(post_id);
            //console.log("top/comment", topComment)
            if (topComment.length > 0) {
                appStore.setHighlightedComment(post_id, topComment[0])
                setHighlightedComment(topComment[0]);
                //console.log("loading new comment data");
            }
        } catch (err) {
            console.error(err.message)
        }
    }

    const reloadData = async () => {
        getCommentData()
        getShelterPostData()
    }

    useEffect(() => {

        const loadBookmarks = async () => {
            try {
                let authRes = await Auth.currentAuthenticatedUser();
                let username = authRes.username;
                setCurrentUsername(username);
                //console.log("username for bookmarks", username);
                let bookmarksResponse = await apiStore.getSavedBookmarks(username);
                //console.log("bookmarksResponse amanda", bookmarksResponse)
                let res = bookmarksResponse.includes(post_id)
                //console.log("res", res)
                setBookmarkState(bookmarksResponse.includes(post_id));
                setLoaderActive(false);
              } catch {
                setBookmarkState(false)
            }
        }

        const getClaimStatus = async() => {
            try {
                const claimStatus = await apiStore.getIsClaimed(post_id);
                //console.log("claimStatus response: ", claimStatus)
                setIsClaimed(claimStatus)
                if (claimStatus == "no_claim") {
                    setModalTitleStatus("Unclaimed Buisness")
                    setModalSubTitleStatus("The buisness has not yet been claimed by the owner by the shelter or a representative")
                } else if (claimStatus == "pending") {
                    setModalTitleStatus("Pending Buisness")
                    setModalSubTitleStatus("The buisness is in process of verfication")
                } 
            } catch (err) {
                console.log(err.message)
            }
        }
        getShelterPostData();
        getCommentData();
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

    // const reloadScreen = async () => {
    //     apiStore.loadSummary()
    // }

    const highlightedCommentEle = () => {
        if (comments === undefined) {
            return (
                <LoadingSpinner text={"Loading reviews"} size={LOADING_SPINNER_SIZE.small} />
            )
        } else if (comments.length === 0) {
            return null
        } else {
            if (highlightedComment) {
                return <UserComment 
                        commentData={highlightedComment} 
                        isHighLighted={true}
                        reloadData={reloadData}
                        shelterName={currentShelterData.title}
                        shelter_post_id={post_id}
                        onLike={getCommentData}
                        isEditAndDeleteable={currentUsername && currentUsername == highlightedComment.username}/>
            }
        }
    }
    
    const commentEles = () => {
        if (comments === undefined) {
            return (
                <LoadingSpinner text={"Loading comments"} size={LOADING_SPINNER_SIZE.small} />
            )
        } else if (comments.length === 0) {
            return (
                <Grid   
                container
                direction="column"
                justifyContent="center" 
                alignItems="center"
                style={{height: "15vh"}}>
                    <Typography>No comments for this shelter yet</Typography>
                </Grid>
            )
        } else {
            let sortedComments;
            if (filterOption == "latest") {
                sortedComments = comments.slice().sort((a, b) => b.post_time.localeCompare(a.post_time))
            } else if (filterOption == "oldest") {
                sortedComments = comments.slice().sort((a, b) => a.post_time.localeCompare(b.post_time))
            } else if (filterOption == "likes")  {
                sortedComments = comments.slice().sort((a, b) => b.likes - a.likes)
            }  else if (filterOption == "rating") {
                sortedComments = comments.slice().sort((a, b) => b.rating - a.rating)
            } else {
                console.error("no filter option defined for ", filterOption)
            }
            //console.log("sorted", sortedComments)
            const commentPage = sortedComments.slice(pageSize * (page - 1), pageSize * page);
            //console.log("commentPage", commentPage)
            //console.log("commentPage post_id", post_id);
            return commentPage
                .filter((commentData) => highlightedComment && commentData && (commentData.comment_id !== highlightedComment.comment_id))
                .map((commentData) => <UserComment 
                                shelterName={currentShelterData.title}
                                shelter_post_id={post_id}
                                commentData={commentData} 
                                isHighLighted={false} 
                                key={commentData.comment_id}
                                onLike={getCommentData}
                                reloadData={reloadData}
                                isEditAndDeleteable={currentUsername && currentUsername == commentData.username}/> 
            )
        }
    }

    const [openPostCommentForm, setOpenPostCommentForm] = useState(false);

    const handleOpen = () => {
        if (appCtx.user !==null) {
            setOpenPostCommentForm(true);
        } else {
            navigate("/app/auth/sign-in")
        }
    }

    const handleClose = () => {
        //TODO: Amanda
        setOpenPostCommentForm(false);
        setIsCommentSubmitted(true);
        getCommentData()
        getShelterPostData()
        setSnackBarOpen(true)
    }

    const handleGetDirection = (e) => {
          e.preventDefault();
          let url = "http://maps.google.com/?q=";
          let endAddress = fullAddress
          endAddress = endAddress.replace(/\s/g, "+")
          //console.log(endAddress);
          url = url + endAddress
          //console.log(url);
          window.location.href=url;
    }

    const favoriteIcon = () => bookmarkState? 
        <IconButton onClick={handleBookmark} >
            <BookmarkIcon sx={{ fontSize: 50 }} style={{color: appTheme.palette.primary.main, marginLeft: "0px"}}/>
        </IconButton> :
        (<>
        <IconButton onClick={handleBookmark} ref={buttonRef}>
            <BookmarkBorderOutlinedIcon sx={ICON_RESPONSIVE_FONTSIZE}/>
        </IconButton>
        <Popover open={open} onClose={() => setOpen(false)} anchorEl={buttonRef.current}>
            <UserNotLoggedInPopOverContent />
        </Popover>
        </>)

    const handleChange = (event) => {
        setFilterOption(event.target.value);
        console.log('event.target.value',event.target.value);
        // sortDataByOption();
        // appStore.setSearchOption(event.target.value);
    };
    const selectFile = () => {
        fileInputRef.current.click()
    } 

    //Amanda here
    // useEffect(() => {
    //     // setSearchBarOption(appStore.searchOption)\
    //     sortDataByOption();
    // }, [filterOption])

    // const sortDataByOption = async () => {
    //     try {
    //         if (comments.length == 0) {
    //             return
    //         } 
    //         console.log("filterOption when filtering", filterOption)
    //         console.log(comments)
    //         if (filterOption == "latest") {
    //             setComments(comments.slice().sort((a, b) => b.post_time.localeCompare(a.post_time)))
    //         } else if (filterOption == "oldest") {
    //             setComments(comments.slice().sort((a, b) => a.post_time.localeCompare(b.post_time)))
    //         } else if (filterOption == "star")  {
    //             setComments(comments.slice().sort((a, b) => b.likes - a.likes))
    //         }  else if (filterOption == "rating"){
    //             setComments(comments.slice().sort((a, b) => b.rating - a.rating))
    //         }   
    //     } catch (err) {
    //         console.log(err.message)
    //     }
    // }

    return (
        <>

            <Modal
                open={openEdit}
                onClose={() => setOpenEdit(false)}
            >
                <Box 
                sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '60vw',
                maxWidth: '600px',
                maxHeight: '80vh',
                overflowY: 'scroll',
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
                }}
                >
                {showEditLoader ?
                <LoadingSpinner text={"Processing"} size={LOADING_SPINNER_SIZE.small} /> :
                <>
                    <input
                    type="file"
                    name="file"
                    onChange={ () => {
                        setSelectedFile(Array.from(fileInputRef.current.files))
                    }}
                    accept="image/*"
                    ref={fileInputRef}
                    style={{display: "none"}}/>

                    <Grid container>
                        <Grid item xs={10}>
                                <Typography>Title</Typography> 
                            <TextField
                                required
                                id="outlined-required"
                                label="Required"
                                value={editTitle}
                                onChange={setEditTitle}/>
                        </Grid>
                        <Grid item xs={10}>
                            <Typography>Street</Typography> 
                            <TextField
                                required
                                id="outlined-required"
                                label="Required"
                                value={editStreet}
                                onChange={setEditStreet}
                            />
                        </Grid>
                        <Grid item xs={10}>
                            <Typography>City</Typography> 
                            <TextField
                                required
                                id="outlined-required"
                                label="Required"
                                value={editCity}
                                onChange={setEditCity}/>
                        </Grid>
                        <Grid item xs={10}>
                            <Typography>State</Typography> 
                            <TextField
                                required
                                id="outlined-required"
                                label="Required"
                                value={editState}
                                onChange={setEditState}
                            />
                        </Grid>
                        <Grid item xs={10}>
                            <Typography>Zipcode</Typography> 
                            <TextField
                                required
                                id="outlined-required"
                                label="Required"
                                value={editZipcode}
                                onChange={setEditZipcode}
                            />
                        </Grid>
                        <Grid item xs={10}>
                            <Button 
                                variant="contained" 
                                component="span" 
                                style={{marginTop: "13px"}} 
                                onClick={() => selectFile()}>
                                Change Picture
                            </Button>
                            {selectedFile && selectedFile.length > 0 ? 
                            <Typography>{selectedFile[0].name}</Typography> : <Typography>No file selected yet</Typography>}

                        </Grid>
                    </Grid>
                    <Typography style={{marginTop: "13px"}}>Amenities</Typography> 
                    <AmenityFilterTab
                        selectedAmenityTags={editUtilities} setSelectedAmenityTags={setEditUtilities}
                        displayShowResultButton={false}
                        handleFilter={() => {}}
                        displayClearAllButton={false}/>
                    <div style={{ display: "flex", justifyContent: 'flex-end'}}>
                    <Button 
                        onClick={async () => {
                        setShowEditLoader(true)
                        const s3Path = await apiStore.uploadImageToS3(selectedFile[0])
                        //console.log("upsert profile", s3Path);
                        await apiStore.upsertPost({
                            post_id: post_id,
                            title: editTitle,
                            zipcode: editZipcode,
                            street: editStreet,
                            city: editCity,
                            state: editState,
                            utilities: editUtilities,
                            profile_pic_path: s3Path
                        })
                        await getShelterPostData();
                        setOpenEdit(false);
                        setShowEditLoader(false)
                        }}>Submit
                    </Button>
                </div>
                </>}
                </Box>
            </Modal>
            
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
                    sx={{margin: {sx: "10px 0 30px 0", sm: "10px 0 30px 0", md: "80px 0 30px 0"}}}
                    spacing={1}
                    >
                    <Button 
                    onClick={async() => {
                        navigate("/app/dashboard")
                        let shelterData = []
                        //console.log("search optino", appStore.searchOption);
                        //console.log("search query", appStore.searchQuery)
                        if (appStore.searchOption == "zipcode") {
                            shelterData = await apiStore.loadOverview(appStore.searchQuery, appStore.searchQuery)
                        } else if (appStore.searchOption == "city") {
                            shelterData = await apiStore.getShelterByCity(appStore.searchQuery)
                        }
                        for (const shelterPostData of shelterData) {
                            const streetAddress = shelterPostData ? shelterPostData.street.toUpperCase() : ""
                            const cityAddress = shelterPostData ? `${shelterPostData.city}, ${shelterPostData.state}, ${shelterPostData.zipcode}`.toUpperCase() : ""
                            const fullAddress = `${streetAddress} ${cityAddress}`
                            let distance = await apiStore.getDistanceBetweenZipcodes(appStore.zipcode, fullAddress)
                            //console.log("distance: " + distance)
                            shelterPostData['distanceToUserLocation'] = distance
                          }
                        appStore.setShelterDataFn(shelterData)
                        appStore.setShelterDataList(shelterData)
                    }}>
                        {text.shelterDetail.backButton}
                    </Button>
                    <Typography variant="h3" fontWeight={600} style={{marginRight: "40px" }}>{shelterPostData.title}</Typography>
                        {bookmarkState !== undefined && favoriteIcon()}  
                        {/* Disable share icon for now. May come back and implement it */}
                        {/* <IosShareIcon/> */}
                </Grid>
                }
                {shelterPostData === undefined ? 
                <LoadingSpinner text={"Loading Shelter Data"} size={LOADING_SPINNER_SIZE.medium} />
                 :
                <>
                    <Grid style={{width: "100%", borderRadius: "30px"}}>
                        <ImageGallery 
                            items={[{original: shelterPostData.profile_pic_path, 
                                     thumbnail: shelterPostData.profile_pic_path,
                                     originalClass: "gallery-img-original",
                                     thumbnailClass: "gallery-img-thumbnail",
                                     }, ...galleryImgs]}
                            showBullets={true}
                            showPlayButton={false}/>
                    </Grid>

                    <Grid
                        item
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center">
                        <Grid 
                            item
                            container
                            direction="row"
                            style={{marginLeft: "-10px"}}>
                            <ShelterClaimStatusText postId={shelterPostData.post_id} currentUsername={currentUsername}modalSubTitleStatus={modalSubTitleStatus} modalTitleStatus = {modalTitleStatus} openModal={openModal} setOpenModal={setOpenModal} claim_status={isClaimed}/>

                        {isOwner && <Button onClick={()=> setOpenEdit(true)}>Edit Shelter</Button>}
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        container
                        direction="column"
                        alignItems="flex-start"
                        rowSpacing={1}>
                    
                        <Grid item>
                            <Typography  style={{fontWeight: "bold"}}>Overall Rating: </Typography>
                        </Grid>
                        <Grid item>
                            <Rating
                                name="size-large"
                                value={shelterPostData.avg_rating}
                                sx={{fontSize: "2rem"}} readOnly precision={0.5}
                                style={{color: appTheme.palette.primary.main, marginLeft: '-5px' }}/>
                        </Grid>

                        <Grid item style={{marginLeft: "-5px"}}>
                            <TagContainer
                                tagData={shelterPostData.utilities}
                                isSelectable={false}/>
                        </Grid>
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
                            <Typography style={{fontWeight: "bold"}}>Address: </Typography>
                            <Typography>{streetAddress}</Typography>
                            <Typography>{cityAddress}</Typography>
                        </Grid>
                        <Grid 
                            item
                            container
                            direction="row">
                        {distance && <Typography>{`${distance} away`}</Typography>}
                        </Grid>
                        <Grid item>
                            <Button style ={{marginBottom: "25px"}} variant="contained" onClick={handleGetDirection}>{text.shelterDetail.directToHereButtonText}</Button>
                        </Grid>
                    </Grid>
                </>}                
                {/* {shelterPostData !== undefined && 
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
                </Grid>} */}
        {shelterPostData !== undefined && 
            <Grid
                container
                direction="column" 
                justifyContent="flex-start" 
                alignItems="center"
                spacing={1}>
                    <PostCommentForm
                        shelterName={shelterPostData.title}
                        shelter_post_id={post_id}
                        handleClose={handleClose}
                        isUpdateComment={false}
                        commentData={null}
                        getShelterPostData={getShelterPostData}
                    />
                    </Grid>
        }

            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',}}
                autoHideDuration={6000}
                open={snackBarOpen}
                onClose={() => setSnackBarOpen(false)}
            >
                <Alert severity="success">Comment submitted!</Alert>
            </Snackbar>

            <Divider style={{width: "100%", marginTop: "20px", marginBottom: "20px"}}/>
            
            <Grid
                item
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="center">
                <Typography variant='h4' fontWeight={600}>Top Comment</Typography>
            </Grid>
            

            <Grid style={{width: "100%"}}>{highlightedCommentEle()}</Grid>
               
                <Divider style={{width: "100%", marginTop: "10px", marginBottom: "10px"}}/>
                <Grid
                    item
                    container
                    direction="row"
                    justifyContent="flex-start"
                    alignItems="center">
                    <Typography variant='h4' fontWeight={600}>{text.shelterDetail.otherReviewSectionHeader}</Typography>
                </Grid>
                <FormControl fullWidth style={{marginTop: "10px"}}>
                        <InputLabel id="demo-simple-select-label">Sort By:</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={filterOption}
                        label="option"
                        onChange={handleChange}
                        >
                        <MenuItem value={'latest'}>Latest</MenuItem>
                        <MenuItem value={'oldest'}>Oldest</MenuItem>
                        <MenuItem value={'likes'}>Number of Likes</MenuItem>
                        <MenuItem value={'rating'}>Rating</MenuItem>
                        </Select>
                </FormControl>
                <Grid style={{width: "100%"}}>{commentEles()}</Grid>
                <Pagination count={Math.floor(comments.length / pageSize) + ((comments.length % pageSize == 0) ? 0 : 1)} page={page} onChange={(event, value) => {console.log(event); console.log(value); setPage(value)}} />
            </Grid>
        </Grid>
        </>
    );
});

export default ShelterDetail;
