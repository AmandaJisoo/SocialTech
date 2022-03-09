import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@mui/material';


const public_url = process.env.PUBLIC_URL;

const ImageGallery = ({ imgAddr }) => {

    console.log(public_url + imgAddr)
    return (
        <Grid>
            <img src={public_url + imgAddr} alt="placeholder"
                style={{width: "100%"}}
            />
        </Grid>
    );
};

ImageGallery.propTypes = {};

export default ImageGallery;