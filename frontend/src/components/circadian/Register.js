import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../api/circadianAuth';

import './Register.css';

function Register() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");
    const [shouldAttemptRegister, setShouldAttemptRegister] = useState(false);
    const [usernameErrors, setUsernameErrors] = useState([]);
    const [emailErrors, setEmailErrors] = useState([]);
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [passwordAgainErrors, setPasswordAgainErrors] = useState([]);
    const [registerError, setRegisterError] = useState("");

    useEffect(() => {
        if (shouldAttemptRegister) {
            if (usernameErrors.length === 0 && emailErrors.length === 0 && passwordErrors.length === 0 && passwordAgainErrors.length === 0) {
                const attemptRegister = async () => {
                    try {
                        await register(username, email, password);
                        navigate('/circadian/authentication/login');
                    } catch (error) {
                        setRegisterError("エラーが出ました");
                    }
                };

                attemptRegister();
            }

            setShouldAttemptRegister(false);
        }
    }, [shouldAttemptRegister, usernameErrors, emailErrors, passwordErrors, passwordAgainErrors, username, email, password, navigate]);

    const validateUsername = () => {
        const errors = [];

        if (!(3 <= username.length && username.length <= 64)) {
            errors.push('ユーザーネームは3字以上64字未満でなければなりません');
        }
        if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
            errors.push('半角英数字、ドット、アンダースコア、ハイフン以外の文字は使用できません');
        }
        if (/^[._-]|[._-]$/.test(username)) {
            errors.push('ドット、アンダースコア、ハイフンは末尾または先頭にあってはいけません');
        }
        if (/^[._-]\1/.test(username)) {
            errors.push('ドット、アンダースコア、ハイフンは連続してはいけません');
        }

        setUsernameErrors(errors);
    }

    const validateEmail = () => {
        const errors = [];

        const emailPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailPattern.test(email)) {
            errors.push('RFCに準拠したメールアドレスである必要があります')
        }

        setEmailErrors(errors);
    }

    const validatePassword = () => {
        const errors = [];

        if (!(8 <= password.length && password.length <= 128)) {
            errors.push('パスワードは8字以上128字未満でなければなりません');
        }
        if (!/[a-zA-Z]/.test(password)) {
            errors.push('基本ラテン文字が1字以上含まれている必要があります');
        }
        if (!/[\d]/.test(password)) {
            errors.push('数字が1字以上含まれている必要があります');
        }
        if (!/^[a-zA-Z0-9!#$%&^~|@+*]+$/.test(password)) {
            errors.push('半角英数字、特殊記号(!, #, $, %, &, ^, ~, |, @, +, *)以外の文字は使用できません');
        }

        setPasswordErrors(errors);
    }

    const validatePasswordAgain = () => {
        const errors = [];

        if (password !== passwordAgain) {
            errors.push("パスワードと再パスワードが一致していません")
        }

        setPasswordAgainErrors(errors)
    }

    const handleRegister = async event => {
        event.preventDefault();

        validateUsername();
        validateEmail();
        validatePassword();
        validatePasswordAgain();

        setShouldAttemptRegister(true);
    };

    return (
        <div id='formContainer'>
            <form id='registerForm' onSubmit={handleRegister}>
                <h1>新規登録</h1>

                <div id='inputContainer'>
                    <div className='input' id='usernameContainer'>
                        <label htmlFor='username'>ユーザーネーム</label>
                        <input type="text" id='username' name='username' value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                        <div>
                            {
                                usernameErrors.map( (error, index) => (
                                    <div key={index} className='error-message'>※{error}</div>
                                ))
                            }
                        </div>
                    </div>

                    <div className='input' id='emailContainer'>
                        <label htmlFor='email'>Email</label>
                        <input type="email" id='email' name='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                        <div>
                            {
                                emailErrors.map( (error, index) => (
                                    <div key={index} className='error-message'>※{error}</div>
                                ))
                            }
                        </div>
                    </div>

                    <div className='input' id='passwordContainer'>
                        <label htmlFor='password'>パスワード</label>
                        <input type="password" id='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                        <div>
                            {
                                passwordErrors.map( (error, index) => (
                                    <div key={index} className='error-message'>※{error}</div>
                                ))
                            }
                        </div>
                    </div>

                    <div className='input' id='passwordAgainContainer'>
                        <label htmlFor='passwordAgain'>再パスワード</label>
                        <input type="password" id='passwordAgain' name='passwordAgain' value={passwordAgain} onChange={(e) => setPasswordAgain(e.target.value)} placeholder="Password Again" />
                        <div>
                            {
                                passwordAgainErrors.map( (error, index) => (
                                    <div key={index} className='error-message'>※{error}</div>
                                ))
                            }
                        </div>
                    </div>

                    <div id='buttonContainer'>
                        <div id='register-error-message'>{registerError}</div>
                        <button type="submit">新規登録</button>
                    </div>
                </div>

                <hr />

                <div id='toLogin'>ログインは<Link to='/circadian/authentication/login'>こちら</Link></div>
            </form>
        </div>
    );
};

export default Register;