import React from 'react';
import Tag from './Tag';
import { Grid } from '@mui/material';

const TagContainer = ({tagData, isSelectable, selectedTags, setSelectedTags}) => {
    console.log("tag data: " + tagData)
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
