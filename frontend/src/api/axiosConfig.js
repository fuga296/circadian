import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://circadian.onrender.com',
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
        Promise.reject(error)
    }
)

axiosInstance.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const response = await axios.post('https://circadian.onrender.com/circadian/api/token/refresh/', {
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
        return Promise.reject(error)
    }
)

export default axiosInstance;