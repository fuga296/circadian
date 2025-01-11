import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Modal from "../../../components/Modal";

import metaInfoIcon from "../../assets/images/info.svg";
import { deleteDiary } from "../../services/api";

import styles from "./MetaInfo.module.css";


const MetaInfo = ({ diaryInfo, metaInfoContents = [], loading }) => {
    const navigate = useNavigate();

    const [date] = useState({
        year: diaryInfo.date.split('-')[0],
        month: diaryInfo.date.split('-')[1],
        day: diaryInfo.date.split('-')[2],
    });
    const [isModalExpanded, setIsModalExpanded] = useState(false);

    const toggleModal = () => setIsModalExpanded((prev) => loading ? prev : !prev);

    const handleDeleteDiary = async () => {
        await deleteDiary(date.year, date.month, date.day);
        window.location.reload();
    };

    return (
        <div className={styles.metaInfoUnit}>
            <button
                type="button"
                onClick={toggleModal}
                className={styles.metaInfoButton}
                aria-expanded={isModalExpanded}
                aria-label="Toggle meta information modal"
            >
                <img
                    src={metaInfoIcon}
                    alt="meta info icon"
                    className={styles.metaInfoIcon}
                />
            </button>
            <Modal className={styles.modal} style={{ height: !isModalExpanded && "0" }}>
                <ul className={styles.metaInfoList}>
                    {metaInfoContents.map(({ name, value }, index) => (
                        <li key={index} className={styles.metaInfoItems}>
                            <span className={styles.metaInfoName}>{name}:</span>
                            <span className={styles.metaInfoValue}>{diaryInfo[value] || "設定されていません"}</span>
                        </li>
                    ))}
                    <li className={styles.metaInfoItems}>
                        <button
                            type="button"
                            className={styles.metaInfoValueButton}
                            onClick={() => {
                                const [year, month, day] = metaInfoContents[2].value.split('-');
                                navigate(`/circadian/history/${year}/${month}/${day}`);
                            }}
                        >この日記の履歴を見る</button>
                    </li>
                    <li className={styles.metaInfoItems}>
                        <button
                            type="button"
                            className={styles.metaInfoValueButton}
                            onClick={handleDeleteDiary}
                        >この日記を削除する</button>
                    </li>
                </ul>
            </Modal>
        </div>
    );
};

export default MetaInfo;