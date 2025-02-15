import React, { useCallback, useContext, useEffect, useState } from "react";

import ContentLayout from "../components/Layouts/ContentLayout";
import DiaryBlock from "../components/DiaryBlock/DiaryBlock";

import { DiariesContext } from "../contexts/DiariesContext";
import { DiariesExistenceContext } from "../contexts/DiariesExistenceContext";

import { getDiaryBlocks } from "../services/api";
import { removeDuplicate, sortDiaries } from "../utils/diary";
import { updateState } from "../utils/universal";

import useInfiniteScroll from "../hooks/useInfiniteScroll";
import { handleError } from "../utils/error";
import SearchBlock from "../components/SearchBlock/SearchBlock";


const ReadDiary = () => {

    const { diaries, setDiaries } = useContext(DiariesContext);
    const { diariesExistence } = useContext(DiariesExistenceContext);

    const [searchText, setSearchText] = useState("");
    const [diaryState, setDiaryState] = useState({
        isDisabled: true,
        isHistory: false,
        loading: false,
        error: null,
    });
    const [displayedDiaries, setDisplayedDiaries] = useState([]);
    const [pageAdditionalTimes, setPageAdditionalTimes] = useState(1);
    const [pageNumber, setPageNumber] = useState(0);
    const [isCommand, setIsCommand] = useState(false);
    const [isDiariesMax, setIsDiariesMax] = useState(false);
    const [isSearched, setIsSearched] = useState(false);
    const [isSearchedDiariesMax, setIsSearchedDiariesMax] = useState(false);
    const [searchPageNumber, setSearchPageNumber] = useState(0);


    const handleUpdateDiaryState = updateState(setDiaryState);


    const filterMatchingDiaries = useCallback(() => {
        const pageSize = 10;
        const startIndex = pageNumber * pageSize;
        const endIndex = diariesExistence.length;

        for (let i = startIndex; i < endIndex; i += pageSize) {
            const rangeEnd = Math.min(endIndex - i, pageSize);

            for (let j = 0; j < rangeEnd; j++) {
                const currentDate = diariesExistence[i + j]?.date;

                if (currentDate && currentDate !== diaries[i + j]?.date) {
                    setPageNumber(Math.floor(i / pageSize) + 1);
                    setDiaries(prev => {
                        const newDiaries = removeDuplicate([...prev, ...diaries.slice(startIndex, i)], "date");
                        setDisplayedDiaries(newDiaries);
                        return newDiaries;
                    });
                    return
                };
            };
        };

        setDiaries(prev => {
            const newDiaries = removeDuplicate([ ...prev ], "date");
            setDisplayedDiaries(newDiaries);
            return newDiaries;
        });
        setPageNumber(Math.floor(diariesExistence / pageSize) + 1);
        setIsDiariesMax(true);
    }, [diaries, pageNumber, diariesExistence, setDiaries]);

    const fetchDiaries = useCallback(async () => {
        const newIsSearched = !!searchText;

        if (newIsSearched) {
            if (isSearchedDiariesMax || diaryState.loading) return;
        } else {
            if (isDiariesMax || diaryState.loading) return;
        }

        handleUpdateDiaryState('loading', true);
        handleUpdateDiaryState('error', null);

        try {
            const newDiariesAdder = (prev, data) => sortDiaries(removeDuplicate([...prev, ...data], "date"));
            if (newIsSearched) {
                const response = await getDiaryBlocks(searchPageNumber + 1, searchText, isCommand);
                const data = response?.data || [];

                if (data.length > 0) {
                    setDisplayedDiaries(prev => newDiariesAdder(searchPageNumber !== 0 ? prev : [], data));
                    setDiaries(prev => newDiariesAdder(prev, data));
                    setSearchPageNumber(prev => prev + 1);
                }

                if (data.length < 10) {
                    setIsSearchedDiariesMax(true);
                }
            } else {
                const response = await getDiaryBlocks(pageNumber + 1);
                const data = response?.data || [];

                if (data.length > 0) {
                    setDisplayedDiaries(prev => newDiariesAdder(prev, data));
                    setDiaries(prev => newDiariesAdder(prev, data));
                    setPageNumber(prev => prev + 1);
                }

                if (data.length < 10) {
                    setIsDiariesMax(true);
                }
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
            !newIsSearched && filterMatchingDiaries();
            handleUpdateDiaryState('loading', false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDiariesMax, pageNumber, isSearchedDiariesMax, searchPageNumber, searchText, isCommand, diariesExistence])


    useEffect(() => {
        if (diariesExistence.length > 0) {
            if (displayedDiaries.length === diariesExistence.length) return
            fetchDiaries();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageAdditionalTimes, diariesExistence.length]);

    useInfiniteScroll({
        loading: diaryState.loading,
        isDiariesMax: isSearched ? isSearchedDiariesMax : isDiariesMax,
        incrementPageNumber: () => setPageAdditionalTimes(prev => prev + 1),
    });


    const handleSearch = () => {
        setDisplayedDiaries([]);
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
                    {
                        displayedDiaries.map((diary, index) => (
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