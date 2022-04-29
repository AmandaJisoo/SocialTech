import React, { useState } from 'react';
import { Grid } from '@mui/material';
import { MAX_SHELTER_CARD_IMAGE_DIMENSION_SHELTER_DETAIL } from '../utils/utilityFunctions';
import Lightbox from "react-image-lightbox";
import 'react-image-lightbox/style.css';

const COMMENT_IMG_THUMBNAIL_DIMENSION = {
    width: "150px",
    height: "100px"
}

const ImageThumbNailWithLightBox = ({ imgs, index }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [photoIdx, setPhotoIdx] = useState(index)
    const public_url = process.env.PUBLIC_URL;

    console.log('key', index)
    console.log('img src: ', public_url + imgs[photoIdx])
    console.log('imgs', imgs)
    const startingImgIdx = index;

    return (
        <Grid
            style={{margin: "0 10px"}}
            >
            <img src={public_url + imgs[startingImgIdx]} alt="shelter"
                style={{
                    width: COMMENT_IMG_THUMBNAIL_DIMENSION.width, 
                    height: COMMENT_IMG_THUMBNAIL_DIMENSION.height}}
                onClick={() => setIsOpen(true)}
            />

            {isOpen && (
            <Lightbox
            mainSrc={public_url + imgs[photoIdx]}
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