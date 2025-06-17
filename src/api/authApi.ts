import axios from 'axios';
import type { LoginRequest, RegisterRequest, LoginResponse, RegisterResponse } from '../types/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const authApi = {
    login: async (credentials: LoginRequest): Promise<LoginResponse> => {
        try {
            const response = await axios.post<LoginResponse>(`${API_BASE_URL}/api/auth/login`, credentials);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || 'Login failed';
        }
    },

    register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
        try {
            const response = await axios.post<RegisterResponse>(`${API_BASE_URL}/api/auth/register`, userData);
            return response.data;
        } catch (error: any) {
            throw error.response?.data || 'Registration failed';
        }
    },

    refreshToken: async (refreshToken: string): Promise<{ accessToken: string; refreshToken?: string }> => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
                refreshToken
            });
            return response.data;
        } catch (error: any) {
            throw error.response?.data || 'Token refresh failed';
        }
    },

    // Utility methods for setting headers (to be called from context)
    setAuthHeader: (token: string): void => {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    },

    clearAuthHeader: (): void => {
        delete axios.defaults.headers.common['Authorization'];
    }
};