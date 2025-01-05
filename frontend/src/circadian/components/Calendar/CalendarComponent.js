import React from 'react';
import CalendarCell from './CalendarCell';
import { getMonthStartDay, getMonthMaxDays, formatDate } from '../../utils/date';
import styles from "./CalendarComponent.module.css";

const generateDayList = (start, length) => Array.from({ length }, (_, i) => start + i);

const Calendar = ({ year, month, todoLists }) => {

    const monthStartDay = getMonthStartDay(year, month);
    const monthMaxDays = getMonthMaxDays(year, month);
    const preMonthMaxDays = getMonthMaxDays(year, month - 1);

    const preMonthList = generateDayList(preMonthMaxDays - monthStartDay + 1, monthStartDay);
    const currentMonthList = generateDayList(1, monthMaxDays);
    const nextMonthList = generateDayList(1, 42 - monthMaxDays - monthStartDay);

    const getTodoList = (day) => {
        const todoList = todoLists.find(item => item.date === formatDate(year, month, day));
        return todoList ? todoList.todos : null;
    };

    return (
        <div className={styles.calendar}>
            {
                preMonthList.map((day, _) => (
                    <CalendarCell date={formatDate(year, month - 1, day)} key={formatDate(year, month - 1, day)} isOtherMonth={true} />
                ))
            }
            {
                currentMonthList.map((day, _) => (
                    <CalendarCell
                        date={formatDate(year, month, day)}
                        key={formatDate(year, month, day)}
                        isOtherMonth={false}
                        todoList={getTodoList(day)}
                    />
                ))
            }
            {
                nextMonthList.map((day, _) => (
                    <CalendarCell date={formatDate(year, month + 1, day)} key={formatDate(year, month + 1, day)} isOtherMonth={true} />
                ))
            }
        </div>
    );
};

export default Calendar;