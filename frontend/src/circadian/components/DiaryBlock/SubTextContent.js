import React, { useEffect, useRef, useState } from "react";

import deleteImg from "../../assets/images/X.svg";
import { diaryBlockHeight } from "../../utils/diary";

import styles from "./SubTextContent.module.css";


const SubTextContent = ({ handleChangeSubText, diaryInfo, diaryState, type }) => {
    const [subText, setSubText] = useState({
        progress: diaryInfo.progress,
        memo: diaryInfo.memo,
        todos: diaryInfo.todos,
        file_names: diaryInfo.file_names,
        file_types: diaryInfo.file_types,
        file_urls: diaryInfo.file_urls,
    });
    const [height] = useState(`${diaryBlockHeight(diaryState.isHistory)*0.4 - 50}px`);
    const [isDisabled] = useState(diaryState.isDisabled);

    useEffect(() => {
        setSubText({
            progress: diaryInfo.progress,
            memo: diaryInfo.memo,
            todos: diaryInfo.todos,
            file_names: diaryInfo.file_names,
            file_types: diaryInfo.file_types,
            file_urls: diaryInfo.file_urls,
        })
    }, [diaryInfo.file_names, diaryInfo.file_types, diaryInfo.file_urls, diaryInfo.memo, diaryInfo.progress, diaryInfo.todos])

    const handleChangeTextarea = (e) => {
        setSubText((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    useEffect(() => {
        handleChangeSubText && handleChangeSubText(subText);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subText]);

    const todoInputRef = useRef();

    const handleAddTodo = () => {
        const newTodo = todoInputRef.current.value;

        if (newTodo.trim()) {
            setSubText((prev) => ({
                ...prev,
                todos: [...subText.todos, newTodo]
            }));
            todoInputRef.current.value = '';
        };

    };

    const handleDeleteTodo = (index) => {
        setSubText((prev) => ({
            ...prev,
            todos: prev.todos.filter((_, i) => i !== index),
        }));
    };

    const renderContent = () => {
        switch (type) {
            case "progress":
                return (
                    <textarea
                        className={styles.textarea}
                        style={{ height }}
                        name="progress"
                        value={subText.progress}
                        onChange={handleChangeTextarea}
                        placeholder={!isDisabled ? "進捗" : undefined}
                        disabled={isDisabled}
                    />
                );
            case "memo":
                return (
                    <textarea
                        className={styles.textarea}
                        style={{ height }}
                        name="memo"
                        value={subText.memo}
                        onChange={handleChangeTextarea}
                        placeholder={!isDisabled ? "メモ" : undefined}
                        disabled={isDisabled}
                    />
                );
            case "TODO":
                return (
                    <div className={styles.todosContainer} style={{ height }}>
                        {!isDisabled && (
                            <div>
                                <input type="text" ref={todoInputRef} className={styles.addTodo} />
                                <button type="button" className={styles.addTodoBtn} onClick={handleAddTodo}>追加</button>
                            </div>
                        )}
                        <ul className={styles.todoList} >
                            {subText.todos.map((TODO, index) => (
                                <li key={index} className={styles.todoItem}>
                                    {!isDisabled ? (
                                        <button
                                            type="button"
                                            className={styles.deleteTodoContainer}
                                            onClick={() => handleDeleteTodo(index)}
                                        >
                                            <img src={deleteImg} alt="delete" className={styles.deleteTodo} />
                                        </button>
                                    ) : "・"}
                                    <span>{TODO}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            case "file":
                return (
                    <div className={styles.filesContainer} style={{ height }}>
                        {!isDisabled && <input type="file" multiple />}
                    </div>
                );
            default:
                return null;
        }
    };

    return <div className={styles.subTextContainer}>{renderContent()}</div>;
};

export default SubTextContent;