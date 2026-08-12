import { apiClient } from '@/lib/api/client';
import { routes } from '@/lib/api';

const ONBOARDING_V3_PARAMS = { version: 'v3' } as const;

export type OnboardingV3Payload = {
    workspace?: { selected: 'slack' | 'msteams' };
    tools_available?: { work_tools: string[]; code_tools: string[] };
    eod?: { user_time: string };
};

export type OnboardingV3Record = {
    workspace?: unknown;
    tools_available?: unknown;
    eod?: unknown;
};

export type CalendarAnalyzeStartResponse = {
    success?: boolean;
    jobId?: string;
    status?: string;
};

export type CalendarAnalyzeJobStatus = 'queued' | 'processing' | 'completed' | 'failed';

export type CalendarAnalyzePollResponse = {
    success?: boolean;
    jobId?: string;
    status?: CalendarAnalyzeJobStatus;
    result?: {
        name?: string;
        date?: string;
        botMessage?: string;
        data?: {
            events?: unknown[];
        };
    };
};

type ApiResult<T> = {
    data: T | undefined;
    code: number | undefined;
};

const toResult = <T>(error: unknown): ApiResult<T> => {
    const err = error as { response?: { status?: number; data?: T } };
    return { code: err?.response?.status, data: err?.response?.data };
};

export const fetchOnboardingV3 = async (): Promise<ApiResult<OnboardingV3Record>> => {
    try {
        const response = await apiClient.get<OnboardingV3Record>(routes.onboarding.v3, {
            params: ONBOARDING_V3_PARAMS,
        });
        return { data: response.data, code: response.status };
    } catch (error) {
        console.error('[OnboardingV3] fetch failed', error);
        return toResult<OnboardingV3Record>(error);
    }
};

export const saveOnboardingV3 = async (payload: OnboardingV3Payload): Promise<ApiResult<OnboardingV3Record>> => {
    try {
        const response = await apiClient.post<OnboardingV3Record>(routes.onboarding.v3, payload, {
            params: ONBOARDING_V3_PARAMS,
        });
        return { data: response.data, code: response.status };
    } catch (error) {
        console.error('[OnboardingV3] save failed', error);
        return toResult<OnboardingV3Record>(error);
    }
};

export const requestCalendarAnalyze = async (): Promise<ApiResult<CalendarAnalyzeStartResponse>> => {
    try {
        const response = await apiClient.post<CalendarAnalyzeStartResponse>(
            routes.onboarding.calendarAnalyze,
            {},
            { params: ONBOARDING_V3_PARAMS }
        );
        return { data: response.data, code: response.status };
    } catch (error) {
        console.error('[OnboardingV3] calendar analyze start failed', error);
        return toResult<CalendarAnalyzeStartResponse>(error);
    }
};

export const fetchCalendarAnalyzeJob = async (jobId: string): Promise<ApiResult<CalendarAnalyzePollResponse>> => {
    try {
        const response = await apiClient.get<CalendarAnalyzePollResponse>(
            routes.onboarding.calendarAnalyzeJob(jobId),
            { params: ONBOARDING_V3_PARAMS }
        );
        return { data: response.data, code: response.status };
    } catch (error) {
        console.error('[OnboardingV3] calendar analyze poll failed', error);
        return toResult<CalendarAnalyzePollResponse>(error);
    }
};

export const requestExecuteFirstOnboardingJob = async (): Promise<ApiResult<CalendarAnalyzeStartResponse>> => {
    try {
        const response = await apiClient.post<CalendarAnalyzeStartResponse>(
            routes.onboarding.executeFirstJob,
            {},
            { params: ONBOARDING_V3_PARAMS }
        );
        return { data: response.data, code: response.status };
    } catch (error) {
        console.error('[OnboardingV3] execute first job failed', error);
        return toResult<CalendarAnalyzeStartResponse>(error);
    }
};
