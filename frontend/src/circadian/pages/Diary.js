import React, { useCallback, useEffect, useState } from "react";
import DiaryBlock from "../components/DiaryBlock/DiaryBlock";
import { nuetralDiary } from "../constants/diary";
import { getDiary } from "../services/api";
import { useParams } from "react-router-dom";
import { formatDate } from "../utils/date";
import ContentLayout from "../components/Layouts/ContentLayout";
import { updateState } from "../utils/universal";

const Diary = () => {
    const { year, month, day } = useParams();

    const [diary, setDiary] = useState({...nuetralDiary, date: formatDate(year, month, day)});
    const [diaryState, setDiaryState] = useState({
        isDisabled: true,
        isHistory: false,
        loading: false,
        error: null,
    });
    const handleUpdateDiaryState = updateState(setDiaryState);

    const fetchDiary = useCallback(async () => {
        handleUpdateDiaryState('loading', true);
        handleUpdateDiaryState('error', null);

        try {
            const response = await getDiary(year, month, day);
            if (response?.data) {
                setDiary({...response.data});
            } else {
                handleUpdateDiaryState('error', "日記が存在しません");
            }
        } catch (err) {
            console.error("Error fetching diary:", err);
            handleUpdateDiaryState('error', "Failed to fetch diary. Please try again later.");
        } finally {
            handleUpdateDiaryState('loading', false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [year, month, day]);

    useEffect(() => {
        fetchDiary();
    }, [fetchDiary]);

    return (
        <ContentLayout
            header={
                <>
                    {diaryState.loading && <p>Loading...</p>}
                </>
            }

            main={
                <>
                    {diaryState.error ? <p>{diaryState.error}</p> : (
                        <DiaryBlock
                            diaryInfo={diary}
                            handlers={null}
                            diaryState={diaryState}
                        />
                    )}
                </>
            }
        />
    );
};

export default Diary;