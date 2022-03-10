import {React, useState} from 'react';
import PropTypes from 'prop-types';
import appTheme from '../../theme/appTheme.json';

const Tag = ({isSelectable, text, selectedTags, setSelectedTag }) => {
    const [selected, setSelected] = useState(false);

    const handleClick = (event) => {
        if (isSelectable) {
            setSelected(!selected)
            updateSelectedTag(text)
        }
    }

    const updateSelectedTag = () => {
        //toggle value
        if (selectedTags != null) {
            if (selectedTags.includes(text)) {
                setSelectedTag(selectedTags.filter(text_ => {
                    return text_ !== text
                }))
            } else {
                setSelectedTag([...selectedTags].push(text))
            }
        }
        console.log(selectedTags)
    }

    return (
        <span 
            className="tag" 
            value={text}
            onClick={handleClick}
            style={{
                background: selected ? appTheme.palette.primary.main : appTheme.palette.primaryLight.light,
                color: selected ? appTheme.palette.primaryLight.main : appTheme.palette.dark.darker,
                padding: "5px",
                margin: "0 5px",
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
