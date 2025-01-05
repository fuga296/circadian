import React, { useState } from "react";
import styles from "./Accordion.module.css";
import caret from "../circadian/assets/images/caret-down.svg";

const Accordion = ({ title, content }) => {
    const [isOpened, setIsOpened] = useState(false);

    const toggleAccordion = () => {
        setIsOpened(!isOpened);
    };

    return (
        <div className={styles.accordion}>
            <div
                className={`${styles.header} ${isOpened ? styles.opened : ""}`}
                onClick={toggleAccordion}
            >
                <p className={styles.title}>{title}</p>
                <img
                    src={caret}
                    alt="Toggle"
                    className={`${styles.icon} ${isOpened ? styles.rotated : ""}`}
                />
            </div>

            <div
                className={styles.content}
                style={{
                    maxHeight: isOpened ? "700px" : "0",
                    overflow: "hidden",
                }}
            >
                <p>{content}</p>
            </div>
        </div>
    );
};

export default Accordion;