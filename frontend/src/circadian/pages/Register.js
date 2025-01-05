import React, { useState } from "react";
import Authentication from "../components/Auth/Authentication";
import { register } from "../services/circadianAuth";
import { useNavigate } from "react-router-dom";

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

    const handlers = {
        handleSubmit: async (e) => {
            setLoading(true);
            setError(null);

            e.preventDefault();
            try {
                await register(registerInfo);
                navigate("/circadian/test/home");
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
        <Authentication authInfo={registerInfo} handlers={handlers} isRegister={false} loading={loading} error={error} />
    );
};

export default Register;