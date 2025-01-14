import React, { useState } from "react";
import Authentication from "../components/Auth/Authentication";
import { register } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { validateEmail, validatePassword, validateUsername } from "../utils/validate";
import { APP_NAME } from "../config/app";

const Register = () => {

    const navigate = useNavigate();

    const [registerInfo, setRegisterInfo] = useState({
        username: "",
        email: "",
        password: "",
        passwordAgain: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [inputMessages, setInputMessages] = useState({
        username: [],
        email: [],
        password: [],
        passwordAgain: [],
    });

    const validateInputs = () => {
        const messages = {
            username: validateUsername(registerInfo.username),
            email: validateEmail(registerInfo.email),
            password: validatePassword(registerInfo.password),
            passwordAgain:
                registerInfo.password !== registerInfo.passwordAgain
                    ? ["パスワードが一致していません"]
                    : [],
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
            };

            try {
                await register(registerInfo);
                navigate(`/${APP_NAME}/auth/login`);
            } catch (err) {
                console.error("Register log error:", err);
                setError("Failed to fetch diary. Please try again later.");
            } finally {
                setLoading(false);
            }
        },
        handleChangeAuthInfo: (e) => {
            const {name, value} = e.target;
            setRegisterInfo((prev) => ({
                ...prev,
                [name]: value,
            }));
        },
    };

    return (
        <Authentication
            authInfo={registerInfo}
            handlers={handlers}
            isRegister={false}
            loading={loading}
            error={error}
            inputMessages={inputMessages}
        />
    );
};

export default Register;