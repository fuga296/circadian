import axiosInstance from './axiosConfig';

const API_URL = 'https://circadian.onrender.com/circadian/api/';

const logAuth = async (status) => {
    try {
        await axiosInstance.post('/circadian/api/log/create/', {
            status: status,
        });
    } catch (error) {
        console.error("Leave log error:", error);
    }
};

export const login = async (username, password) => {
    logAuth('LOGIN')
    const response = await axiosInstance.post(API_URL + 'token/', {
        username,
        password
    });
    if (response.data.access) {
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
    }
    return response.data;
};

export const register = async (username, email, password) => {
    logAuth('REGISTER')
    return axiosInstance.post(API_URL + 'register/', {
        username,
        email,
        password
    });
};

export const logout = () => {
    logAuth('LOGOUT')
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
};