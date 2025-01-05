import React, { useCallback, useEffect, useState } from "react";
import DiaryBlock from "../components/DiaryBlock/DiaryBlock";
import { getDiaryBlocks } from "../services/api";
import { removeDuplicate } from "../utils/diary";
import ContentLayout from "../components/layouts/ContentLayout";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

const ReadDiary = () => {

    const [diaries, setDiaries] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [isDiariesMax, setIsDiariesMax] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchDiaries = useCallback(async () => {
        if (isDiariesMax || loading) return;

        setLoading(true);
        setError(null);

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
            setError("Failed to fetch diary. Please try again later.");
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDiariesMax, pageNumber])

    useEffect(() => {
        fetchDiaries();
    }, [pageNumber, fetchDiaries]);

    useInfiniteScroll({ loading, isDiariesMax, incrementPageNumber: () => setPageNumber((prev) => prev + 1) });

    return (
        <ContentLayout
            header={
                <></>
            }

            main={
                <>
                    {diaries.map((diary, index) => (
                        <DiaryBlock
                            height="650px"
                            preDiary={diary}
                            handlers={null}
                            key={index}
                            isDisabled={true}
                            loading={loading}
                        />
                    ))}
                    {loading && <div className="circle-spin-1"></div>}
                    {error && <p className="error">{error}</p>}
                </>
            }
        />
    );
};

export default ReadDiary;