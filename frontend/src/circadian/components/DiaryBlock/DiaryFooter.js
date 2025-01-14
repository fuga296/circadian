import React, { useState } from "react";

import SubTextContent from "./SubTextContent";
import SubTextSelection from "./SubTextSelection";

import styles from "./DiaryFooter.module.css";


const DiaryFooter = ({ handleChangeSubText, diaryInfo, diaryState }) => {
    const [selectedSubText, setSelectedSubText] = useState("progress");

    const handleChangeSelection = (newSubText) => {
        setSelectedSubText(newSubText);
    };

    return (
        <div className={styles.footer}>
            <SubTextSelection handleChangeSelection={handleChangeSelection} />
            <SubTextContent
                handleChangeSubText={handleChangeSubText}
                diaryInfo={diaryInfo}
                diaryState={diaryState}
                type={selectedSubText}
            />
        </div>
    );
};

export default DiaryFooter;