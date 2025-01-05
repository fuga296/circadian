import React, { useEffect, useState } from "react";
import MetaInfo from "./MetaInfo";
import { formatDate, getDayOfWeek, getMonthMaxDays } from "../../utils/date";
import styles from "./DiaryHeader.module.css";

const DiaryHeader = ({ handleChangeDate, preDiary, isDisabled, isHistory, loading }) => {

    const [date, setDate] = useState(() => {
        const [year, month, day] = !isHistory ? preDiary.date.split('-') : preDiary.diary_date.split('-');
        return { year, month, day };
    });

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
                    !isHistory && (isDisabled ? (
                        <MetaInfo
                            metaInfoContents={[
                                {
                                    name: "連番",
                                    value: preDiary.sequence_number
                                },
                                {
                                    name: "ユーザー",
                                    value: preDiary.username
                                },
                                {
                                    name: "日付",
                                    value: preDiary.date
                                },
                                {
                                    name: "作成日",
                                    value: preDiary.created_at
                                },
                                {
                                    name: "最終編集日",
                                    value: preDiary.updated_at
                                },
                                {
                                    name: "日記ID",
                                    value: preDiary.front_id
                                },
                        ]} />
                    ) : <button className={styles.button}>保存</button>)
                }
            </span>
        </div>
    );
};

export default DiaryHeader;