import { memo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReadDiary.css';
import axiosInstance from '../../api/axiosConfig';
import info from '../../images/info.svg';
import { MetaInfo, SubTextSelector, SubTextContent, SearchForm, AddDiaryButton, stringToRegex } from './DiaryComponents';
import { DAYS_OF_WEEK } from '../../utils/dateUtils';

const MemoizedMetaInfo = memo(MetaInfo);
const MemoizedSubTextSelector = memo(SubTextSelector);
const MemoizedSubTextContent = memo(SubTextContent);
const MemoizedSearchForm = memo(SearchForm);
const MemoizedAddDiaryButton = memo(AddDiaryButton);

const ReadDiary = () => {
    const navigate = useNavigate();
    const [diaries, setDiaries] = useState([]);
    const [searchDiaries, setSearchDiaries] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const [selectSubText, setSelectSubText] = useState([]);
    const [isExpandedMenu, setIsExpandedMenu] = useState(false);
    const [isExpandedMetaInfo, setIsExpandedMetaInfo] = useState([]);
    const [isReverseOrder, setIsReverseOrder] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDiaries = async () => {
            try {
                const response = await axiosInstance.get('/circadian/api/diary/');
                if (response.data.error) {
                    if (response.data.error === 'NotFound') {
                        setError("まだ日記が存在しません。日記を追加しましょう！")
                    }
                } else {
                    setDiaries(response.data)
                }
            } catch (error) {
                setError("エラーが発生しました。");
            }
            setIsLoading(false);
        };
        fetchDiaries();
    }, []);

    useEffect(() => {
        if (diaries){
            setSearchDiaries(diaries);
            setSelectSubText(Array(diaries.length).fill('progress'));
            setIsExpandedMetaInfo(Array(diaries.length).fill(false));
        } else {

        }
    }, [diaries]);

    const handleChangeSubTextSelector = (index) => (event) => {
        const newSelectSubText = [...selectSubText];
        newSelectSubText[index] = event.target.value;
        setSelectSubText(newSelectSubText);
    };

    const handleMetaInfoToggle = (index) => {
        const newIsExpandedMetaInfo = isExpandedMetaInfo.map((expanded, idx) => idx === index ? !expanded : false);
        setIsExpandedMetaInfo(newIsExpandedMetaInfo);
    };

    const handleSubmitSearch = (event) => {
        event.preventDefault();

        const regex = stringToRegex(searchInput);
        const filteredDiaries = diaries.filter(diary => (
            [
                diary.user,
                diary.sequence_number.toString(),
                diary.date,
                diary.main_text,
                diary.progress,
                diary.memo,
                ...diary.todos,
                ...diary.files.map(file => file.fileName),
                diary.created_at,
                diary.updated_at,
                diary.front_id,
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
        <div className='readDiary' id="contentContainer">
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
                <div id='diariesContainer'>
                    <ul>
                        <MemoizedAddDiaryButton navigate={navigate} />

                        {displayedDiaries.map((diary, index) => (
                            <li className='diary-block' key={index}>
                                <div className='diary-container'>
                                    <div className='date-container'>
                                        {
                                            diary.date ? <>
                                                <span className='year'><span>{diary.date.split('-')[0]}</span>年</span>
                                                <span className='month'><span>{diary.date.split('-')[1]}</span>月</span>
                                                <span className='day'><span>{diary.date.split('-')[2]}</span>日</span>
                                            </> : null
                                        }
                                        <span className='day-of-week' >
                                            ({DAYS_OF_WEEK[new Date(diary.date).getDay()]})
                                        </span>
                                        <span className='meta-info-container'>
                                            <img src={info} alt='infomation' onClick={() => handleMetaInfoToggle(index)} />
                                            <MemoizedMetaInfo diary={diary} isExpanded={isExpandedMetaInfo[index]} navigate={navigate} />
                                        </span>
                                    </div>

                                    <div className='main-text-container'>
                                        <div className='mainText'>{diary.main_text}</div>
                                    </div>

                                    <MemoizedSubTextSelector
                                        index={index}
                                        selectedValue={selectSubText[index]}
                                        onChange={handleChangeSubTextSelector(index)}
                                    />

                                    <div className='sub-text-content'>
                                        <MemoizedSubTextContent  type={selectSubText[index]} diary={diary} />
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>}
        </div>
    )
};

export default ReadDiary;