import React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import appTheme from '../theme/appTheme.json';
import Rating from '@mui/material/Rating';
import TagContainer from './SelectableTags/TagContainer';

const UserReview = ({ reviewData }) => {

    const highlightedText = reviewData.isHighLighted ? 
        <Typography style={{color: appTheme.palette.accent1.main}}>Highlighted Review</Typography> :
        <span/>;

    return (
      <Card 
        style={{
            padding: "20px",
            margin: "20px",
            boxShadow: "0px 16px 16px rgba(50, 50, 71, 0.08), 0px 24px 32px rgba(50, 50, 71, 0.08)",
            borderRadius: "8px"
        }}>
            <Grid
                container
                direction="column" 
                justifyContent="flex-start" 
                alignItems="center"
                spacing={1}>
                <Grid
                    item
                    container
                    direction="column" 
                    justifyContent="center" 
                    alignItems="center"
                    spacing={1}>
                    <Grid
                        item
                        container
                        direction="row" 
                        justifyContent="space-between" 
                        alignItems="center">
                            <Typography>{reviewData.userName}</Typography>
                            {highlightedText}
                    </Grid>
                    <Grid
                        item
                        container
                        direction="row" 
                        justifyContent="space-between" 
                        alignItems="center">
                        <Rating value={reviewData.starRating} readOnly precision={0.5} style={{color: appTheme.palette.primary.main }}/>
                        <Typography>{reviewData.date}</Typography>
                    </Grid>
                    <Grid
                        item
                        container
                        direction="row" 
                        justifyContent="flex-start" 
                        alignItems="center">
                        <TagContainer tagData={reviewData.tags} isSelectable={false}/>
                    </Grid>
                </Grid>

                <Grid
                    item
                    container
                    direction="row" 
                    justifyContent="space-between" 
                    wrap="nowrap"
                    rowSpacing={1}
                    alignItems="center">
                        <Grid item
                            container
                            direction="column" 
                            justifyContent="center"
                            alignItems="center"
                            style={{width: "32px", margin: "0 15px 0 5px"}}>
                            <FavoriteIcon fontSize="large" style={{color: appTheme.palette.primary.main, width: "32px" }}/>
                            <span>{reviewData.likes}</span>
                        </Grid>
                        <Grid item>
                            <Typography
                                style={{}}>
                                    {reviewData.content}
                            </Typography>
                        </Grid>
                    
                </Grid>
                
            </Grid>
      </Card>
    );
};

UserReview.propTypes = {
    userName: PropTypes.string,
    content: PropTypes.string,
    starRating: PropTypes.number,
    likes: PropTypes.number,
    date: PropTypes.string,
    isHighLighted: PropTypes.bool,
    tags: PropTypes.array,
};

export default UserReview;