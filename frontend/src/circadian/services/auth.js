import { BASE_API_PATH } from '../config/apiConfig';
import { createLog } from './api';
import axiosInstance from './axiosConfig';

const logAuth = async (status) => {
    const userAgent = navigator.userAgent;
    try {
        await createLog({
            action: status,
            detail: window.location.href,
            device_info: userAgent,
        });
    } catch (error) {
        console.error("log error:", error);
    }
};

export const login = async (loginInfo) => {
    try {
        await logAuth('LOGIN');
        console.log(loginInfo);
        const response = await axiosInstance.post(BASE_API_PATH + 'token/', {...loginInfo});
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

export const register = async (registerInfo) => {
    try {
        await logAuth('REGISTER');
        return await axiosInstance.post(BASE_API_PATH + 'register/', {...registerInfo});
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