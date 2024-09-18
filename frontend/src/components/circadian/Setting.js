import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosConfig';
import './Setting.css';

const Setting = () => {
    const [settings, setSettings] = useState({
        username: '',
        email: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get('/circadian/api/user/');
                setSettings(response.data);
            } catch (error) {
                setError("エラーが発生しました");
            }
        };
        setIsLoading(false);
        fetchUsers();
    }, []);

    const handleChange = event => {
        setSettings({
            ...settings,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        const username = settings.username;
        const email = settings.email;
        try {
            const response = await axiosInstance.put('/circadian/api/user/update/', { username, email });
            window.location.reload();
        setSettings(response.data);
        } catch (error) {
            setIsLoading(false);
            setError('ユーザー情報の更新中にエラーが発生しました: ' + (error.response?.data?.detail || error.message));
        }
    };

    return (
        <div id="contentContainer">
            <header>
                <h1 id="title">設定</h1>
            </header>
            {error ? <main id='errorMessage'>{error}</main> :
            isLoading ? <main id='loadingMessage'>Loading…</main> :
            <main>
                <form id='settingForm' onSubmit={handleSubmit}>
                    <p>
                        <label htmlFor="username">ユーザーネーム</label>
                        <input type="text" name="username" id="username" value={settings.username} onChange={handleChange} />
                    </p>
                    <p>
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" value={settings.email} onChange={handleChange} />
                    </p>
                    <button type='submit'>保存</button>
                </form>
            </main>}
        </div>
    )
}

export default Setting;