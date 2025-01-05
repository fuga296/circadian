import React, { useEffect, useState } from "react";
import Accordion from "../../../components/Accordion";
import styles from "./SettingComponent.module.css";

const SettingComponent = ({ info, handlers }) => {

    const [userInfo, setUserInfo] = useState({ ...info });

    useEffect(() => {
        setUserInfo({ ...info });
    }, [info]);

    const handleChangeInfo = (e) => {
        const { name, value } = e.target;
        const updatedInfo = { ...userInfo, [name]: value };
        setUserInfo(updatedInfo);
        handlers.handleChangeUserInfo(updatedInfo);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handlers.handleSubmit();
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <Accordion
                title={<div className={styles.accordionTitle}>ユーザー情報</div>}
                content={
                    <div className={styles.accordionContent}>
                        <div className={styles.formGroup}>
                            <label htmlFor="username" className={styles.label}>
                                ユーザーネーム
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className={styles.input}
                                value={userInfo.username}
                                placeholder="ユーザーネームを入力"
                                onChange={handleChangeInfo}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.label}>
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className={styles.input}
                                value={userInfo.email}
                                placeholder="メールアドレスを入力"
                                onChange={handleChangeInfo}
                            />
                        </div>
                    </div>
                }
            />
            <div className={styles.submitContainer}>
                <button type="submit" className={styles.submitButton}>
                    保存
                </button>
            </div>
        </form>
    );
};

export default SettingComponent;