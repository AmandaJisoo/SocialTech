import {React, useState} from 'react';
import PropTypes from 'prop-types';
import appTheme from '../../theme/appTheme.json';

const Tag = ({isSelectable, text, selectedTags, setSelectedTags }) => {
    const [selected, setSelected] = useState(false);

    const handleClick = (event) => {
        if (isSelectable) { 
            if (!selected) {
                selectedTags.push(text)
                setSelectedTags(selectedTags)
            } else {
                selectedTags = selectedTags.filter(text_ => {
                    return text_ !== text
                })
                setSelectedTags(selectedTags)
            }
            console.log("selected tag: ", selectedTags)
            setSelected(!selected)
        }
    }

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
                padding: "5px",
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
