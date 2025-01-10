import React, { useCallback, useEffect, useState } from "react";
import DiaryBlock from "../components/DiaryBlock/DiaryBlock";
import { getDiaryBlocks } from "../services/api";
import { removeDuplicate } from "../utils/diary";
import ContentLayout from "../components/layouts/ContentLayout";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { updateState } from "../utils/universal";

const ReadDiary = () => {

    const [diaries, setDiaries] = useState([]);
    const [diaryState, setDiaryState] = useState({
        isDisabled: true,
        isHistory: false,
        loading: false,
        error: null,
    });
    const [pageNumber, setPageNumber] = useState(1);
    const [isDiariesMax, setIsDiariesMax] = useState(false);

    const handleUpdateDiaryState = updateState(setDiaryState);

    const fetchDiaries = useCallback(async () => {
        if (isDiariesMax || diaryState.loading) return;

        handleUpdateDiaryState('loading', true);
        handleUpdateDiaryState('error', null);

        try {
            const response = await getDiaryBlocks(pageNumber);
            if (response?.data) {
                setDiaries(prev => removeDuplicate([...prev, ...response.data], "date"));
                if (response.data.length < 10) {
                    setIsDiariesMax(true);
                }
            } else {
                setIsDiariesMax(true);
            }
        } catch (err) {
            console.error("Error fetching diary:", err);
            handleUpdateDiaryState('error', "Failed to fetch diary. Please try again later.");
        } finally {
            handleUpdateDiaryState('loading', false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDiariesMax, pageNumber])

    useEffect(() => {
        fetchDiaries();
    }, [pageNumber, fetchDiaries]);

    useInfiniteScroll({ loading: diaryState.loading, isDiariesMax, incrementPageNumber: () => setPageNumber((prev) => prev + 1) });

    return (
        <ContentLayout
            header={
                <></>
            }

            main={
                <>
                    {diaries.map((diary, index) => (
                        <DiaryBlock
                            diaryInfo={diary}
                            handlers={null}
                            diaryState={diaryState}
                            key={index}
                        />
                    ))}
                    {diaryState.loading && <div className="circle-spin-1"></div>}
                    {diaryState.error && <p className="error">{diaryState.error}</p>}
                </>
            }
        />
    );
};

export default ReadDiary;