import React, { useCallback, useEffect, useState } from "react";
import { getDiaryList } from "../services/api";
import { removeDuplicate } from "../utils/diary";
import DiaryList from "../components/DiaryList/DiaryList";
import ContentLayout from "../components/layouts/ContentLayout";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

const ReadList = () => {

    const [diaryList, setDiaryList] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [isDiariesMax, setIsDiariesMax] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchDiaryList = useCallback(async () => {
        if (isDiariesMax || loading) return;

        setLoading(true);
        setError(null);

        try {
            const response = await getDiaryList(pageNumber);
            if (response?.data) {
                setDiaryList(prev => removeDuplicate([...prev, ...response.data], "date"));
                if (response.data.length < 30) {
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
    }, [isDiariesMax, pageNumber]);

    useEffect(() => {
        fetchDiaryList();
    }, [pageNumber, fetchDiaryList]);

    useInfiniteScroll({ loading, isDiariesMax, incrementPageNumber: () => setPageNumber((prev) => prev + 1) });

    return (
        <ContentLayout
            header={
                <></>
            }

            main={
                <>
                    {diaryList.map((diary, index) => {
                        return(
                        <DiaryList
                            sequenceNum={diary.sequence_number}
                            diaryDate={(diary.date)}
                            createAt={diary.created_at}
                            key={index}
                        >{diary.text}</DiaryList>
                    )})}
                    {loading && <div className="circle-spin-1"></div>}
                    {error && <p className="error">{error}</p>}
                </>
            }
        />
    );
};

export default ReadList;