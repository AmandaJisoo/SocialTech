import React, { useState, useEffect } from "react";
import { WithContext as ReactTags } from "react-tag-input";
import styles from "./ReactTags.module.scss";

import PropTypes from 'prop-types';

const ReadOnlyTags = ({ tagData }) => {
    
    const KeyCodes = {
        comma: 188,
        enter: 13,
      };

    const delimiters = [KeyCodes.comma, KeyCodes.enter];

    const [tags, setTags] = useState(tagData)

    return <div className={styles.ReactTags}>
        <ReactTags
            delimiters={delimiters}
            minQueryLength={2}
            autofocus={false}
            readOnly={true}
            allowUnique={true}
            allowDragDrop={false}
            inline={true}
            editable={false}
            clearAll={false}
            tags={tags}/>
    </div>;
};

ReadOnlyTags.propTypes = {};

export default ReadOnlyTags;