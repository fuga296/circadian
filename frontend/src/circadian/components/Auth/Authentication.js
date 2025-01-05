import React from "react";
import { Link } from "react-router-dom";
import { AUTH_INPUT_FIELDS } from "../../constants/auth";
import styles from "./Authentication.module.css";

const Authentication = ({ authInfo, handlers, isLogin, loading, error }) => {

    return (
        <div className={styles.formWapper}>
            <form className={styles.form} onSubmit={handlers.handleSubmit}>
                <h1>{isLogin ? "ログイン" : "新規登録"}</h1>
                {error && <p>{error}</p>}
                {loading && <p>Loading...</p>}

                <div className={styles.inputContainer}>
                    {AUTH_INPUT_FIELDS.map((field, index) => {
                        if ((field.ristrict % 2 === 1) && isLogin) {
                            return (
                                <div className={styles.inputBlock} key={index}>
                                    <label htmlFor={field.text.id}>{field.text.label}</label>
                                    <input
                                        type={field.type}
                                        name={field.text.id}
                                        id={field.text.id}
                                        placeholder={field.text.placeholder}
                                        value={authInfo[field.text.id]}
                                        onChange={handlers.handleChangeAuthInfo}
                                    />
                                </div>
                            )
                        } else if (((field.ristrict >> 1) % 2 === 1) && !isLogin) {
                            return (
                                <div className={styles.inputBlock} key={index}>
                                    <label htmlFor={field.text.id}>{field.text.label}</label>
                                    <input
                                        type={field.type}
                                        name={field.text.id}
                                        id={field.text.id}
                                        placeholder={field.text.placeholder}
                                        value={authInfo[field.text.id]}
                                        onChange={handlers.handleChangeAuthInfo}
                                    />
                                </div>
                            )
                        }
                        return null;
                    })}

                        <div className={styles.btnContainer}>
                            <div></div>
                            <button type="submit">{isLogin ? "ログイン" : "新規登録"}</button>
                        </div>
                </div>

                <hr />

                {
                isLogin ? <div className={styles.toRegister}>新規登録は<Link to='/circadian/authentication/register'>こちら</Link></div> :
                <div className={styles.toLogin}>ログインは<Link to='/circadian/authentication/login'>こちら</Link></div>
            }
            </form>
        </div>
    )
}

export default Authentication;