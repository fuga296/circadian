import React, { useCallback, useEffect, useState } from "react";
import DiaryBlock from "../components/DiaryBlock/DiaryBlock";
import { createDiary, editDiary, getDiary } from "../services/api";
import { formatDate } from "../utils/date";
import { nuetralDiary } from "../constants/diary";
import ContentLayout from "../components/layouts/ContentLayout";

const AddDiary = () => {
    const today = new Date();
    const formattedDate = formatDate(today.getFullYear(), today.getMonth() + 1, today.getDate());

    const [date, setDate] = useState(formattedDate);
    const [diary, setDiary] = useState({...nuetralDiary, date: formattedDate});
    const [isNewDiary, setIsNewDiary] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchDiary = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [year, month, day] = date.split('-');
            const response = await getDiary(year, month, day);
            if (response?.data) {
                setDiary({ ...nuetralDiary, ...response.data });
                setIsNewDiary(false);
            } else {
                setDiary({...nuetralDiary, date});
                setIsNewDiary(true);
            }
        } catch (err) {
            console.error("Error fetching diary:", err);
            setError("Failed to fetch diary. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [date]);

    useEffect(() => {
        fetchDiary();
    }, [fetchDiary]);

    const handlers = {
        handleChangeDate: (newDate) => setDate(newDate),

        handleChangeText: (newText) => setDiary((prev) => ({
            ...prev,
            text: newText,
        })),

        handleChangeSubText: (newSubText) => setDiary((prev) => ({
            ...prev,
            ...newSubText,
        })),

        handleSubmit: async (event) => {
            event.preventDefault();
            setLoading(true);
            setError(null);
            try {
                if (isNewDiary) {
                    await createDiary(diary)
                } else {
                    const [year, month, day] = date.split('-');
                    await editDiary(year, month, day, diary)
                }
            } catch (err) {
                console.error("Error creating or epdating diary:", err);
                setError("Failed to save diary. Please try again.");
            } finally {
                setLoading(false);
                window.location.reload();
            }
        },
    };

    return (
        <ContentLayout
            header={
                <>
                    {error && <p className="error">{error}</p>}
                    {loading && <p>Loading...</p>}
                </>
            }

            main={
                <>
                    <DiaryBlock
                        height="650px"
                        preDiary={diary}
                        handlers={handlers}
                        isDisabled={false}
                        loading={loading}
                    />
                </>
            }
        />
    );
};

export default AddDiary;