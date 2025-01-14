import React from "react";
import styles from "./ContentLayout.module.css";

const ContentLayout = ({ header, main, footer }) => {
    return (
        <>
            <header className={styles.header}>
                {header}
            </header>
            <main className={styles.main}>
                {main}
            </main>
            {footer && (
                <footer>
                    {footer}
                </footer>
            )}
        </>
    );
};

export default ContentLayout;