import React from "react";
import styles from "./CalendarHeader.module.css";
import cheronLeft from "../../assets/images/chevron-left.svg";
import cheronRight from "../../assets/images/chevron-right.svg";

const CalendarHeader = ({ date, handleChangeDate }) => {
    return (
        <div className={styles.dateController}>
            <div className={styles.cheronLeftWapper}>
                <img src={cheronLeft} alt="前へ" onClick={handleChangeDate(-1)} className={styles.cheronImage} />
            </div>

            <div className={styles.dateTitleWapper}>
                <h1 className={styles.dateTitle}>
                    <span>{date.year}</span>年
                    <span>{String(date.month).padStart(2, '0')}</span>月
                </h1>
            </div>

            <div className={styles.cheronRightWapper} onClick={handleChangeDate(+1)}>
                <img src={cheronRight} alt="次へ" className={styles.cheronImage} />
            </div>
        </div>
    );
};

export default CalendarHeader;