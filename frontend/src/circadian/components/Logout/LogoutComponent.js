import React from 'react';
import styles from './LogoutComponent.module.css';

const LogoutComponent = ({ handleLogout }) => {
    return (
        <div className={styles.logoutContainer}>
            <h1 className={styles.logoutTitle}>ログアウト</h1>
            <p className={styles.logoutMessage}>本当にログアウトしますか？</p>
            <button className={`${styles.logoutButton} ${styles.confirm}`} onClick={handleLogout}>ログアウト</button>
        </div>
    );
};

export default LogoutComponent;