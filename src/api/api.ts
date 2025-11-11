import axios, { type AxiosInstance } from 'axios';

const API_BASE_URL: string | undefined = import.meta.env.VITE_APP_API_GATEWAY_URL;

if (!API_BASE_URL) {
    console.error("VITE_APP_API_GATEWAY_URL not defined. Check your .env file.");
}

const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('userToken');

        if (token) {
            if (!config.url?.includes('/auth/login') && !config.url?.includes('/auth/register')) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;