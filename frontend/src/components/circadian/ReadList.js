import { memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReadList.css';
import axiosInstance from '../../api/axiosConfig';
import { SearchForm, AddDiaryButton, stringToRegex } from './DiaryComponents';

const MemoizedSearchForm = memo(SearchForm);
const MemoizedAddDiaryButton = memo(AddDiaryButton);

const ReadList = () => {
    const navigate = useNavigate();
    const [diaries, setDiaries] = useState([]);
    const [searchDiaries, setSearchDiaries] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [isExpandedMenu, setIsExpandedMenu] = useState(false);
    const [isReverseOrder, setIsReverseOrder] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDiaries = async () => {
            try {
                const response = await axiosInstance.get(`/circadian/api/diary/`);
                if (response.data.error) {
                    if (response.data.error === 'NotFound') {
                        setError("まだ日記が存在しません。日記を追加しましょう！")
                    }
                } else {
                    setDiaries(response.data)
                }
            } catch (error) {
                setError("エラーが発生しました");
            }
            setIsLoading(false);
        };
        fetchDiaries();
    }, []);

    useEffect(() => {
        setSearchDiaries(diaries);
    }, [diaries]);

    const handleSubmitSearch = (event) => {
        event.preventDefault();

        const regex = stringToRegex(searchInput);
        const filteredDiaries = diaries.filter(diary => (
            [
                diary.sequence_number.toString(),
                diary.date,
                diary.main_text.slice(0,44),
                diary.created_at,
            ].some(content => {
                if (regex) {
                    return regex.test(content);
                } else {
                    return content.includes(searchInput);
                }
            })
        ));

        setSearchDiaries(filteredDiaries);
    };

    const displayedDiaries = isReverseOrder
    ? [...searchDiaries].reverse()
    : searchDiaries;

    return (
        <div className='readList' id="contentContainer">
            <header>
            </header>
            {error ? <main id='errorMessage'>{error}</main> :
            isLoading ? <main id='loadingMessage'>Loading…</main> :
            <main>
                <MemoizedSearchForm
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    handleSubmitSearch={handleSubmitSearch}
                    setIsExpandedMenu={setIsExpandedMenu}
                    isExpandedMenu={isExpandedMenu}
                    isReverseOrder={isReverseOrder}
                    setIsReverseOrder={setIsReverseOrder}
                    navigate={navigate}
                />
                <div id='listContainer'>
                    <ul>
                        <MemoizedAddDiaryButton navigate={navigate} />

                        {
                            displayedDiaries.map((diary, index) => (
                                <li className='diary-list' key={index} onClick={() => {navigate(`/circadian/diary/${diary.date}`)}}>
                                    <div className='sequence-number'>No.{diary.sequence_number}</div>
                                    <div className='date'>{diary.date.replace(/-/g, "/")}</div>
                                    <div className='short-main-text'>{diary.main_text.slice(0, 44)}{diary.main_text ? diary.main_text.length >= 44 ? "…" : "" : "内容がありません"}</div>
                                    <div className='meta'>作成:{diary.updated_at.split('T')[0]} {diary.updated_at.split('T')[1]}</div>
                                </li>
                            ))
                        }
                    </ul>
                </div>
            </main>}
        </div>
    )
}

export default ReadList;