import React, { useState } from "react";
import { WithContext as ReactTags } from "react-tag-input";
import styles from "./ReactTags.module.scss";
const SelectableTags = ({tagData}) => {
    
    const KeyCodes = {
        comma: 188,
        enter: 13,
      };

    const delimiters = [KeyCodes.comma, KeyCodes.enter];

    const [selectedTags, setSelectedTags] = useState([])

    const handleTagClick = (event) => (
        console.log(event) // print out tag index in array
    )

    return <div className={styles.ReactTags}>
        <ReactTags
            handleTagClick={handleTagClick}
            delimiters={delimiters}
            minQueryLength={2}
            autofocus={false}
            readOnly={true}
            allowUnique={true}
            allowDragDrop={false}
            inline={true}
            editable={false}
            clearAll={false}
            tags={tagData}/>
    </div>;
};

export default SelectableTags;