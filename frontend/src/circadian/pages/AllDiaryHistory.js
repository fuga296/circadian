import React, { useCallback, useEffect, useState } from "react";
import ContentLayout from "../components/layouts/ContentLayout";
import History from "../components/History/History";
import { getAllDiaryHistory } from "../services/api";
import { removeDuplicate } from "../utils/diary";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import DiaryBlock from "../components/DiaryBlock/DiaryBlock";

const AllDiaryHistory = () => {

    const [diaryHistory, setDiaryHistory] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [isDiaryHistoryMax, setIsDiaryHistoryMax] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchDiaryHistory = useCallback(async () => {
        if (isDiaryHistoryMax || loading) return;

        setLoading(true);
        setError(null);

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
            setError("Failed to fetch diary. Please try again later.");
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDiaryHistoryMax, pageNumber]);

    useEffect(() => {
        fetchDiaryHistory();
    }, [pageNumber, fetchDiaryHistory]);

    useInfiniteScroll({ loading, isDiariesMax: isDiaryHistoryMax, incrementPageNumber: () => setPageNumber((prev) => prev + 1) });

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
                                    height="500px"
                                    preDiary={diary}
                                    handlers={null}
                                    key={index}
                                    isDisabled={true}
                                    isHistory={true}
                                    loading={loading}
                                />
                            }
                        />
                    ))}
                    {loading && <div className="circle-spin-1"></div>}
                    {error && <p className="error">{error}</p>}
                </>
            }
        />
    );
};

export default AllDiaryHistory;