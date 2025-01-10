import React, { useCallback, useEffect, useState } from "react";
import ContentLayout from "../components/layouts/ContentLayout";
import History from "../components/History/History";
import { getAllDiaryHistory } from "../services/api";
import { removeDuplicate } from "../utils/diary";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import DiaryBlock from "../components/DiaryBlock/DiaryBlock";
import { updateState } from "../utils/universal";

const AllDiaryHistory = () => {

    const [diaryHistory, setDiaryHistory] = useState([]);
    const [diaryHistoryState, setDiaryHistoryState] = useState({
        isDisabled: true,
        isHistory: true,
        loading: false,
        error: null,
    });
    const [pageNumber, setPageNumber] = useState(1);
    const [isDiaryHistoryMax, setIsDiaryHistoryMax] = useState(false);

    const handleUpdateDiaryHistoryState = updateState(setDiaryHistoryState);

    const fetchDiaryHistory = useCallback(async () => {
        if (isDiaryHistoryMax || diaryHistoryState.loading) return;

        handleUpdateDiaryHistoryState('loading', true);
        handleUpdateDiaryHistoryState('error', null);

        try {
            const response = await getAllDiaryHistory(pageNumber);
            if (response?.data) {
                setDiaryHistory(prev => removeDuplicate([...prev, ...response.data], "history_id"));
                if (response.data.length < 10) {
                    setIsDiaryHistoryMax(true);
                }
            } else {
                setIsDiaryHistoryMax(true);
            }
        } catch (err) {
            console.error("Error fetching diary:", err);
            handleUpdateDiaryHistoryState('error', "Failed to fetch diary. Please try again later.");
        } finally {
            handleUpdateDiaryHistoryState('loading', false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDiaryHistoryMax, pageNumber]);

    useEffect(() => {
        fetchDiaryHistory();
    }, [pageNumber, fetchDiaryHistory]);

    useInfiniteScroll({ loading: diaryHistoryState.loading, isDiariesMax: isDiaryHistoryMax, incrementPageNumber: () => setPageNumber((prev) => prev + 1) });

    return (
        <ContentLayout
            header={<h1>履歴</h1>}

            main={
                <>
                    {diaryHistory.map((diary, index) => (
                        <History
                            message={`${diary.diary_date}の日記を${diary.action}しました`}
                            history={
                                <DiaryBlock
                                    diaryInfo={diary}
                                    handlers={null}
                                    diaryState={diaryHistoryState}
                                    key={index}
                                />
                            }
                        />
                    ))}
                    {diaryHistoryState.loading && <div className="circle-spin-1"></div>}
                    {diaryHistoryState.error && <p className="error">{diaryHistoryState.error}</p>}
                </>
            }
        />
    );
};

export default AllDiaryHistory;