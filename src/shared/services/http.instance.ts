import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from './token-storage';

const REFRESH_PATH = '/auth/refresh';
/** Llamadas que nunca deben disparar la rotación automática (no hay sesión que rotar). */
const NO_RETRY_PATHS = ['/auth/login', '/auth/register', REFRESH_PATH];

const httpInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

httpInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

httpInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;
    const url = original?.url ?? '';
    const isAuthCall = NO_RETRY_PATHS.some((path) => url.includes(path));

    // 401 en una llamada autenticada → intenta rotar la sesión una sola vez.
    if (error.response?.status === 401 && original && !original._retry && !isAuthCall) {
      original._retry = true;
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearTokens();
        redirectToLogin();
        return Promise.reject(error);
      }
      try {
        const response = await axios.post<{ accessToken: string; refreshToken: string }>(
          `${import.meta.env.VITE_API_BASE_URL}${REFRESH_PATH}`,
          { refreshToken },
          { timeout: 10000 }
        );
        setTokens(response.data.accessToken, response.data.refreshToken);
        original.headers.set('Authorization', `Bearer ${response.data.accessToken}`);
        return httpInstance.request(original);
      } catch {
        clearTokens();
        redirectToLogin();
        return Promise.reject(error);
      }
    }

    // eslint-disable-next-line no-console
    console.error('API Error:', error.response?.data ?? error.message);
    return Promise.reject(error);
  }
);

function redirectToLogin(): void {
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
}

export default httpInstance;
