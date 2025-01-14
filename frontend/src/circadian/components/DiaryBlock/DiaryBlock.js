import React from "react";

import DiaryBody from "./DiaryBody";
import DiaryFooter from "./DiaryFooter";
import DiaryHeader from "./DiaryHeader";

import { diaryBlockHeight } from "../../utils/diary";

import styles from "./DiaryBlock.module.css";


const DiaryBlock =({ diaryInfo, handlers, diaryState }) => {
    return (
        <form
            className={styles.diaryBlock}
            style={{ height: `${diaryBlockHeight(diaryState.isHistory)}px` }}
            onSubmit={handlers?.handleSubmit}
        >
            <DiaryHeader
                handleChangeDate={handlers?.handleChangeDate}
                diaryInfo={diaryInfo}
                diaryState={diaryState}
            />
            <DiaryBody
                handleChangeText={handlers?.handleChangeText}
                preText={diaryInfo.text}
                isDisabled={diaryState.isDisabled}
            />
            <DiaryFooter
                handleChangeSubText={handlers?.handleChangeSubText}
                diaryInfo={diaryInfo}
                diaryState={diaryState}
            />
        </form>
    );
};

export default DiaryBlock;