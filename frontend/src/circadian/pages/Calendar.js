import React, { useCallback, useEffect, useState } from "react";
import CalendarComponent from "../components/Calendar/CalendarComponent";
import ContentLayout from "../components/layouts/ContentLayout";
import CalendarHeader from "../components/Calendar/CalendarHeader";
import { getDiariesByMonth } from "../services/api";

const Calendar = () => {
    const today = new Date();
    const [date, setDate] = useState({
        year: today.getFullYear(),
        month: today.getMonth() + 1,
    });
    const [todoLists, setTodoLists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTodos = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const {year, month} = date;
            const response = await getDiariesByMonth(year, month);
            if (response?.data) {
                setTodoLists([ ...response.data ]);
            } else {
                setTodoLists([]);
            }
        } catch (err) {
            console.error("Error fetching diary:", err);
            setError("Failed to fetch diary. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [date]);

    useEffect(() => {
        fetchTodos();
    }, [fetchTodos]);

    const handleChangeDate = (increaseAndDecreaseFlag) => () => {
        const d = new Date(date.year, date.month + increaseAndDecreaseFlag - 1);
        setDate({
            year: d.getFullYear(),
            month: d.getMonth() + 1,
        });
    };

    return (
        <ContentLayout
            header={
                <>
                    <CalendarHeader
                        date={date}
                        handleChangeDate={handleChangeDate}
                    />
                    {error && <p className="error">{error}</p>}
                    {loading && <p>Loading...</p>}
                </>
            }

            main={
                <CalendarComponent
                    year={date.year}
                    month={date.month}
                    todoLists={todoLists}
                />
            }
        />
    );
};

export default Calendar;