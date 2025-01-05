import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navigator from "../Navigator/Navigator";
import styles from "./PageLayout.module.css";
import ProtectedRoute from "./ProtectedRoute";

const PageLayout = () => {
    const [isNavExpanded, setIsNavExpanded] = useState(false);

    const onNavExpandChange = (newValue) => {
        setIsNavExpanded(newValue);
    };

    return (
        <div className={styles.pageContainer} style={{ marginLeft: isNavExpanded ? "var(--nav-slide-width)" : "0" }}>
            <Navigator onNavExpandChange={onNavExpandChange} />
            <div className={styles.contentContainer}>
                <ProtectedRoute element={<Outlet />} />
            </div>
        </div>
    )
}

export default PageLayout;