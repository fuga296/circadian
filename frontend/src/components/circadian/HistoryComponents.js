import { Link } from 'react-router-dom';
import './HistoryComponents.css';

export const SubTextSelector = ({ index, selectedValue, onChange }) => (
    <div className='sub-text-selector'>
        {['progress', 'memo', 'TODO', 'file'].map((type, key) => (
            <div key={type}>
                <span>
                    <input
                        type='radio'
                        name={`subTextSelector${index}`}
                        id={`${type}Selector${index}`}
                        value={type}
                        checked={selectedValue === type}
                        onChange={onChange}
                    />
                    <label htmlFor={`${type}Selector${index}`}>
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

export const SubTextContent = ({ type, history }) => {
    switch (type) {
        case 'progress':
            return <div>{history.progress_diff}</div>;
        case 'memo':
            return <div>{history.memo_diff}</div>;
        case 'TODO':
            return (
                <ul>
                    {history.todos_diff.map((todo, index) => (
                        <li key={index} className='todo-items'>{todo}</li>
                    ))}
                </ul>
            );
        case 'file':
            return (
                <ul>
                    {history.files_diff.map((file, index) => (
                        <li key={index} className='file-items'><Link to={`/circadian/file/${file.url}`}>{file.fileName}</Link></li>
                    ))}
                </ul>
            );
        default:
            return <div>エラー</div>;
    }
};