import React, { useEffect, useState } from "react";
import styles from "./DiaryBody.module.css";

const DiaryBody = ({ handleChangeText, preText, isDisabled }) => {
    const [text, setText] = useState(preText);

    useEffect(() => {
        setText(preText);
    }, [preText])

    const handleChangeTextarea = (e) => {
        const newValue = e.target.value;
        setText(newValue);
        handleChangeText(newValue);
    };

    return (
        <div className={styles.diaryBody}>
            <textarea
                value={text}
                className={styles.textarea}
                onChange={handleChangeTextarea}
                placeholder={isDisabled ? undefined : "本文を入力"}
                disabled={isDisabled}
            ></textarea>
        </div>
    );
};

export default DiaryBody;