import React, { useState } from "react";
import styles from "./CalendarCell.module.css";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/date";
import { APP_NAME } from "../../config/app";

const CalendarCell = ({ date, todoList, isOtherMonth }) => {
    const today = new Date();
    const d = new Date(date);
    const navigate = useNavigate();

    const [nowDate] = useState({
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
    });
    const [day] = useState(parseInt(date.split('-')[2]));

    return (
        <div className={`
                ${styles.cell}
                ${
                    (() => {
                        if (d.getDay() === 0) {
                            return styles.sunday
                        } else if (d.getDay() === 6) {
                            return styles.saturday
                        }
                    })()
                }
                ${isOtherMonth && styles.otherMonth}
            `}
            onClick={() => navigate(`/${APP_NAME}/diary/${date.replace(/-/g, '/')}`)}
        >
                <span className={`${styles.day} ${formatDate(nowDate.year, nowDate.month, nowDate.day) === date && styles.today}`}>
                    {day}
                </span>
                <ul className={styles.todoList}>
                    {
                        todoList?.map((todo, index) => (
                            <li key={index}>・{todo}</li>
                        ))
                    }
                </ul>
        </div>
    );
};

export default CalendarCell;