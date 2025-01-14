import React, { useState } from "react";
import styles from "./DiaryList.module.css";
import { useNavigate } from "react-router-dom";
import { APP_NAME } from "../../config/app";

const DiaryList = ({ children, sequenceNum, diaryDate, createAt }) => {
    const navigate = useNavigate();

    const [date] = useState({
        year: diaryDate.split('-')[0],
        month: diaryDate.split('-')[1],
        day: diaryDate.split('-')[2],
    });

    return (
        <div className={styles.listItem} onClick={() => navigate(`/${APP_NAME}/diary/${date.year}/${date.month}/${date.day}`)}>
            <div className={styles.sequenceNumContainer}>
                No.{sequenceNum}
            </div>
            <div className={styles.dateContainer}>
                {date.year}年
                {date.month}月
                {date.day}日
            </div>
            <div className={styles.textSummaryContainer}>
                {children}
            </div>
            <div className={styles.footerContainer}>
                作成:{createAt}
            </div>
        </div>
    );
};

export default DiaryList;