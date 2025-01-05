import React from "react";
import styles from "./ContentLayout.module.css";

const ContentLayout = ({ header, main }) => {
    return (
        <>
            <header className={styles.header}>
                {header}
            </header>
            <main className={styles.main}>
                {main}
            </main>
        </>
    );
};

export default ContentLayout;