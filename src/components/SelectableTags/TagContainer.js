import React from 'react';
import Tag from './Tag';
import { Grid } from '@mui/material';
import { MAX_NUMBER_OF_TAGS_IN_SHELTER_CARD } from '../../utils/utilityFunctions';

const TagContainer = ({tagData, isSelectable, selectedTags, setSelectedTags, isMobileDisplay}) => {

    if (isMobileDisplay) {
        tagData = tagData.slice(0, MAX_NUMBER_OF_TAGS_IN_SHELTER_CARD)
        tagData.push(".....")
    }

    const tags = tagData.map((tagContent) => {
        return <Tag key={tagContent} 
        isSelectable={isSelectable} text={tagContent} selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
    })
    
    return (
        <Grid>
            {tags}
        </Grid>
    )

};

export default TagContainer;
