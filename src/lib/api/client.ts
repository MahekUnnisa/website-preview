import axios, { type AxiosInstance } from 'axios';
import { getApiBase, getAppVersion } from '@/lib/env.js';
import { getAuthToken } from '@/lib/auth-session';

const API_LOCALE_HEADER = 'X-Locale';

function getClientLanguage(): string {
    if (typeof navigator !== 'undefined' && typeof navigator.language === 'string') {
        const trimmed = navigator.language.trim();
        if (trimmed.length > 0) {
            return trimmed;
        }
    }
    return 'en-US';
}

export const apiClient: AxiosInstance = axios.create({
    baseURL: getApiBase(),
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'X-Platform': 'web',
        'X-App-Version': getAppVersion(),
    },
});

apiClient.interceptors.request.use(async (config) => {
    const locale = getClientLanguage();
    config.headers[API_LOCALE_HEADER] = locale;
    config.headers['X-Client-Timezone'] = Intl.DateTimeFormat().resolvedOptions().timeZone;
    config.headers['X-Client-Timestamp'] = Date.now().toString();

    if (!config.headers.Authorization) {
        const token = await getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }

    return config;
});
