import React from 'react';
import { Grid } from '@mui/material';
import { MAX_SHELTER_CARD_IMAGE_DIMENSION_SHELTER_DETAIL } from '../utils/utilityFunctions';
import * as ImgGallery from 'react-image-gallery';

const public_url = process.env.PUBLIC_URL;

const ImageGallery = ({ imgAddr }) => {

    return (
        <Grid>
            <img src={public_url + imgAddr} alt="shelter"
                style={{width: MAX_SHELTER_CARD_IMAGE_DIMENSION_SHELTER_DETAIL.width, height: MAX_SHELTER_CARD_IMAGE_DIMENSION_SHELTER_DETAIL.height}}
            />
        </Grid>
    );
};

ImageGallery.propTypes = {};

export default ImageGallery;