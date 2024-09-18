import { memo, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Diary.css';
import info from '../../images/info.svg'
import axiosInstance from '../../api/axiosConfig';
import { MetaInfo, SubTextSelector, SubTextContent } from './DiaryComponents';
import { DAYS_OF_WEEK } from '../../utils/dateUtils';

const MemoizedMetaInfo = memo(MetaInfo);
const MemoizedSubTextSelector = memo(SubTextSelector);
const MemoizedSubTextContent = memo(SubTextContent);

function ReadDiary() {
    const navigate = useNavigate();
    const { date } = useParams();
    const [diary, setDiary] = useState({});
    const [selectSubText, setSelectSubText] = useState('progress');
    const [isExpandedMetaInfo, setIsExpandedMetaInfo] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDiaries = async () => {
            try {
                const response = await axiosInstance.get(`/circadian/api/diary/${date}/`);
                if (response.data.error) {
                    if (response.data.error === 'NotFound') {
                        setError("まだ日記が存在しません。日記を追加しましょう！")
                    }
                } else {
                    setDiary(response.data)
                }
            } catch (error) {
                setError("エラーが発生しました")
            }
            setIsLoading(false);
        };
        fetchDiaries();
    }, [date]);

    const handleChangeSubTextSelector = (event) => {
        setSelectSubText(event.target.value);
    }

    return (
        <div id="contentContainer">
            <header>
            </header>
            {error ? <main id='errorMessage'>{error}</main> :
            isLoading ? <main id='loadingMessage'>Loading…</main> :
            <main>
                <div id='diaryBlock'>
                    <div id='diaryContainer'>
                        <div id='dateContainer'>
                            {diary.date ? <><span className='year'><span>{diary.date.split('-')[0]}</span>年</span>
                            <span className='month'><span>{diary.date.split('-')[1]}</span>月</span>
                            <span className='day'><span>{diary.date.split('-')[2]}</span>日</span></> : <span></span>}
                            <span id='dayOfWeek' >({DAYS_OF_WEEK[new Date(diary.date).getDay()]})</span>
                            <div id='metaInfoContainer'>
                                <img src={info} alt='infomation' onClick={() => {
                                    setIsExpandedMetaInfo(!isExpandedMetaInfo);
                                }} />
                                <MemoizedMetaInfo isExpanded={isExpandedMetaInfo} diary={diary} navigate={navigate} />
                            </div>
                        </div>

                        <div id='mainTextContainer'>
                            <div id='mainText'>
                                {diary.main_text}
                            </div>
                        </div>

                        <MemoizedSubTextSelector index={0} selectedValue={selectSubText} onChange={handleChangeSubTextSelector} />

                        <div id='subTextContainer'>
                            <MemoizedSubTextContent type={selectSubText} diary={diary} />
                        </div>
                    </div>
                </div>
            </main>}
        </div>
    )
}

export default ReadDiary;