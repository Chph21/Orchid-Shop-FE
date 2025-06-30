import apiClient from './apiClient';
import type { UserDTO, PaginatedResponse } from '../types/types';

// User search parameters for pagination
export interface UserSearchParams {
    id?: string;
    name?: string;
    email?: string;
    roleName?: string;
    page?: number;
    size?: number;
    sort?: string[];
}

export const userApi = {

    search: async (params: UserSearchParams = {}): Promise<PaginatedResponse<UserDTO>> => {
        try {
            const searchParams = new URLSearchParams();
            
            if (params.id) searchParams.append('id', params.id);
            if (params.name) searchParams.append('name', params.name);
            if (params.email) searchParams.append('email', params.email);
            if (params.roleName) searchParams.append('roleName', params.roleName);
            if (params.page !== undefined) searchParams.append('page', params.page.toString());
            if (params.size !== undefined) searchParams.append('size', params.size.toString());
            if (params.sort && params.sort.length > 0) {
                params.sort.forEach((sortParam: string) => searchParams.append('sort', sortParam));
            }

            const response = await apiClient.get<PaginatedResponse<UserDTO>>('/api/accounts/search', {
                params: searchParams
            });
            return response.data;
        } catch (error) {
            console.error('Error searching users:', error);
            throw error;
        }
    },

    findByEmail: async (email: string): Promise<UserDTO> => {
        try {
            // Validate email parameter
            if (!email || !email.trim()) {
                throw new Error('Email parameter is required');
            }

            const response = await apiClient.get<UserDTO>('/api/accounts/email', {
                params: { email: email.trim() }
            });

            // Transform AccountResponse to UserDTO format
            const accountResponse = response.data;
            const userDTO: UserDTO = {
                id: accountResponse.id,
                name: accountResponse.name,
                email: accountResponse.email,
                password: accountResponse.password,
                roleId: accountResponse.roleId,
                roleName: accountResponse.roleName
            };

            return userDTO;
        } catch (error: any) {
            console.error('Error finding user by email:', error);
            
            // Handle specific error cases
            if (error.response?.status === 404) {
                throw new Error('User not found with the provided email');
            } else if (error.response?.status === 400) {
                throw new Error('Invalid email format');
            } else {
                throw new Error('Failed to find user by email');
            }
        }
    },

};