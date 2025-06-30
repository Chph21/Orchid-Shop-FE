import apiClient from './apiClient';
import type { CategoryDTO } from '../types/types';

export const categoryApi = {
    getAll: async (): Promise<CategoryDTO[]> => {
        try {
            const response = await apiClient.get<CategoryDTO[]>('/api/categories');
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
            const response = await apiClient.get<CategoryDTO>(`/api/categories/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    create: async (categoryData: Omit<CategoryDTO, 'id'>): Promise<CategoryDTO> => {
        try {
            const response = await apiClient.post<CategoryDTO>('/api/categories', categoryData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    update: async (id: string, categoryData: Partial<CategoryDTO>): Promise<CategoryDTO> => {
        try {
            const response = await apiClient.put<CategoryDTO>(`/api/categories/${id}`, categoryData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    delete: async (id: string): Promise<void> => {
        try {
            await apiClient.delete(`/api/categories/${id}`);
        } catch (error) {
            throw error;
        }
    }
};