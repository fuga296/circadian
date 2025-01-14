import React, { useCallback, useEffect, useState } from "react";
import SideFoldableNav from "../../../components/SideFoldableNav";

import logo from "../../assets/images/logo3-1.png";
import navIcon from "../../assets/images/humbarger-menu.svg";
import navChevronRithgIcon from "../../assets/images/chevron-double-right.svg";

import { NAV_SELECTION_LISTS } from "../../constants/content";

import styles from "./Navigator.module.css";
import useResize from "../../hooks/useResize";
import { APP_NAME } from "../../config/app";


const Navigator = ({ onNavExpandChange, isBigScreen, setIsBigScreen }) => {
    const [isNavExpanded, setIsNavExpanded] = useState(false);
    const [isNavHidden, setIsNavHidden] = useState(true);
    const [isNavIconHovered, setIsNavIconHovered] = useState(false);

    const toggleNavExpansion = useCallback(() => setIsNavExpanded((prev) => !prev), []);
    const showNav = useCallback(() => setIsNavHidden(false), []);
    const hideNav = useCallback(() => setIsNavHidden(true), []);
    const handleNavIconHover = useCallback(() => setIsNavIconHovered(true), []);
    const handleNavIconUnhover = useCallback(() => setIsNavIconHovered(false), []);

    useEffect(() => {
        onNavExpandChange(isNavExpanded);
    }, [onNavExpandChange, isNavExpanded]);

    useResize({
        handleResize: () => setIsBigScreen(window.innerWidth > 768)
    });

    return (
        <>
            <div
                className={`${styles.navIconContainer} ${isNavExpanded ? styles.expanded : styles.collapsed}`}
                onMouseEnter={isBigScreen ? () => { showNav(); handleNavIconHover(); } : undefined}
                onMouseLeave={isBigScreen ? () => { hideNav(); handleNavIconUnhover(); } : undefined}
                onClick={toggleNavExpansion}
            >
                    <img
                        src={isNavExpanded ? navChevronRithgIcon : (isNavIconHovered ? navChevronRithgIcon : navIcon)}
                        alt="nav icon"
                        className={styles.navIcon}
                    />
            </div>

            <div
                className={`${styles.navSupporter} ${!isBigScreen && isNavExpanded && styles.expandedNavContainer}`}
                onMouseEnter={isBigScreen ? showNav : undefined}
                onMouseLeave={isBigScreen ? hideNav : undefined}
                onClick={!isBigScreen && isNavExpanded ? toggleNavExpansion : undefined}
            />

            <SideFoldableNav
                isExpanded={isNavExpanded}
                isHidden={isNavHidden}
                logo={logo}
                appName={APP_NAME}
                navSelectionLists={NAV_SELECTION_LISTS}
                onMouseEnter={showNav}
                onMouseLeave={hideNav}
            />
        </>
    );
};

export default Navigator;