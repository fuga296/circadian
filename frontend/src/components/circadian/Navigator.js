import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../api/circadianAuth';
import './Navigator.css';
import logo from '../../images/logo3-1.png';
import navMenuIcon from '../../images/humbarger-menu.svg';
import navChevronLeftIcon from '../../images/chevron-double-left.svg';
import navChevronRithgIcon from '../../images/chevron-double-right.svg';
import { NAV_SELECTION_LIST } from '../../utils/navUtils';

const Navigator = () => {
    const navigate = useNavigate();
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);
    const navIconRef = useRef(null);
    const navigatorRef = useRef(null);
    const navSupporterRef = useRef(null);

    const handleClick = (event) => {
        const page = event.target.dataset.page
        if (page === 'logout') {
            handleLogout();
        } else if (page === 'feedback') {
            window.location.href = 'https://docs.google.com/forms/d/1vQC2DQV3YKZ-VeIXlEnj71_9QjRnHusClxZHs9LAo0I';
        } else {
            navigate(`/circadian/${page}`);
            document.title = page.replace(/-/g, ' ').toUpperCase();
        }
    }

    const handleLogout = () => {
        const result = window.confirm("ログアウトしますか？");
        if (result) {
            logout()
            navigate('/circadian/authentication/login');
        };
    }

    const slideNavContainer = (event) => {
        if (isNavCollapsed) {
            if (event.type === 'mouseenter') {
                navigatorRef.current.style.left = '0'
            } else {
                navigatorRef.current.style.left = '-225px';

                if (isNavCollapsed) {
                    navSupporterRef.current.style.width = '100px';
                    navSupporterRef.current.style.zIndex = 'auto';
                }
            }

            event.target.id === 'navIcon' ? navIconRef.current.src = navChevronRithgIcon : navIconRef.current.src = navMenuIcon;
        }
    }

    const handleNavIconClick = () => {
        if (isNavCollapsed) {
            navSupporterRef.current.style.width = '254px';
            navSupporterRef.current.style.zIndex = '98';
        } else {
            navSupporterRef.current.style.zIndex = '98';
        }

        setIsNavCollapsed(!isNavCollapsed);
    }

    return (
        <div id='navContainer'>
            <div id='navSupporter' ref={navSupporterRef}
            onMouseEnter={slideNavContainer}
            onMouseLeave={slideNavContainer}></div>

            {isNavCollapsed && (
                <div className='navIconContainer'>
                    <img src={navMenuIcon} alt='nav menu icon' id='navIcon' ref={navIconRef}
                    onMouseEnter={slideNavContainer}
                    onMouseLeave={slideNavContainer}
                    onClick={handleNavIconClick} />
                </div>
            )}

            <div className={(isNavCollapsed ? 'collapsedNavigator' : 'expandedNavigator')} id='navigator' ref={navigatorRef} onMouseEnter={slideNavContainer} onMouseLeave={slideNavContainer}>
                {!isNavCollapsed && (
                    <div className='navIconContainer'>
                        <img src={navChevronLeftIcon} alt='nav icon' id='navIcon' ref={navIconRef}
                        onClick={() => {handleNavIconClick();}} />
                    </div>
                )}

                <div className='logo-container'><img src={logo} alt='logo' /></div>

                <nav>
                    <ul>
                        {
                            NAV_SELECTION_LIST[0].map((navSelection, index) => (
                                <li className='navSelection' data-page={navSelection.page} key={index} onClick={handleClick}>
                                    <span className='navSelectionIcon'>
                                        <img src={navSelection.icon} alt={navSelection.page.replace(/-/g, ' ')} />
                                    </span>
                                    <span className='navSelectionText'>{navSelection.text}</span>
                                </li>
                            ))
                        }
                    </ul>

                    <ul>
                        {
                            NAV_SELECTION_LIST[1].map((navSelection, index) => (
                                <li className='navSelection' data-page={navSelection.page} key={index} onClick={handleClick}>
                                    <span className='navSelectionIcon'>
                                        <img src={navSelection.icon} alt={navSelection.page.replace(/-/g, ' ')} />
                                    </span>
                                    <span className='navSelectionText'>{navSelection.text}</span>
                                </li>
                            ))
                        }
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default Navigator;