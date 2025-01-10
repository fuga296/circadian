import React, { useEffect, useState } from "react";
import MetaInfo from "./MetaInfo";
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
                            metaInfoContents={[
                                {
                                    name: "連番",
                                    value: diaryInfo.sequence_number
                                },
                                {
                                    name: "ユーザー",
                                    value: diaryInfo.username
                                },
                                {
                                    name: "日付",
                                    value: diaryInfo.date
                                },
                                {
                                    name: "作成日",
                                    value: diaryInfo.created_at
                                },
                                {
                                    name: "最終編集日",
                                    value: diaryInfo.updated_at
                                },
                                {
                                    name: "日記ID",
                                    value: diaryInfo.front_id
                                },
                            ]}
                            loading={diaryState.loading}
                        />
                    ) : <button className={styles.button}>保存</button>)
                }
            </span>
        </div>
    );
};

export default DiaryHeader;