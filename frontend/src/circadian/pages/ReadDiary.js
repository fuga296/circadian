import React, { useCallback, useContext, useEffect, useState } from "react";

import ContentLayout from "../components/Layouts/ContentLayout";
import DiaryBlock from "../components/DiaryBlock/DiaryBlock";

import { DiariesContext } from "../contexts/DiariesContext";
import { DiariesExistenceContext } from "../contexts/DiariesExistenceContext";

import { getDiaryBlocks } from "../services/api";
import { removeDuplicate } from "../utils/diary";
import { updateState } from "../utils/universal";

import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { handleError } from "../utils/error";


const ReadDiary = () => {

    const { diaries, setDiaries } = useContext(DiariesContext);
    const { diariesExistence } = useContext(DiariesExistenceContext);

    const [diaryState, setDiaryState] = useState({
        isDisabled: true,
        isHistory: false,
        loading: false,
        error: null,
    });
    const [pageAdditionalTimes, setPageAdditionalTimes] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [isDiariesMax, setIsDiariesMax] = useState(false);


    const handleUpdateDiaryState = updateState(setDiaryState);


    const filterMatchingDiaries = useCallback(() => {
        const startIndex = pageCount * 10;
        const endIndex = diariesExistence.length;

        for (let i = startIndex; i < endIndex; i += 10) {
            const rangeEnd = Math.min(endIndex - i, 10);

            for (let j = 0; j < rangeEnd; j++) {
                const currentDate = diariesExistence[i + j]?.date;

                if (currentDate && currentDate !== diaries[i + j]?.date) {
                    setPageCount(Math.floor(i / 10) + 1);
                    setDiaries(prev => removeDuplicate([...prev, ...diaries.slice(startIndex, i)], "date"));
                    return null;
                };
            };
        };

        setDiaries(prev => removeDuplicate([...prev, ...diaries], "date"));
        setPageCount(Math.floor(diariesExistence / 10) + 1);
        setIsDiariesMax(true);
    }, [diaries, pageCount, diariesExistence, setDiaries]);

    const fetchDiaries = useCallback(async () => {
        if (isDiariesMax || diaryState.loading) return;

        handleUpdateDiaryState('loading', true);
        handleUpdateDiaryState('error', null);

        try {
            const response = await getDiaryBlocks(pageCount + 1);
            if (response?.data) {
                setDiaries(prev => removeDuplicate([...prev, ...response.data], "date"));
                setPageCount(prev => prev + 1);
                if (response.data.length < 10) {
                    setIsDiariesMax(true);
                }
            } else {
                setIsDiariesMax(true);
            }
        } catch (err) {
            console.log(handleError(err));
            if (err.code === "ERR_NETWORK") {
                handleUpdateDiaryState('error', "ネットワークにつながっていません。");
            } else if (err.code === "ERR_BAD_RESPONSE") {
                handleUpdateDiaryState('error', "ネットワークにつながっていません。");
            } else if (err.code === "ECONNABORTED") {
                handleUpdateDiaryState('error', "時間を超過しました。");
            } else {
                handleUpdateDiaryState('error', "エラーが発生しました。時間をおいてやり直してください。");
            }
        } finally {
            filterMatchingDiaries();
            handleUpdateDiaryState('loading', false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDiariesMax, pageCount, diariesExistence])


    useEffect(() => {
        if (diariesExistence.length > 0) {
            fetchDiaries();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageAdditionalTimes, diariesExistence.length]);

    useInfiniteScroll({ loading: diaryState.loading, isDiariesMax, incrementPageNumber: () => setPageAdditionalTimes(prev => prev + 1) });

    return (
        <ContentLayout
            header={
                <></>
            }

            main={
                <>
                    {
                        diaries.map((diary, index) => (
                            <DiaryBlock
                                diaryInfo={diary}
                                handlers={null}
                                diaryState={diaryState}
                                key={index}
                            />
                        ))
                    }
                    {diaryState.loading && <div className="circle-spin-1"></div>}
                    {diaryState.error && <p className="error">{diaryState.error}</p>}
                </>
            }
        />
    );
};

export default ReadDiary;