import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Calendar.css';
import arrowLeft from './../../images/chevron-left.svg';
import arrowRight from './../../images/chevron-right.svg';
import { formatN } from '../../utils/dateUtils';

const CalendarBox = ({ year, month }) => {
    const navigate = useNavigate();

    const getMonthDays = (y, m) => new Date(y, m, 0).getDate();
    const startDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = getMonthDays(year, month);
    const prevMonthDays = getMonthDays(year, month - 1);

    const days = Array.from({ length: 42 }, (_, i) => {
        let day = i - startDay + 1;
        let className = '';

        if (i < startDay) {
            day = prevMonthDays - startDay + i + 1;
            className = 'previous-month-day';
        } else if (day > daysInMonth) {
            day -= daysInMonth;
            className = 'next-month-day';
        } else {
            className = 'current-month-day'
        }

        if (i % 7 === 0) className += ' sunday';
        else if (i % 7 === 6) className += ' saturday';

        return { day, className: className.trim() };
    });

    const handleClickDay = (day) => (event) => {
        let dateStr = '';

        if (event.target.classList.contains('previous-month-day')) {
            if (month === 1) {
                dateStr = `${formatN(year - 1)}-${12}-${formatN(day)}`;
            } else {
                dateStr = `${year}-${formatN(month-1)}-${formatN(day)}`;
            }

        } else if (event.target.classList.contains('current-month-day')) {
            dateStr = `${year}-${formatN(month)}-${formatN(day)}`;

        } else if (event.target.classList.contains('next-month-day')) {
            if (month === 12) {
                dateStr = `${year + 1}-${1}-${formatN(day)}`;
            } else {
                dateStr = `${year}-${formatN(month+1)}-${formatN(day)}`;
            }
        }

        navigate(`/circadian/diary/${dateStr}`);
    }

    return (
        <div id='calendarBox'>
            {days.map(({ day, className }, index) => (
                <div key={index} className={`calendar-day ${className}`} onClick={handleClickDay(day)}>
                    {day}
                </div>
            ))}
        </div>
    );
};

const Calendar = () => {
    const [date, setDate] = useState({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
    })

    const dateIncrementDecrement = (type) => () => {
        if (type === "plus") {
            setDate({
                year: date.month === 12 ? date.year + 1 : date.year,
                month: date.month === 12 ? 1 : date.month + 1,
            })
        } else if (type === "minus") {
            setDate({
                year: date.month === 1 ? date.year - 1 : date.year,
                month: date.month === 1 ? 12 : date.month - 1,
            })
        }
    }

    return (
        <div id="contentContainer">
            <header>
                <div id='dateController'>
                    <img role='button' src={arrowLeft} alt='previous' onClick={dateIncrementDecrement("minus")} />
                    <h1>{date.year}年{date.month}月</h1>
                    <img role='button' src={arrowRight} alt='next' onClick={dateIncrementDecrement("plus")} />
                </div>
            </header>
            <main>
                <CalendarBox year={date.year} month={date.month} />
            </main>
        </div>
    )
};

export default Calendar;