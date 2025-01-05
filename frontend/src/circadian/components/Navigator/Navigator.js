import React, { useCallback, useEffect, useState } from "react";
import SideFoldableNav from "../../../components/SideFoldableNav";

import logo from "../../assets/images/logo3-1.png";
import navIcon from "../../assets/images/humbarger-menu.svg";
import navChevronRithgIcon from "../../assets/images/chevron-double-right.svg";

import { NAV_SELECTION_LISTS } from "../../constants/content";

import styles from "./Navigator.module.css";
import useResize from "../../hooks/useResize";


const Navigator = ({ onNavExpandChange }) => {
    const [isNavExpanded, setIsNavExpanded] = useState(false);
    const [isNavHidden, setIsNavHidden] = useState(true);
    const [isNavIconHovered, setIsNavIconHovered] = useState(false);
    const [isBigScreen, setIsBigScreen] = useState(window.innerWidth > 768);

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

            {isBigScreen && (
                <div
                    className={styles.navSupporter}
                    onMouseEnter={showNav}
                    onMouseLeave={hideNav}
                />
            )}

            <SideFoldableNav
                isExpanded={isNavExpanded}
                isHidden={isNavHidden}
                logo={logo}
                appName="circadian"
                navSelectionLists={NAV_SELECTION_LISTS}
                onMouseEnter={showNav}
                onMouseLeave={hideNav}
            />
        </>
    );
};

export default Navigator;