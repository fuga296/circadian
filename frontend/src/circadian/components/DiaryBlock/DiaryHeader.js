import React, { useEffect, useState } from "react";

import MetaInfo from "./MetaInfo";
import LoadingCircle from "../../../components/LoadingCircle";

import { META_INFO_CONTENTS } from "../../constants/diary";
import { formatDate, getDayOfWeek, getMonthMaxDays } from "../../utils/date";

import styles from "./DiaryHeader.module.css";


const DiaryHeader = ({ handleChangeDate, diaryInfo, diaryState }) => {

    const [date, setDate] = useState(() => {
        const [year, month, day] = !diaryState.isHistory ? diaryInfo.date.split('-') : diaryInfo.diary_date.split('-');
        return { year, month, day };
    });
    const [isDisabled] = useState(diaryState.isDisabled);

    const handleChangeDateInput = (e) => {
        const { name, value } = e.target;
        setDate((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        handleChangeDate && handleChangeDate(formatDate(date.year, date.month, date.day));
    }, [date, isDisabled, handleChangeDate]);

    return (
        <div className={styles.diaryHeader}>
            <span className={styles.dateContainer}>
                <input
                    name="year"
                    type="number"
                    min="1000"
                    max="9999"
                    className={`${styles.dateInput} ${styles.yearInput}`}
                    value={parseInt(date.year)}
                    onChange={handleChangeDateInput}
                    disabled={isDisabled}
                />
                <span className={styles.dateCounterWord}>年</span>
            </span>
            <span className={styles.dateContainer}>
                <input
                    name="month"
                    type="number"
                    min="1"
                    max="12"
                    className={`${styles.dateInput} ${styles.monthInput}`}
                    value={parseInt(date.month)}
                    onChange={handleChangeDateInput}
                    disabled={isDisabled}
                />
                <span className={styles.dateCounterWord}>月</span>
            </span>
            <span className={styles.dateContainer}>
                <input
                    name="day"
                    type="number"
                    min="1"
                    max={getMonthMaxDays(date.year, date.month)}
                    className={`${styles.dateInput} ${styles.dayInput}`}
                    value={parseInt(date.day)}
                    onChange={handleChangeDateInput}
                    disabled={isDisabled}
                />
                <span className={styles.dateCounterWord}>日</span>
            </span>
            <span className={`${styles.dateContainer} ${styles.dayOfWeekContainer}`}>
                (<input
                    name="dayOfWeek"
                    type="text"
                    maxLength={1}
                    minLength={1}
                    className={`${styles.dateInput} ${styles.dayOfWeekInput}`}
                    value={getDayOfWeek(date.year, date.month, date.day)}
                    disabled
                />)
            </span>

            <span className={styles.headerMetaContainer}>
                {
                    !diaryState.isHistory && (isDisabled ? (
                        <MetaInfo
                            diaryInfo={diaryInfo}
                            metaInfoContents={META_INFO_CONTENTS}
                            loading={diaryState.loading}
                        />
                    ) : (
                        <button className={`${styles.button} ${diaryState.loading && styles.loadingButton}`} disabled={diaryState.loading}>
                            <LoadingCircle isLoading={diaryState.loading}>保存</LoadingCircle>
                        </button>
                    ))
                }
            </span>
        </div>
    );
};

export default DiaryHeader;