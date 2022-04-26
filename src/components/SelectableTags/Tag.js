import {React, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import appTheme from '../../theme/appTheme.json';
import { TAGS_FOR_SPECIFIC_CATEGORY } from '../../utils/utilityFunctions';

const Tag = ({
    isSelectable, 
    text, 
    selectedTags, 
    setSelectedTags, 
    selectedCategory,
    isTagSelectionMutualExclusiveWithinCategory }) => {   

    console.log("selected tag: ", selectedTags)

    const [selected, setSelected] = useState(!isSelectable ? false : selectedTags.includes(text));

    const handleClick = (event) => {
        if (isSelectable) { 
            if (!selected) {

                if (isTagSelectionMutualExclusiveWithinCategory) {
                    let tagsInCurrentCategory = TAGS_FOR_SPECIFIC_CATEGORY.get(selectedCategory);
                    selectedTags = selectedTags.filter(text_ => {
                        return !tagsInCurrentCategory.includes(text_)
                    })
                }

                selectedTags.push(text)

                setSelectedTags(selectedTags.slice())
            } else {
                selectedTags = selectedTags.filter(text_ => {
                    return text_ !== text
                })
                setSelectedTags(selectedTags.slice())
            }
            console.log("selected tag: ", selectedTags)
            setSelected(!selected)
        }
    }

    //console.log("selectedTags in tag component " + text + ": " + selectedTags, "is selected: " + selected)

    // useEffect(() => {

    // }, [selectedTags])

    return (
        <span 
            className="tag" 
            value={text}
            onClick={() => {
                handleClick()
            }}
            style={{
                background: selected ? appTheme.palette.primary.main : appTheme.palette.primaryLight.light,
                color: selected ? appTheme.palette.primaryLight.main : appTheme.palette.dark.darker,
                padding: "8px",
                margin: "8px 8px",
                fontSize: "12px",
                display: "inline-block",
                borderRadius: "5px"
            }}>
            {text}
        </span>
    );
};

Tag.propTypes = {
    isSelectable: PropTypes.bool,
    data: PropTypes.string,
    selectedTags: PropTypes.array,
    updateSelectedTag: PropTypes.func
};

export default Tag;
