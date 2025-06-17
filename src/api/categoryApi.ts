import axios from 'axios';
import type { CategoryDTO } from '../types/types';

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

export const categoryApi = {
    getAll: async (): Promise<CategoryDTO[]> => {
        try {
            const response = await axios.get<CategoryDTO[]>(`${API_BASE_URL}/api/categories`);
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

    getById: async (id: string): Promise<CategoryDTO> => {
        try {
            const response = await axios.get<CategoryDTO>(`${API_BASE_URL}/api/categories/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    create: async (categoryData: Omit<CategoryDTO, 'id'>): Promise<CategoryDTO> => {
        try {
            const response = await axios.post<CategoryDTO>(`${API_BASE_URL}/api/categories`, categoryData, {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    update: async (id: string, categoryData: Partial<CategoryDTO>): Promise<CategoryDTO> => {
        try {
            const response = await axios.put<CategoryDTO>(`${API_BASE_URL}/api/categories/${id}`, categoryData, {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    delete: async (id: string): Promise<void> => {
        try {
            await axios.delete(`${API_BASE_URL}/api/categories/${id}`, {
                headers: getAuthHeaders()
            });
        } catch (error) {
            throw error;
        }
    }
};