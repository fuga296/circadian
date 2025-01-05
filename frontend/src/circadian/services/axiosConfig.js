import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/',
    // baseURL: 'https://circadian.onrender.com',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// リクエストインターセプター
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// レスポンスインターセプター
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                try {
                    const response = await axios.post('http://localhost:8000/circadian/api/token/refresh/', {
                    // const response = await axios.post('https://circadian.onrender.com/circadian/api/token/refresh/', {
                        refresh: refreshToken,
                    });

                    localStorage.setItem('access_token', response.data.access);

                    originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
                    return axiosInstance(originalRequest);
                } catch (err) {
                    console.error("トークンリフレッシュに失敗しました", err);
                }
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;