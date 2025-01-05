import React, { useCallback, useEffect, useState } from "react";
import DiaryBlock from "../components/DiaryBlock/DiaryBlock";
import { nuetralDiary } from "../constants/diary";
import { getDiary } from "../services/api";
import { useParams } from "react-router-dom";
import { formatDate } from "../utils/date";
import ContentLayout from "../components/layouts/ContentLayout";

const Diary = () => {
    const { year, month, day } = useParams();

    const [diary, setDiary] = useState({...nuetralDiary, date: formatDate(year, month, day)});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchDiary = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await getDiary(year, month, day);
            if (response?.data) {
                setDiary({...response.data});
            } else {
                setError("日記が存在しません");
            }
        } catch (err) {
            console.error("Error fetching diary:", err);
            setError("Failed to fetch diary. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [year, month, day]);

    useEffect(() => {
        fetchDiary();
    }, [fetchDiary]);

    return (
        <ContentLayout
            header={
                <>
                    {loading && <p>Loading...</p>}
                </>
            }

            main={
                <>
                    {error ? <p>{error}</p> : (
                        <DiaryBlock
                            height="650px"
                            preDiary={diary}
                            handlers={null}
                            isDisabled={true}
                            loading={loading}
                        />
                    )}
                </>
            }
        />
    );
};

export default Diary;