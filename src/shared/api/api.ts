import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

declare module 'axios' {
    interface AxiosRequestConfig {
        _retry?: boolean;
    }
}

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    withCredentials: true,
});

let refreshPromise: Promise<void> | null = null;

api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Если нет ответа или не 401 – отклоняем
        if (!error.response || error.response.status !== 401) {
            return Promise.reject(error);
        }

        // Если это сам запрос на refresh – не пытаемся обновляться снова
        if (originalRequest.url?.includes('/auth/refresh')) {
            window.dispatchEvent(new CustomEvent('auth:expired'));
            return Promise.reject(error);
        }

        // Если запрос уже повторялся – не циклиться
        if (originalRequest._retry) {
            window.dispatchEvent(new CustomEvent('auth:expired'));
            return Promise.reject(error);
        }

        // Если уже идёт процесс обновления – ждём его и повторяем исходный запрос
        if (refreshPromise) {
            await refreshPromise;
            return api(originalRequest);
        }

        // Помечаем, что запрос будет повторён
        originalRequest._retry = true;

        // Запускаем процесс обновления
        refreshPromise = (async () => {
            try {
                await api.post('/auth/refresh');
            } catch (refreshError) {
                // Если рефреш не удался – очищаем промис и кидаем событие
                refreshPromise = null;
                window.dispatchEvent(new CustomEvent('auth:expired'));
                throw refreshError;
            }
            refreshPromise = null;
        })();

        try {
            await refreshPromise;
            // После успешного обновления повторяем исходный запрос
            return api(originalRequest);
        } catch (refreshError) {
            return Promise.reject(refreshError);
        }
    }
);