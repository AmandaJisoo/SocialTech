import React, { useState } from 'react';
import { Grid } from '@mui/material';
import Lightbox from "react-image-lightbox";
import 'react-image-lightbox/style.css';
import RemoveCircleOutlinedIcon from '@mui/icons-material/RemoveCircleOutlined';
import IconButton from '@mui/material/IconButton';

const COMMENT_IMG_THUMBNAIL_DIMENSION = {
    width: "150px",
    height: "100px"
}

const ImageThumbNailWithLightBox = ({ imgs, index, selectedFile, setSelectedFile, isDeletable }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [photoIdx, setPhotoIdx] = useState(index)
    const startingImgIdx = index;
    const thumbnailImgAddr = imgs[index];
    console.log("img addr: " + thumbnailImgAddr)
    return (
        <Grid
            style={{margin: "0 10px", position: 'relative', borderRadius: "10px"}}
            >

            {isDeletable && <IconButton
                onClick={() => {
                    selectedFile = selectedFile.filter((imgUrl, idx) => {
                        return idx !== startingImgIdx
                    })
                    setSelectedFile(selectedFile)
                }}
                style={{position: 'absolute', top: "-20px", right: "-20px"}}>
                <RemoveCircleOutlinedIcon style={{fontSize: "25px"}}/>
            </IconButton>}
           
            <img src={thumbnailImgAddr} alt="shelter"
                style={{
                    width: COMMENT_IMG_THUMBNAIL_DIMENSION.width, 
                    height: COMMENT_IMG_THUMBNAIL_DIMENSION.height,
                    borderRadius: "15px"}}
                onClick={() => setIsOpen(true)}
            />

            {isOpen && (
            <Lightbox
            mainSrc={imgs[photoIdx]}
            nextSrc={imgs[(photoIdx + 1) % imgs.length]}
            prevSrc={imgs[(photoIdx + imgs.length - 1) % imgs.length]}
            onCloseRequest={() => setIsOpen(false)}
            onMovePrevRequest={() =>
                setPhotoIdx((photoIdx + imgs.length - 1) % imgs.length)
              }
              onMoveNextRequest={() =>
                setPhotoIdx((photoIdx + 1) % imgs.length)
              }
            />
            )}
            
        </Grid>
    );
};

export default ImageThumbNailWithLightBox;