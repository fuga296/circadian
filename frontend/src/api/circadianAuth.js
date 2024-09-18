import axiosInstance from './axiosConfig';

// const API_URL = 'localhost:8000/circadian/api/';
const API_URL = 'https://circadian.onrender.com/circadian/api/';

const logAuth = async (status) => {
    try {
        await axiosInstance.post('/circadian/api/log/create/', {
            status: status,
        });
    } catch (error) {
        console.error("認証ログエラー:", error);
    }
};

export const login = async (username, password) => {
    try {
        await logAuth('LOGIN');
        const response = await axiosInstance.post(API_URL + 'token/', {
            username,
            password
        });
        if (response.data.access) {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
        }
        return response.data;
    } catch (error) {
        console.error("ログインエラー:", error);
        throw error;
    }
};

export const register = async (username, email, password) => {
    try {
        await logAuth('REGISTER');
        return await axiosInstance.post(API_URL + 'register/', {
            username,
            email,
            password
        });
    } catch (error) {
        console.error("登録エラー:", error);
        throw error;
    }
};

export const logout = async () => {
    try {
        await logAuth('LOGOUT');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    } catch (error) {
        console.error("ログアウトエラー:", error);
    }
};