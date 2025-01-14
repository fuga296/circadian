import React, { useState } from "react";
import Authentication from "../components/Auth/Authentication";
import { login } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { APP_NAME } from "../config/app";

const Login = () => {

    const navigate = useNavigate();

    const [loginInfo, setLoginInfo] = useState({
        username: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [inputMessages, setInputMessages] = useState({
        username: [],
        password: [],
    });

    const validateInputs = () => {
        const messages = {
            username: loginInfo.username ? [] : ["文字を入力してください"],
            password: loginInfo.password ? [] : ["文字を入力してください"],
        };
        setInputMessages(messages);
        return Object.values(messages).every((msgs) => msgs.length === 0);
    };

    const handlers = {
        handleSubmit: async (e) => {
            e.preventDefault();
            setLoading(true);
            setError(null);

            if (!validateInputs()) {
                setLoading(false);
                return;
            }

            try {
                await login(loginInfo);
                navigate(`/${APP_NAME}/home`);
            } catch (err) {
                console.error("Login log error:", err);
                if (err.code === "ERR_NETWORK") {
                    setError("ネットワークにつながっていません。");
                } else if (err.code === "ERR_BAD_REQUEST") {
                    setError("ユーザーが存在しません。");
                } else if (err.code === "ECONNABORTED") {
                    setError("時間を超過しました。");
                } else {
                    setError("エラーが発生しました。時間をおいてやり直してください。");
                }
            } finally {
                setLoading(false);
            }
        },
        handleChangeAuthInfo: (e) => {
            const {name, value} = e.target;
            setLoginInfo((prev) => ({
                ...prev,
                [name]: value,
            }));
        },
    };

    return (
        <Authentication
            authInfo={loginInfo}
            handlers={handlers}
            isLogin={true}
            loading={loading}
            error={error}
            inputMessages={inputMessages}
        />
    );
};

export default Login;