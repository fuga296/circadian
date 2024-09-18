import { Link } from 'react-router-dom';
import menu from '../../images/menu.svg';
import search from '../../images/search.svg';
import './DiaryComponents.css';

export const Menu = ({ isExpanded, isReverseOrder, setIsReverseOrder, navigate }) => (
    <div id='menu' style={{ display: isExpanded ? 'block' : 'none' }}>
        <ul>
            <li className='toggle-menu'>
                <span>逆順</span>
                <span className='switch'>
                    <input type='checkbox' value={isReverseOrder} onChange={() => setIsReverseOrder(!isReverseOrder)} name='switch' id='orderSwitch' />
                    <label htmlFor='orderSwitch'></label>
                </span>
            </li>
            <li className='btn-menu' onClick={() => navigate('/circadian/history/user')}><span>編集履歴</span></li>
        </ul>
    </div>
);

export const MetaInfo = ({ diary, isExpanded, navigate }) => (
    <div className='meta-info' style={{ display: isExpanded ? 'block' : 'none' }}>
        <ul>
            {Object.entries({
                '連番': diary.sequence_number,
                'ユーザー': diary.user,
                '日付': diary.date,
                '作成日': diary.created_at,
                '最終編集日': diary.updated_at,
                '日記ID': diary.front_id
            }).map(([label, value]) => (
                <li key={label}><span>{label}:</span><span>{value}</span></li>
            ))}
            <li className='btn-menu' onClick={() => navigate(`/circadian/history/${diary.date}`)}><span>編集履歴を見る</span></li>
        </ul>
    </div>
);

export const SubTextSelector = ({ index, selectedValue, onChange }) => (
    <div className='sub-text-selector'>
        {['progress', 'memo', 'TODO', 'file'].map((type, key) => (
            <div key={type}>
                <span>
                    <input
                        type='radio'
                        name={`subTextSelector${index || ''}`}
                        id={`${type}Selector${index || ''}`}
                        value={type}
                        checked={selectedValue === type}
                        onChange={onChange}
                    />
                    <label htmlFor={`${type}Selector${index || ''}`}>
                        {key === 0 ? "進捗" :
                        key === 1 ? "メモ" :
                        key === 2 ? "TODO" :
                        "ファイル"}
                    </label>
                </span>
            </div>
        ))}
    </div>
);

export const SubTextContent = ({ type, diary }) => {
    switch (type) {
        case 'progress':
            return <div>{diary.progress}</div>;
        case 'memo':
            return <div>{diary.memo}</div>;
        case 'TODO':
            return (
                <ul>
                    {diary.todos.map((todo, index) => (
                        <li key={index} className='todo-items'>{todo}</li>
                    ))}
                </ul>
            );
        case 'file':
            return (
                <ul>
                    {diary.files.map((file, index) => (
                        <li key={index} className='file-items'><Link to={`/circadian/file/${file.url}`}>{file.fileName}</Link></li>
                    ))}
                </ul>
            );
        default:
            return <div>エラー</div>;
    }
};

export const SearchForm = ({ searchInput, setSearchInput, handleSubmitSearch, setIsExpandedMenu, isExpandedMenu, isReverseOrder, setIsReverseOrder, navigate }) => (
    <form id='searchForm' onSubmit={handleSubmitSearch}>
        <input type='search' value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder='キーワード検索(正規表現使用可能)' />
        <button type='submit'><img src={search} alt='検索' /></button>
        <span>
            <img src={menu} alt='menu' id='menuIcon' onClick={() => setIsExpandedMenu(!isExpandedMenu)} />
            <Menu isExpanded={isExpandedMenu} isReverseOrder={isReverseOrder} setIsReverseOrder={setIsReverseOrder} navigate={navigate} />
        </span>
    </form>
);

export const AddDiaryButton = ({ navigate }) => (
    <li id='addDiary' onClick={() => navigate('/circadian/add-diary')}>
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 0C4.27614 0 4.5 0.223858 4.5 0.5V3.5H7.5C7.77614 3.5 8 3.72386 8 4C8 4.27614 7.77614 4.5 7.5 4.5H4.5V7.5C4.5 7.77614 4.27614 8 4 8C3.72386 8 3.5 7.77614 3.5 7.5V4.5H0.5C0.223858 4.5 0 4.27614 0 4C0 3.72386 0.223858 3.5 0.5 3.5H3.5V0.5C3.5 0.223858 3.72386 0 4 0Z" fill="black"/>
        </svg>
        <span>日記を追加</span>
    </li>
);

export const stringToRegex = (str) => {
    const parts = str.match(/^\/(.*)\/([a-z]*)$/);
    if (parts) {
        const pattern = parts[1];
        const flags = parts[2];
        return new RegExp(pattern, flags);
    }
};