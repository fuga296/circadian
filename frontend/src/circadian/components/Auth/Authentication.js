import React from "react";
import { Link } from "react-router-dom";
import styles from "./Authentication.module.css";
import InputField from "./InputField";

const Authentication = ({ authInfo, handlers, isLogin, loading, error, inputMessages }) => {

    return (
        <div className={styles.formWapper}>
            <form className={styles.form} onSubmit={handlers.handleSubmit}>
                <h1>{isLogin ? "ログイン" : "新規登録"}</h1>
                {loading && <p>Loading...</p>}

                <div className={styles.inputContainer}>
                    <InputField
                        label="ユーザーネーム"
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={authInfo.username}
                        onChange={handlers.handleChangeAuthInfo}
                        messages={inputMessages.username}
                    />
                    {!isLogin && (
                        <InputField
                            label="メールアドレス"
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={authInfo.email}
                            onChange={handlers.handleChangeAuthInfo}
                            messages={inputMessages.email}
                        />
                    )}
                    <InputField
                        label="パスワード"
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={authInfo.password}
                        onChange={handlers.handleChangeAuthInfo}
                        messages={inputMessages.password}
                    />
                    {!isLogin && (
                        <InputField
                            label="再パスワード"
                            type="password"
                            name="passwordAgain"
                            placeholder="Password Again"
                            value={authInfo.passwordAgain}
                            onChange={handlers.handleChangeAuthInfo}
                            messages={inputMessages.passwordAgain}
                        />
                    )}

                    <div className={styles.btnContainer}>
                        {error && <p>{error}</p>}
                        <button type="submit">{isLogin ? "ログイン" : "新規登録"}</button>
                    </div>
                </div>

                <hr />

                {isLogin ?(
                    <div className={styles.toRegister}>
                        新規登録は<Link to='/circadian/auth/register'>こちら</Link>
                    </div>
                ) :(
                    <div className={styles.toLogin}>
                        ログインは<Link to='/circadian/auth/login'>こちら</Link>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Authentication;