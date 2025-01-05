import { DAYS_OF_WEEK } from "../constants/date";

export const formatDate = (year, month, day) => {
    const d = new Date(year, month - 1, day);
    const [formatYear, formatMonth, formatDay] = [d.getFullYear(), d.getMonth() + 1, d.getDate()].map((i, _) => String(i).padStart(2, '0'));
    return `${formatYear}-${formatMonth}-${formatDay}`;
}

export const getDayOfWeek = (year, month, date) => {
    const d = new Date(year, month-1, date);
    return DAYS_OF_WEEK[d.getDay()];
}

export const getMonthMaxDays = (year, month) => {
    const d = new Date(year, month, 0);
    return d.getDate();
}

export const getMonthStartDay = (year, month) => {
    const d = new Date(year, month-1, 1);
    return d.getDay();
}