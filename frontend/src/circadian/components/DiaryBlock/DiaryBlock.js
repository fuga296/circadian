import React from "react";

import DiaryHeader from "./DiaryHeader";
import DiaryBody from "./DiaryBody";
import DiaryFooter from "./DiaryFooter";

import styles from "./DiaryBlock.module.css";

const DiaryBlock =({ height, preDiary, handlers, isDisabled, isHistory, loading }) => {
    return (
        <form
            className={styles.diaryBlock}
            style={{ height }}
            onSubmit={handlers?.handleSubmit}
        >
            <DiaryHeader
                handleChangeDate={handlers?.handleChangeDate}
                preDiary={preDiary}
                isDisabled={isDisabled}
                isHistory={isHistory}
                loading={loading}
            />
            <DiaryBody
                handleChangeText={handlers?.handleChangeText}
                preText={preDiary.text}
                isDisabled={isDisabled}
            />
            <DiaryFooter
                handleChangeSubText={handlers?.handleChangeSubText}
                preDiary={preDiary}
                isDisabled={isDisabled}
                height={height}
            />
        </form>
    );
};

export default DiaryBlock;