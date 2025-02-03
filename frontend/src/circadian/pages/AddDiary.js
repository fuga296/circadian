import React, { useCallback, useContext, useEffect, useState } from "react";

import ContentLayout from "../components/Layouts/ContentLayout";
import DiaryBlock from "../components/DiaryBlock/DiaryBlock";

import { createDiary, editDiary, getDiary } from "../services/api";
import { formatDate } from "../utils/date";
import { nuetralDiary } from "../constants/diary";
import { removeDuplicate } from "../utils/diary";
import { updateState } from "../utils/universal";

import { DiariesExistenceContext } from "../contexts/DiariesExistenceContext";
import { DiariesContext } from "../contexts/DiariesContext";


const AddDiary = () => {
    const today = new Date();
    const formattedDate = formatDate(today.getFullYear(), today.getMonth() + 1, today.getDate());

    const { setDiaries } = useContext(DiariesContext);
    const { diariesExistence } = useContext(DiariesExistenceContext);

    const [date, setDate] = useState(formattedDate);
    const [diary, setDiary] = useState({...nuetralDiary, date: formattedDate});
    const [diaryState, setDiaryState] = useState({
        isDisabled: false,
        isHistory: false,
        loading: false,
        error: null,
    });
    const [inputDiaries, setInputDiaries] = useState([]);

    const handleUpdateDiaryState = updateState(setDiaryState);

    const fetchDiary = useCallback(async () => {
        handleUpdateDiaryState('loading', true);
        handleUpdateDiaryState('error', null);

        try {
            const [year, month, day] = date.split('-');
            const response = await getDiary(year, month, day);
            if (response?.data) {
                setDiary({ ...nuetralDiary, ...response.data });
                setInputDiaries(prev => removeDuplicate([ ...prev, { ...nuetralDiary, ...response.data } ], "date"));
            } else {
                setDiary({...nuetralDiary, date});
                setInputDiaries(prev => removeDuplicate([ ...prev, { ...nuetralDiary, date } ], "date"));
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
        const inputDiaryExistsAlready = inputDiaries.find((diary) => diary.date === date);
        if (inputDiaryExistsAlready) {
            setDiary(inputDiaryExistsAlready);
        } else {
            fetchDiary();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchDiary, date]);

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

            const diaryExistsAlready = diariesExistence.find((diary) => diary.date === date);

            try {
                if (!diaryExistsAlready) {
                    await createDiary(diary);
                    setDiaries(prev => removeDuplicate([ ...prev, diary ], "date"));
                } else {
                    const [year, month, day] = date.split('-');
                    await editDiary(year, month, day, diary);
                    setDiaries(prev => removeDuplicate([ ...prev, diary ], "date"));
                }
            } catch (err) {
                console.error("Error creating or epdating diary:", err);
                handleUpdateDiaryState('error', "Failed to save diary. Please try again.");
            } finally {
                handleUpdateDiaryState('loading', false);
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