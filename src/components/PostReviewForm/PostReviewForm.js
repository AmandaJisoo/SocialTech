import {React, useState} from 'react';
import PropTypes from 'prop-types';
import text from "../../text/text.json"
import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Rating from '@mui/material/Rating';
import appTheme from '../../theme/appTheme.json';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ImageIcon from '@mui/icons-material/Image';
import MoodIcon from '@mui/icons-material/Mood';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Divider from '@mui/material/Divider';
import style from './style.js'
import Box from '@mui/material/Box';
import Tag from '../SelectableTags/Tag';

const PostReviewForm = ({ formData, handleClose }) => {
    const [reviewText, setReviewText] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [starRating, setStarRating] = useState(0);

    const tags = text.onboard.tags.map((data) => {
        return <Tag key={data.id} 
                    isSelectable={true} 
                    text={data.text} 
                    selectedTags={selectedTags}
                    setSelectedTag={setSelectedTags}/>
    })

    const onTextChange = () => {
    }

    const handleUploadReview = () => {
        handleClose()

    }

    return (
        <Grid
            sx={style}
            container
            direction="column" 
            justifyContent="space-evenly" 
            alignItems="flex-start">
                
            <Grid
                container
                direction="column" 
                justifyContent="center" 
                alignItems="flex-start"
            >
                <Typography>{formData.shelterName}</Typography>
                <Rating 
                    value={starRating} 
                    precision={0.5} 
                    onChange={(event, newRating) => {
                        setStarRating(newRating)
                    }}
                    style={{color: appTheme.palette.primary.main }}/>
            </Grid>  

            <Box style={{width: "100%", borderRadius: "10px", border: "2px grey", borderStyle: "groove"}}>
                <Typography>{formData.userName}</Typography>
                <Divider style={{width:  "100%"}}/> 
                <Grid
                    container
                    direction="column" 
                    justifyContent="center" 
                    alignItems="center"
                >
                    <TextareaAutosize
                        
                        maxRows={6}
                        placeholder={text.postReviewForm.textFieldPlaceHolder}
                        style={{width: "98%", height: "120px"}}/>
                </Grid>  

                <Divider style={{width: "100%"}}/> 

                <Grid
                    container
                    direction="row" 
                    justifyContent="flex-end" 
                    alignItems="center"
                    >
                    <AddCircleOutlineIcon/>
                    <ImageIcon/>
                    <MoodIcon/>
                    <MoreHorizIcon/>
                </Grid>  
            </Box>

            <Typography>{text.postReviewForm.chooseTagPrompt}</Typography>

            <Grid>
                {tags}
            </Grid>

            <Divider style={{width: "100%", margin: "5px 0 5px 0"}}/> 

            <Grid
                container
                direction="row" 
                justifyContent="flex-end" 
                alignItems="center"
            >
                <Button 
                    variant="contained"
                    onClick={handleClose}>
                    {text.postReviewForm.cancelBtn}
                </Button>
                <Button 
                    variant="contained"
                    onClick={handleUploadReview}>
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
