import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../api/circadianAuth';
import './Login.css';

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (!(username || password)) {
            setLoginError('フィールドに入力して下さい。');
            setIsLoading(false);
            return;
        }

        try {
            await login(username, password);
            navigate('/circadian/home');
        } catch (error) {
            setIsLoading(false);
            setLoginError("エラーが起きました。しばらく時間をおいてログインし直してください。");
        }
    }

    return (
        <div id='formContainer'>
            {isLoading ? <main id='loadingMessage'>Loading…</main> : <form id='loginForm' onSubmit={handleLogin}>
                <h1>ログイン</h1>

                <div id='inputContainer'>
                    <div className='input' id='usernameContainer'>
                        <label htmlFor='username'>ユーザーネーム</label>
                        <input type="text" id='username' name='username' value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                    </div>

                    <div className='input' id='passwordContainer'>
                        <label htmlFor='password'>パスワード</label>
                        <input type="password" id='password' name='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                    </div>

                    <div id='buttonContainer'>
                        <div id='login-error-message'>{loginError}</div>
                        <button type="submit">ログイン</button>
                    </div>
                </div>

                <hr />

                <div id='toRegister'>新規登録は<Link to='/circadian/authentication/register'>こちら</Link></div>
            </form>}
        </div>
    );
};

export default Login;