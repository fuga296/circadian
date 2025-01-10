import React, { useState } from "react";
import Modal from "../../../components/Modal";
import metaInfoIcon from "../../assets/images/info.svg";
import styles from "./MetaInfo.module.css";
import { useNavigate } from "react-router-dom";

const MetaInfo = ({ metaInfoContents = [], loading }) => {
    const navigate = useNavigate();

    const [isModalExpanded, setIsModalExpanded] = useState(false);

    const toggleModal = () => setIsModalExpanded((prev) => loading ? prev : !prev);

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
                            <span className={styles.metaInfoValue}>{value || "設定されていません"}</span>
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
                        >この日記を削除する</button>
                    </li>
                </ul>
            </Modal>
        </div>
    );
};

export default MetaInfo;