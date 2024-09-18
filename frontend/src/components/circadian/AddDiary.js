import { useState, useEffect, useRef, memo } from 'react';
import axiosInstance from '../../api/axiosConfig';
import './AddDiary.css'
import { SubText, SubTextSelector } from './AddDiaryComponents';
import { formatN, DAYS_OF_WEEK } from '../../utils/dateUtils';

const MemoizedSubText = memo(SubText);
const MemoizedSubTextSelector = memo(SubTextSelector);

const AddDiary = () => {
    const date = new Date();
    const [diaryInput, setDiaryInput] = useState({
        date: `${date.getFullYear()}-${formatN(date.getMonth() + 1)}-${formatN(date.getDate())}`,
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        mainText: '',
        progress: '',
        memo: '',
        todoList: [],
        fileList: [],
    });
    const [maxDay, setMaxDay] = useState(new Date(diaryInput.year, diaryInput.month, 0).getDate());
    const [selectSubText, setSelectSubText] = useState("progress");
    const [isExistedDiary, setIsExistedDiary] = useState(false);
    const [error, setError] = useState('');
    const dayOfWeekRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const subTextContainerRef = useRef(null);

    useEffect(() => {
        if (subTextContainerRef.current) {
            subTextContainerRef.current.style = selectSubText === 'progress' || selectSubText === 'memo' ? 'scrollbar-gutter: auto;' : 'scrollbar-gutter: stable;';
        }
    }, [selectSubText]);

    useEffect(() => {
        setMaxDay(new Date(diaryInput.year, diaryInput.month, 0).getDate());
    }, [diaryInput.year, diaryInput.month]);

    useEffect(() => {
        const dateObj = new Date(diaryInput.year, diaryInput.month - 1, diaryInput.day);
        if (dayOfWeekRef.current) {
            dayOfWeekRef.current.textContent = `(${DAYS_OF_WEEK[dateObj.getDay()]})`;
        }

        const fetchDiaries = async () => {
            try {
                const response = await axiosInstance.get(`/circadian/api/diary/${diaryInput.date}/`);
                if (response.data.error) {
                    setDiaryInput(prevState => ({
                        ...prevState,
                        mainText: '',
                        progress: '',
                        memo: '',
                        todoList: [],
                        fileList: [],
                    }));
                    setIsExistedDiary(false);
                } else {
                    setDiaryInput(prevState => ({
                        ...prevState,
                        mainText: response.data.main_text,
                        progress: response.data.progress,
                        memo: response.data.memo,
                        todoList: response.data.todos,
                        fileList: response.data.files,
                    }));
                    setIsExistedDiary(true);
                }
                setError('');
            } catch (error) {
                setError("日記が取得できません。");
            }
            setIsLoading(false);
        };
        fetchDiaries();
    }, [diaryInput.year, diaryInput.month, diaryInput.day, diaryInput.date, isLoading]);

    const handleChange = event => {
        setDiaryInput(prevState => ({
            ...prevState,
            [event.target.name]: event.target.value,
        }));
    };

    const handleYearChange = event => {
        const newYear = event.target.value;
        setDiaryInput(prevState => ({
            ...prevState,
            year: newYear,
            date: `${newYear}-${formatN(prevState.month)}-${formatN(prevState.day)}`
        }));
    };

    const handleMonthChange = event => {
        const newMonth = event.target.value;
        setDiaryInput(prevState => ({
            ...prevState,
            month: newMonth,
            date: `${prevState.year}-${formatN(newMonth)}-${formatN(prevState.day)}`
        }));
    };

    const handleDayChange = event => {
        const newDay = event.target.value;
        setDiaryInput(prevState => ({
            ...prevState,
            day: newDay,
            date: `${prevState.year}-${formatN(prevState.month)}-${formatN(newDay)}`
        }));
    };

    const handleChangeSubTextSelector = event => {
        setSelectSubText(event.target.value);
    };

    const handleSubmit = async event => {
        event.preventDefault();
        setIsLoading(true);

        const date = diaryInput.date;
        const main_text = diaryInput.mainText;
        const progress = diaryInput.progress;
        const memo = diaryInput.memo;
        const todos = diaryInput.todoList;
        const files = diaryInput.fileList;

        if (!new Date(date)) {
            setError('日付が不正です。')
        }

        try {
            if (isExistedDiary) {
                await axiosInstance.put(`/circadian/api/diary/update/${date}/`,
                    { date, main_text, progress, memo, todos, files }
                );
            } else {
                await axiosInstance.post('/circadian/api/diary/create/',
                    { date, main_text, progress, memo, todos, files },
                );
            }
            await axiosInstance.post('/circadian/api/history/create/',
                { diary_date: date, type: isExistedDiary ? 'EDIT' : 'CREATE', main_text, progress, memo, todos, files }
            );
            window.location.reload();
        } catch (error) {
            setIsLoading(false);
            setError('エラーが発生しました。');
        }
    };

    return (
        <div className='addDiary' id="contentContainer">
            <header>
                <div id='titleContainer'>
                    <h1 id="title">日記を追加</h1>
                    <p id='errorMessage'>{error}</p>
                </div>
            </header>
            {isLoading ? <main id='loadingMessage'>Loading…</main> :
            <main>
                <form id='diaryForm' onSubmit={handleSubmit} >
                    <div id='addDiaryContainer'>
                        <div id='dateContainer'>
                            <span id='year'><input type='number' name='year' min="1000" max="9999" onChange={handleYearChange} value={diaryInput.year} />年</span>
                            <span id='month'><input type='number' name='month' min="1" max="12" onChange={handleMonthChange} value={diaryInput.month} />月</span>
                            <span id='day'><input type='number' name='day' min="1" max={maxDay} onChange={handleDayChange} value={diaryInput.day} />日</span>
                            <span id='dayOfWeek' ref={dayOfWeekRef}>({DAYS_OF_WEEK[new Date(diaryInput.date)]})</span>
                            <button type='submit' id='diarySubmit'>送信</button>
                        </div>

                        <div id='mainTextContainer'>
                            <textarea value={diaryInput.mainText} onChange={handleChange} placeholder='本文を書く' name='mainText' id='mainText'></textarea>
                        </div>

                        <MemoizedSubTextSelector selectedValue={selectSubText} onChange={handleChangeSubTextSelector} />

                        <div id='subTextContainer' ref={subTextContainerRef}>
                            <MemoizedSubText selectSubText={selectSubText} diaryInput={diaryInput} setDiaryInput={setDiaryInput} handleChange={handleChange} />
                        </div>
                    </div>
                </form>
            </main>}
        </div>
    )
};

export default AddDiary;