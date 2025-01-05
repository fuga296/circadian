import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SideFoldableNav.module.css";

const SideFoldableNav = ({isExpanded, isHidden, logo, appName, navSelectionLists, onMouseEnter, onMouseLeave}) => {
    const navigate = useNavigate();
    return (
        <nav
            className={`
                ${styles.navContainer}
                ${isExpanded ? styles.expandedNavContainer : styles.collapsedNavContainer}
            `}
            style={{
                left: (isHidden & !isExpanded) ? 'calc(-1 * var(--nav-slide-width) - 10px)' : '0',
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >

            <img src={logo} alt='logo' className={styles.navLogo} />

            {
                navSelectionLists.map((navSelectionList, ulIndex) => (
                    <ul key={ulIndex} className={styles.navSelectionUl}>
                        {
                            navSelectionList.map((navSelection, liIndex) => (
                                <li key={liIndex} className={styles.navSelection} onClick={() => {navigate(`/${appName}/${navSelection.page}`)}}>
                                    <span className={styles.navSelectionIconContainer}>
                                        <img src={navSelection.icon} alt={navSelection.page.replace(/-/g, ' ')} className={styles.navSelectionIcon} />
                                    </span>
                                    <span>{navSelection.text}</span>
                                </li>
                            ))
                        }
                    </ul>
                ))
            }
        </nav>
    );
};

export default SideFoldableNav;