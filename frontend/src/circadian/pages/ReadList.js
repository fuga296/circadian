import React, { useCallback, useContext, useEffect, useState } from "react";

import ContentLayout from "../components/Layouts/ContentLayout";
import DiaryList from "../components/DiaryList/DiaryList";

import { DiariesContext } from "../contexts/DiariesContext";
import { DiariesExistenceContext } from "../contexts/DiariesExistenceContext";

import { getDiaryList } from "../services/api";
import { removeDuplicate, sortDiaries } from "../utils/diary";

import useInfiniteScroll from "../hooks/useInfiniteScroll";
import SearchBlock from "../components/SearchBlock/SearchBlock";


const ReadList = () => {

    const { diaries } = useContext(DiariesContext);
    const { diariesExistence } = useContext(DiariesExistenceContext);

    const [searchText, setSearchText] = useState("");
    const [diaryList, setDiaryList] = useState([]);
    const [error, setError] = useState(null);
    const [isCommand, setIsCommand] = useState(false);
    const [isDiariesMax, setIsDiariesMax] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pageAdditionalTimes, setPageAdditionalTimes] = useState(1);
    const [pageNumber, setPageNumber] = useState(0);
    const [isSearched, setIsSearched] = useState(false);
    const [isSearchedDiariesMax, setIsSearchedDiariesMax] = useState(false);
    const [searchPageNumber, setSearchPageNumber] = useState(0);


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
                    return
                };
            };
        };

        setDiaryList(prev => removeDuplicate([...prev, ...filterDiaryListInfo(diaries)], "date"));
        setPageNumber(Math.floor(diariesExistence / pageSize) + 1);
        setIsDiariesMax(true);
    }, [diaries, pageNumber, diariesExistence, setDiaryList]);


    const fetchDiaryList = useCallback(async () => {
        const newIsSearched = !!searchText;

        if (newIsSearched) {
            if (isSearchedDiariesMax || loading) return;
        } else {
            if (isDiariesMax || loading) return;
        }

        setLoading(true);
        setError(null);

        try {
            const newDiariesAdder = (prev, data) => sortDiaries(removeDuplicate([...prev, ...data], "date"));
            if (newIsSearched) {
                const response = await getDiaryList(pageNumber + 1, searchText, isCommand);
                const data = response?.data || [];

                if (data.length > 0) {
                    setDiaryList(prev => newDiariesAdder(searchPageNumber !== 0 ? prev : [], data));
                    setSearchPageNumber(prev => prev + 1);
                }

                if (data.length < 10) {
                    setIsSearchedDiariesMax(true);
                }
            } else {
                const response = await getDiaryList(pageNumber + 1);
                const data = response?.data || [];

                if (data.length > 0) {
                    setDiaryList(prev => newDiariesAdder(prev, data));
                    setPageNumber(prev => prev + 1);
                }

                if (data.length < 10) {
                    setIsDiariesMax(true);
                }
            }
        } catch (err) {
            console.error("Error fetching diary:", err);
            setError("Failed to fetch diary. Please try again later.");
        } finally {
            !newIsSearched && filterMatchingDiaryList();
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDiariesMax, pageNumber, isSearchedDiariesMax, searchPageNumber, searchText, isCommand, diariesExistence]);

    useEffect(() => {
        if (diariesExistence.length > 0) {
            if (diaryList.length === diariesExistence.length) return
            fetchDiaryList();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageAdditionalTimes, diariesExistence.length]);

    useInfiniteScroll({
        loading: loading,
        isDiariesMax: isSearched ? isSearchedDiariesMax : isDiariesMax,
        incrementPageNumber: () => setPageAdditionalTimes(prev => prev + 1),
    });

    const handleSearch = () => {
        setDiaryList([]);
        setSearchPageNumber(0);
        setIsSearchedDiariesMax(false);
        setIsSearched(!!searchText);
        setPageAdditionalTimes(prev => prev + 1);
    };

    return (
        <ContentLayout
            header={
                <>
                    <SearchBlock
                        setCommond={setSearchText}
                        handleSearch={handleSearch}
                        handleChangeIsCommand={()=>setIsCommand(prev=>!prev)}
                    />
                </>
            }

            main={
                <>
                    {sortDiaries(diaryList).map((diary, index) => {
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