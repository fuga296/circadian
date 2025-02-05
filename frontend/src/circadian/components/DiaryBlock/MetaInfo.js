import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Dropdown from "../../../components/Dropdown";

import metaInfoIcon from "../../assets/images/info.svg";
import { deleteDiary } from "../../services/api";

import styles from "./MetaInfo.module.css";
import { APP_NAME } from "../../config/app";
import Modal from "../../../components/Modal";


const MetaInfo = ({ diaryInfo, metaInfoContents = [], loading }) => {
    const navigate = useNavigate();

    const [date] = useState({
        year: diaryInfo.date.split('-')[0],
        month: diaryInfo.date.split('-')[1],
        day: diaryInfo.date.split('-')[2],
    });
    const [isOpenModal, setIsOpenModal] = useState(false);

    const handleDeleteDiary = async () => {
        await deleteDiary(date.year, date.month, date.day);
        window.location.reload();
    };

    return (
        <div className={styles.metaInfoUnit}>
            <Dropdown
                buttonLabel={
                    <img
                        src={metaInfoIcon}
                        alt="meta info icon"
                        className={styles.metaInfoIcon}
                    />
                }

                content={
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
                                    const {year, month, day} = date;
                                    navigate(`/${APP_NAME}/history/${year}/${month}/${day}`);
                                }}
                            >この日記の履歴を見る</button>
                        </li>
                        <li className={styles.metaInfoItems}>
                            <button
                                type="button"
                                className={styles.metaInfoValueButton}
                                onClick={() => setIsOpenModal(true)}
                            >この日記を削除する</button>
                        </li>
                    </ul>
                }

                buttonClassName={styles.metaInfoButton}
                contentClassName={styles.metaInfoBlock}

                disableFlag={loading}
            />

            {isOpenModal && (
                <Modal
                    message={
                        <p>本当に削除しますか？</p>
                    }
                    buttonLabel={"削除する"}
                    handleExecute={handleDeleteDiary}
                    handleClose={() => setIsOpenModal(false)}
                />
            )}
        </div>
    );
};

export default MetaInfo;