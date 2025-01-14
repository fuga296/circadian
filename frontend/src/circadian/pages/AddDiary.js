import React, { useCallback, useEffect, useState } from "react";
import DiaryBlock from "../components/DiaryBlock/DiaryBlock";
import { createDiary, editDiary, getDiary } from "../services/api";
import { formatDate } from "../utils/date";
import { nuetralDiary } from "../constants/diary";
import ContentLayout from "../components/Layouts/ContentLayout";
import { updateState } from "../utils/universal";

const AddDiary = () => {
    const today = new Date();
    const formattedDate = formatDate(today.getFullYear(), today.getMonth() + 1, today.getDate());

    const [date, setDate] = useState(formattedDate);
    const [diary, setDiary] = useState({...nuetralDiary, date: formattedDate});
    const [diaryState, setDiaryState] = useState({
        isDisabled: false,
        isHistory: false,
        loading: false,
        error: null,
    });
    const [isNewDiary, setIsNewDiary] = useState(true);

    const handleUpdateDiaryState = updateState(setDiaryState);

    const fetchDiary = useCallback(async () => {
        handleUpdateDiaryState('loading', true);
        handleUpdateDiaryState('error', null);

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
            handleUpdateDiaryState('error', "Failed to fetch diary. Please try again later.");
        } finally {
            handleUpdateDiaryState('loading', false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

            handleUpdateDiaryState('loading', true);
            handleUpdateDiaryState('error', null);

            try {
                if (isNewDiary) {
                    await createDiary(diary)
                } else {
                    const [year, month, day] = date.split('-');
                    await editDiary(year, month, day, diary)
                }
            } catch (err) {
                console.error("Error creating or epdating diary:", err);
                handleUpdateDiaryState('error', "Failed to save diary. Please try again.");
            } finally {
                handleUpdateDiaryState('loading', false);
                window.location.reload();
            }
        },
    };

    return (
        <ContentLayout
            header={
                <>
                    {diaryState.error && <p className="error">{diaryState.error}</p>}
                    {diaryState.loading && <p>Loading...</p>}
                </>
            }

            main={
                <>
                    <DiaryBlock
                        diaryInfo={diary}
                        handlers={handlers}
                        diaryState={diaryState}
                    />
                </>
            }
        />
    );
};

export default AddDiary;