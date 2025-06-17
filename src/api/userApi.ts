import axios from 'axios';
import type { UserDTO } from '../types/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('orchid_access_token');
    return token ? {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    } : {
        'Content-Type': 'application/json'
    };
};

export const userApi = {
    getAll: async (): Promise<UserDTO[]> => {
        try {
            const response = await axios.get<UserDTO[]>(`${API_BASE_URL}/api/accounts`, {
                headers: getAuthHeaders()
            });
            return response.data.sort((a, b) => {
                // Sort by ID if available, otherwise by name
                if (a.id && b.id) {
                    return parseInt(b.id) - parseInt(a.id);
                }
                return a.name.localeCompare(b.name);
            });
        } catch (error) {
            throw error;
        }
    },

    getById: async (id: string): Promise<UserDTO> => {
        try {
            const response = await axios.get<UserDTO>(`${API_BASE_URL}/api/accounts/${id}`, {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    findByEmail: async (email: string): Promise<UserDTO> => {
        try {
            const response = await axios.get<UserDTO>(`${API_BASE_URL}/api/accounts/email`, {
                params: {
                    email: email
                },
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    create: async (userData: Omit<UserDTO, 'id'>): Promise<UserDTO> => {
        try {
            const response = await axios.post<UserDTO>(`${API_BASE_URL}/api/accounts`, userData, {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    update: async (id: string, userData: Partial<UserDTO>): Promise<UserDTO> => {
        try {
            const response = await axios.put<UserDTO>(`${API_BASE_URL}/api/accounts/${id}`, userData, {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    delete: async (id: string): Promise<void> => {
        try {
            await axios.delete(`${API_BASE_URL}/api/accounts/${id}`, {
                headers: getAuthHeaders()
            });
        } catch (error) {
            throw error;
        }
    }
};