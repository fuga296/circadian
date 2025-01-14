import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navigator from "../Navigator/Navigator";
import styles from "./PageLayout.module.css";
import ProtectedRoute from "./ProtectedRoute";

const PageLayout = () => {
    const [isNavExpanded, setIsNavExpanded] = useState(false);
    const [isBigScreen, setIsBigScreen] = useState(window.innerWidth > 768);

    const onNavExpandChange = (newValue) => {
        setIsNavExpanded(newValue);
    };

    return (
        <div className={styles.pageContainer} style={{ marginLeft: isNavExpanded && isBigScreen ?  "var(--nav-slide-width)" : "0" }}>
            <Navigator onNavExpandChange={onNavExpandChange} isBigScreen={isBigScreen} setIsBigScreen={setIsBigScreen} />
            <div className={styles.contentContainer}>
                <ProtectedRoute element={<Outlet />} />
            </div>
        </div>
    )
}

export default PageLayout;