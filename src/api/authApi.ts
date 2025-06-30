import apiClient from './apiClient';
import type { LoginRequest, RegisterRequest, LoginResponse, RegisterResponse } from '../types/types';

export const authApi = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        try {
            const response = await apiClient.post<LoginResponse>('/api/auth/login', credentials);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || 'Login failed';
        }
    },

    register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
        try {
            const response = await apiClient.post<RegisterResponse>('/api/auth/register', userData);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || 'Registration failed';
        }
    },

    refreshToken: async (refreshToken: string): Promise<{ accessToken: string; refreshToken?: string }> => {
        try {
            const response = await apiClient.post('/api/auth/refresh', {
                refreshToken
            });
            return response.data;
        } catch (error: any) {
            throw error.response?.data || 'Token refresh failed';
        }
    }
};