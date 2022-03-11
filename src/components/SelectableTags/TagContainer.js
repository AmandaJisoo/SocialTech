import React from 'react';
import Tag from './Tag';
import { Grid } from '@mui/material';

const TagContainer = ({tagData, isSelectable, selectedTags, setSelectedTags}) => {
    const tags = tagData.map((obj) => {
        return <Tag isSelectable={isSelectable} text={obj.text} selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
    })

    return (
        <Grid>
            {tags}
        </Grid>
    )

};

export default TagContainer;
