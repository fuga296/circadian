import React, { useEffect, useId, useState } from "react";

import { SUB_TEXT_SELECTIONS } from "../../constants/diary";

import styles from "./SubTextSelection.module.css";


const SubTextSelection = ({ handleChangeSelection }) => {
    const id = useId();

    const [selectedSubText, setSelectedSubText] = useState("progress");

    const handleChangeSubText = (e) => {
        const selectedType = e.target.value;
        setSelectedSubText(selectedType);
    };

    useEffect(() => {
        handleChangeSelection(selectedSubText);
    }, [selectedSubText, handleChangeSelection]);

    return (
        <div className={styles.subTextSelectionContainer}>
            <ul className={styles.subTextSelectionList}>
                {SUB_TEXT_SELECTIONS.map(({type, name}, _) => (
                    <li key={type} className={styles.subTextSelection}>
                        <input
                            type="radio"
                            name="subTextSelection"
                            id={`${type}-${id}`}
                            value={type}
                            checked={selectedSubText === type}
                            onChange={handleChangeSubText}
                        />
                        <label htmlFor={`${type}-${id}`} >{name}</label>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SubTextSelection;