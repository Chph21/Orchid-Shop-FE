import axios from 'axios';
import type { OrchidReadResponse, OrchidSearchParams, OrchidWriteRequest } from '../types/types';

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

export const orchidApi = {
    // Get all orchids (using the read service)
    getAll: async (): Promise<OrchidReadResponse[]> => {
        try {
            const response = await axios.get<OrchidReadResponse[]>(`${API_BASE_URL}/api/orchids`);
            return response.data.sort((a, b) => {
                // Sort by ID if available, otherwise by name
                if (a.id && b.id) {
                    return parseInt(b.id) - parseInt(a.id);
                }
                return a.name.localeCompare(b.name);
            });
        } catch (error) {
            console.error('Error fetching orchids:', error);
            throw error;
        }
    },

    // Search orchids with filters
    search: async (params: OrchidSearchParams = {}): Promise<OrchidReadResponse[]> => {
        try {
            const searchParams = new URLSearchParams();
            
            // Add parameters only if they have values
            if (params.id) searchParams.append('id', params.id);
            if (params.name) searchParams.append('name', params.name);
            if (params.description) searchParams.append('description', params.description);
            if (params.isNatural) searchParams.append('isNatural', params.isNatural);
            if (params.minPrice !== undefined) searchParams.append('minPrice', params.minPrice.toString());
            if (params.maxPrice !== undefined) searchParams.append('maxPrice', params.maxPrice.toString());
            if (params.categoryName) searchParams.append('categoryName', params.categoryName);
            if (params.page !== undefined) searchParams.append('page', params.page.toString());
            if (params.size !== undefined) searchParams.append('size', params.size.toString());
            if (params.sort && params.sort.length > 0) {
                params.sort.forEach(sortParam => searchParams.append('sort', sortParam));
            }

            const response = await axios.get<OrchidReadResponse[]>(`${API_BASE_URL}/api/orchids/search`, {
                params: searchParams,
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error searching orchids:', error);
            throw error;
        }
    },

    // Get orchid by ID (using search endpoint since getById is commented out)
    getById: async (id: string): Promise<OrchidReadResponse | null> => {
        try {
            const results = await orchidApi.search({ id });
            return results.length > 0 ? results[0] : null;
        } catch (error) {
            console.error('Error fetching orchid by ID:', error);
            throw error;
        }
    },

    // Create new orchid
    create: async (orchidData: OrchidWriteRequest): Promise<string> => {
        try {
            const response = await axios.post<string>(
                `${API_BASE_URL}/api/orchids`, 
                orchidData, 
                {
                    headers: getAuthHeaders()
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error creating orchid:', error);
            throw error;
        }
    },

    // Update orchid
    update: async (id: string, orchidData: OrchidWriteRequest): Promise<string> => {
        try {
            const response = await axios.put<string>(
                `${API_BASE_URL}/api/orchids/${id}`, 
                orchidData, 
                {
                    headers: getAuthHeaders()
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating orchid:', error);
            throw error;
        }
    },

    // Delete orchid
    delete: async (id: string): Promise<void> => {
        try {
            await axios.delete(`${API_BASE_URL}/api/orchids/${id}`, {
                headers: getAuthHeaders()
            });
        } catch (error) {
            console.error('Error deleting orchid:', error);
            throw error;
        }
    },

    // Convenience methods for common searches
    searchByCategory: async (categoryName: string): Promise<OrchidReadResponse[]> => {
        return orchidApi.search({ categoryName });
    },

    searchByPriceRange: async (minPrice: number, maxPrice: number): Promise<OrchidReadResponse[]> => {
        return orchidApi.search({ minPrice, maxPrice });
    },

    searchByType: async (isNatural: string): Promise<OrchidReadResponse[]> => {
        return orchidApi.search({ isNatural });
    },

    searchByName: async (name: string): Promise<OrchidReadResponse[]> => {
        return orchidApi.search({ name });
    }
};
