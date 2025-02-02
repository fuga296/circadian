import React, { useCallback, useContext, useEffect, useState } from "react";
import { getDiaryList } from "../services/api";
import { removeDuplicate } from "../utils/diary";
import DiaryList from "../components/DiaryList/DiaryList";
import ContentLayout from "../components/Layouts/ContentLayout";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { DiariesContext } from "../contexts/DiariesContext";
import { DiariesExistenceContext } from "../contexts/DiariesExistenceContext";

const ReadList = () => {

    const { diaries } = useContext(DiariesContext);
    const { diariesExistence } = useContext(DiariesExistenceContext);

    const [diaryList, setDiaryList] = useState(
        diaries.map(({ sequence_number, date, created_at, text }) => (
            { sequence_number, date, created_at, text }
        ))
    );
    const [pageAdditionalTimes, setPageAdditionalTimes] = useState(1);
    const [pageNumber, setPageNumber] = useState(0);
    const [isDiariesMax, setIsDiariesMax] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const filterDiaryListInfo = diaries => {
        return (
            diaries.map(({ sequence_number, date, created_at, text }) => (
                { sequence_number, date, created_at, text }
            ))
        );
    };


    const filterMatchingDiaryList = useCallback(() => {
        const pageSize = 30;
        const startIndex = pageNumber * pageSize;
        const endIndex = diariesExistence.length;

        for (let i = startIndex; i < endIndex; i += pageSize) {
            const rangeEnd = Math.min(endIndex - i, pageSize);

            for (let j = 0; j < rangeEnd; j++) {
                const currentDate = diariesExistence[i + j]?.date;

                if (currentDate && currentDate !== diaries[i + j]?.date) {
                    setPageNumber(Math.floor(i / pageSize) + 1);
                    setDiaryList(prev => removeDuplicate([...prev, ...filterDiaryListInfo(diaries.slice(startIndex, i))], "date"));
                    return null;
                };
            };
        };

        setDiaryList(prev => filterDiaryListInfo(removeDuplicate([...prev, ...diaries]), "date"));
        setPageNumber(Math.floor(diariesExistence / 10) + 1);
        setIsDiariesMax(true);
    }, [diaries, pageNumber, diariesExistence, setDiaryList]);


    const fetchDiaryList = useCallback(async () => {
        if (isDiariesMax || loading) return;

        setLoading(true);
        setError(null);

        try {
            const response = await getDiaryList(pageNumber + 1);
            if (response?.data) {
                setDiaryList(prev => removeDuplicate([...prev, ...response.data], "date"));
                setPageNumber(prev => prev + 1);
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
            filterMatchingDiaryList();
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDiariesMax, pageNumber, diariesExistence]);

    useEffect(() => {
        if (diariesExistence.length > 0) {
            fetchDiaryList();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageAdditionalTimes, fetchDiaryList]);

    useInfiniteScroll({ loading, isDiariesMax, incrementPageNumber: () => setPageAdditionalTimes((prev) => prev + 1) });

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