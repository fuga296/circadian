import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../../api/axiosConfig'
import './History.css'
import { SubTextSelector, SubTextContent } from './HistoryComponents'

const DiaryHistory = () => {
    const [histories, setHistories] = useState([]);
    const [selectSubText, setSelectSubText] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const { date } = useParams();

    useEffect( () => {
        const fetchHistories = async () => {
            try {
                const response = await axiosInstance.get(`/circadian/api/history/${date}/`);
                if (response.data.error) {
                    if (response.data.error === 'NotFound') {
                        setError("履歴が存在しません。");
                    }
                } else {
                    setHistories(response.data);
                }
            } catch (error) {
                setError('履歴を取得できませんでした。');
            }
            setIsLoading(false);
        }
        fetchHistories();
    }, [date])

    useEffect(() => {
        setSelectSubText(Array(histories.length).fill('progress'));
    }, [histories]);

    const handleChangeSubTextSelector = (index) => (event) => {
        const newSelectSubText = [...selectSubText];
        newSelectSubText[index] = event.target.value;
        setSelectSubText(newSelectSubText);
    };

    return (
        <div id="contentContainer">
            <header>
                <h1 id="title">履歴</h1>
            </header>
            {error ? <main id='errorMessage'>{error}</main> :
            isLoading ? <main id='loadingMessage'>Loading…</main> :
            <main>
                <ul className='histories'>
                    {
                        histories.map( (history, index) => (
                            <li key={index}>
                                <div className='date'>{history.timestamp.slice(0, 16).replace("T", " | ")}</div>
                                <div className='message'>{history.diary_date}の日記を{history.type}しました。</div>

                                <div className='diary'>
                                    <div className='main-text-container'>
                                        <div className='main-text'>{history.main_text_diff}</div>
                                    </div>

                                    <SubTextSelector
                                        index={index}
                                        selectedValue={selectSubText[index]}
                                        onChange={handleChangeSubTextSelector(index)}
                                    />

                                    <div className='sub-text-content'>
                                        <SubTextContent  type={selectSubText[index]} history={history} />
                                    </div>
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </main>}
        </div>
    )
}

export default DiaryHistory;