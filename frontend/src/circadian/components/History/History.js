import React from "react";
import styles from "./History.module.css";

const History = ({ message, history }) => {
    return (
        <div className={styles.historyContainer}>
            <p className={styles.historyMessage}>{message}</p>
            {history}
        </div>
    );
};

export default History;