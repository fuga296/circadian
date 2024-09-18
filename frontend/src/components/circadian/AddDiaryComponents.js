import { useRef } from 'react';
import { Link } from 'react-router-dom';
import X from '../../images/X.svg'
import './AddDiaryComponents.css'

export const TODO = ({ diaryInput, setDiaryInput }) => {
    const newTODOInputRef = useRef(null);

    const addTODO = () => {
        const newTODO = newTODOInputRef.current.value;
        if (newTODO.trim()) {
            setDiaryInput({
                ...diaryInput,
                todoList: [...diaryInput.todoList, newTODO]
            })
        }
        newTODOInputRef.current.value = '';
    }

    const handleKeyDownEnter = (event) => {
        if (event.key === 'Enter') {
            addTODO();
        }
    }

    const deleteTODO = (index) => () => {
        const newTODOs = [...diaryInput.todoList];
        newTODOs.splice(index, 1);
        setDiaryInput({
            ...diaryInput,
            todoList: newTODOs
        })
    }

    return (
        <div>
            <div id='newTODOInputContainer'>
                <input type='text' id='newTODOInput' ref={newTODOInputRef} onKeyDown={handleKeyDownEnter} />
                <button type='button' onClick={addTODO}>TODOを追加</button>
            </div>

            <ul>
                {diaryInput.todoList.map((TODO, index) => (
                    <li key={index}
                    className='todoList'>
                        <div>{TODO}</div>
                        <img src={X} alt='X' id='deleteTODOIcon' onClick={deleteTODO(index)}  />
                    </li>
                ))}
            </ul>
        </div>
    )
};

export const File = ({ diaryInput, setDiaryInput }) => {
    const fileInputRef = useRef(null);

    const handleChangeInputFile = (event) => {
        const files = fileInputRef.current.files;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onload = (e) => {
                const arrayBuffer = e.target.result;
                const base64String = btoa(
                    new Uint8Array(arrayBuffer).reduce(
                        (data, byte) => data + String.fromCharCode(byte),
                        ''
                    )
                );


                setDiaryInput((prevDiaryInput) => ({
                    ...prevDiaryInput,
                    fileList: [...prevDiaryInput.fileList, {
                        binaryData: base64String,
                        fileName: file.name,
                        fileType: file.type,
                        url: ''
                    }]
                }));
            };

            reader.readAsArrayBuffer(file);
        };
    };

    const deleteFile = (index) => (event) => {
        const newFileList = [...diaryInput.fileList];
        newFileList.splice(index, 1);
        setDiaryInput({
            ...diaryInput,
            fileList: newFileList
        })
    }

    return (
        <div>
            <input type='file'
                name='file'
                id='fileInput'
                ref={fileInputRef}
                accept='audio/*, video/*, image/*, .pdf, .txt, .html, .css, .py, .js, .json'
                onChange={handleChangeInputFile}
                multiple />

            <ul>
                {
                    diaryInput.fileList.map((file, index) => (
                        <li key={index} className='fileList'>
                            {file.url ? <Link to={`/circadian/file/${file.url}`}><div>{file.fileName}</div></Link> : <div>{file.fileName}</div>}
                            <img src={X} alt='X' id='deleteFileIcon' onClick={deleteFile(index)} />
                        </li>
                    ))
                }
            </ul>
        </div>
    )
};

export const SubText = ({ selectSubText, diaryInput, setDiaryInput, handleChange }) => {
    switch (selectSubText) {
        case 'progress':
            return <textarea value={diaryInput.progress} onChange={handleChange} placeholder='進捗を書く' name='progress'></textarea>;
        case 'memo':
            return <textarea value={diaryInput.memo} onChange={handleChange} placeholder='メモを書く' name='memo'></textarea>;
        case 'TODO':
            return <TODO diaryInput={diaryInput} setDiaryInput={setDiaryInput} />;
        default:
            return <File diaryInput={diaryInput} setDiaryInput={setDiaryInput} />;
    }
};

export const SubTextSelector = ({ selectedValue, onChange }) => (
    <div id='subTextSelector'>
        {['progress', 'memo', 'TODO', 'file'].map((type, key) => (
            <div key={type}>
                <span>
                    <input
                        type='radio'
                        name={'subTextSelector'}
                        id={`${type}Selector`}
                        value={type}
                        checked={selectedValue === type}
                        onChange={onChange}
                    />
                    <label htmlFor={`${type}Selector`}>
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