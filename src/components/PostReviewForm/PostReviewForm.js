import {React, useState, useContext, useRef} from 'react';
import PropTypes from 'prop-types';
import text from "../../text/text.json"
import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Rating from '@mui/material/Rating';
import appTheme from '../../theme/appTheme.json';
import ImageIcon from '@mui/icons-material/Image';
import Divider from '@mui/material/Divider';
import style from './style.js'
import { useStore } from '../../pages/Hook';
import AppContext from '../../AppContext';
import TagSelectionTab from './TagSelectionTab';

const PostReviewForm = ({ formData, handleClose, post_id }) => {
    const [reviewText, setReviewText] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [starRating, setStarRating] = useState(0);
    const [selectedFile, setSelectedFile] = useState([]);
    // const [fileSelectionErrMsg, setFileSelectionErrMsg] = useState(null);
    const fileInputRef = useRef(null);
    const { apiStore } = useStore();
    const appCtx = useContext(AppContext);

    const handleTextChange = (event) => {
        setReviewText(event.target.value)
    }

    const handleUploadReview = async () => {
        try {
            let imageUploadResponse = []
            for (let i = 0; i < selectedFile.length; i++) {
                imageUploadResponse.push(await apiStore.uploadImageToS3(selectedFile[i]));
            }
            console.log(imageUploadResponse)
            const reviewUploadResponse = await apiStore.createComment({
                post_id: post_id,
                comment_body: reviewText,
                username: appCtx.user,
                rating: starRating,
                tags: selectedTags,
                pics: imageUploadResponse
            })
            console.log(reviewUploadResponse)
            handleClose()
        } catch (err) {
            console.log("img upload error: " + err.message)
        }
    }

    const selectFile = () => {
        fileInputRef.current.click()
    } 

    const selectedFileDisplay = () => {
        let fileArray = Array.from(selectedFile)
        return fileArray.length === 0 ? null :
        <Grid>
            <Typography>Currently Selected Image :</Typography>
            {fileArray.map(data => {
                return <Typography>{data.name}</Typography>
            })}
        </Grid>
    } 

    return (
        <Grid
            sx={style}
            container
            direction="column" 
            justifyContent="space-evenly" 
            alignItems="center">
                
            <Grid
                container
                direction="column" 
                justifyContent="center" 
                alignItems="center"
            >
                <Typography > {`Rate ${formData.shelterName}`}</Typography>
                <Rating 
                    value={starRating} 
                    precision={0.5} 
                    onChange={(event, newRating) => {
                        setStarRating(newRating)
                    }}
                    sx={{ fontSize: "1.8rem" }}
                    style={{color: appTheme.palette.primary.main }}/>
            </Grid>
            <Typography style={{marginTop: "12px"}}>{text.postReviewForm.chooseTagPrompt}</Typography>
            <TagSelectionTab selectedTags={selectedTags} setSelectedTags={setSelectedTags}/>  

                <Grid
                    container
                    direction="column" 
                    justifyContent="center" 
                    alignItems="center"
                >
                    <TextareaAutosize
                        maxRows={6}
                        value={reviewText}
                        placeholder={text.postReviewForm.textFieldPlaceHolder}
                        style={{width: "98%", height: "120px"}}
                        onChange={handleTextChange}/>
                </Grid>  
                <Divider style={{width: "100%"}}/> 
                <Grid
                    container
                    direction="row" 
                    justifyContent="flex-end" 
                    alignItems="center"
                    >
                    <Grid style={{padding: "5px"}}>
                        <input
                            type="file"
                            name="file"
                            onChange={ () => {
                                console.log("selected files: ", fileInputRef.current.files)
                                setSelectedFile(Array.from(fileInputRef.current.files))
                            }}
                            accept="image/*"
                            multiple
                            ref={fileInputRef}
                            style={{display: "none"}}/>
                        <ImageIcon onClick={() => selectFile()} style={{cursor: "pointer"}}/>
                    </Grid>
                </Grid>  

            {selectedFileDisplay()}
            <br />

            <Grid
                container
                direction="row" 
                justifyContent="flex-end" 
                alignItems="center"
            >
                <Button 
                    
                    variant="contained"
                    onClick={() => {
                        handleUploadReview()
                        setReviewText("")
                        setSelectedTags([])
                        setSelectedFile([])
                        setStarRating(0)
                    }}>
                    {text.postReviewForm.PostReviewBtn}
                </Button>
            </Grid>  

        </Grid>    
    );
};

PostReviewForm.propTypes = {
    shelterName: PropTypes.string,
    userName: PropTypes.string,
    handleClose: PropTypes.func
};

export default PostReviewForm;
