import React, { useState } from "react";
import SubTextSelection from "./SubTextSelection";
import SubTextContent from "./SubTextContent";
import styles from "./DiaryFooter.module.css";

const DiaryFooter = ({ handleChangeSubText, preDiary, height, isDisabled }) => {
    const [selectedSubText, setSelectedSubText] = useState("progress");

    const handleChangeSelection = (newSubText) => {
        setSelectedSubText(newSubText);
    };

    return (
        <div className={styles.footer}>
            <SubTextSelection handleChangeSelection={handleChangeSelection} />
            <SubTextContent
                handleChangeSubText={handleChangeSubText}
                preDiary={preDiary}
                type={selectedSubText}
                isDisabled={isDisabled}
                height={height}
            />
        </div>
    );
};

export default DiaryFooter;