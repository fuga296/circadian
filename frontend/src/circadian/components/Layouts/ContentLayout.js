import React from "react";
import styles from "./ContentLayout.module.css";
import ContentProviders from "../../contexts/ContentProviders";

const ContentLayout = ({ header, main, footer }) => {
    return (
        <ContentProviders>
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
        </ContentProviders>
    );
};

export default ContentLayout;