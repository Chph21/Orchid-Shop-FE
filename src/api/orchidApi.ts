import apiClient from './apiClient';
import type { OrchidReadResponse, OrchidSearchParams, OrchidWriteRequest, PaginatedResponse } from '../types/types';

// Simple cache for search results to improve performance
const searchCache = new Map<string, { data: PaginatedResponse<OrchidReadResponse>; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCacheKey = (params: OrchidSearchParams, page: number): string => {
  return JSON.stringify({ ...params, page });
};

const getCachedResult = (key: string): PaginatedResponse<OrchidReadResponse> | null => {
  const cached = searchCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  searchCache.delete(key);
  return null;
};

const setCachedResult = (key: string, data: PaginatedResponse<OrchidReadResponse>): void => {
  searchCache.set(key, { data, timestamp: Date.now() });
};

export const orchidApi = {
    // Get all orchids (using the read service)
    getAll: async (): Promise<OrchidReadResponse[]> => {
        try {
            const response = await apiClient.get<OrchidReadResponse[]>('/api/orchids');
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

    // Enhanced search with proper pagination support
    searchPaginated: async (params: OrchidSearchParams = {}): Promise<PaginatedResponse<OrchidReadResponse>> => {
        try {
            const searchParams = new URLSearchParams();
            
            if (params.id) searchParams.append('id', params.id);
            if (params.name) searchParams.append('name', params.name);
            if (params.description) searchParams.append('description', params.description);
            if (params.isNatural !== undefined) searchParams.append('isNatural', params.isNatural.toString());
            if (params.minPrice !== undefined) searchParams.append('minPrice', params.minPrice.toString());
            if (params.maxPrice !== undefined) searchParams.append('maxPrice', params.maxPrice.toString());
            if (params.categoryName) searchParams.append('categoryName', params.categoryName);
            if (params.page !== undefined) searchParams.append('page', params.page.toString());
            if (params.size !== undefined) searchParams.append('size', params.size.toString());
            if (params.sort && params.sort.length > 0) {
                params.sort.forEach(sortParam => searchParams.append('sort', sortParam));
            }

            // Check cache first
            const cacheKey = getCacheKey(params, params.page || 0);
            const cachedResult = getCachedResult(cacheKey);
            if (cachedResult) {
                return cachedResult;
            }

            const response = await apiClient.get<PaginatedResponse<OrchidReadResponse>>('/api/orchids/search', {
                params: searchParams
            });

            // Set cache
            setCachedResult(cacheKey, response.data);

            return response.data;
        } catch (error) {
            console.error('Error searching orchids with pagination:', error);
            throw error;
        }
    },

    // Get orchid by ID (using search endpoint since getById is commented out)
    getById: async (id: string): Promise<OrchidReadResponse | null> => {
        try {
            const results = await orchidApi.searchPaginated({ id });
            return results.content.length > 0 ? results.content[0] : null;
        } catch (error) {
            console.error('Error fetching orchid by ID:', error);
            throw error;
        }
    },

    // Create new orchid
    create: async (orchidData: OrchidWriteRequest): Promise<string> => {
        try {
            const response = await apiClient.post<string>(
                '/api/orchids', 
                orchidData
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
            const response = await apiClient.put<string>(
                `/api/orchids/${id}`, 
                orchidData
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
            await apiClient.delete(`/api/orchids/${id}`);
        } catch (error) {
            console.error('Error deleting orchid:', error);
            throw error;
        }
    },

    search: async (params: OrchidSearchParams = {}): Promise<PaginatedResponse<OrchidReadResponse>> => {
        try {
            const searchParams = new URLSearchParams();
            
            if (params.id) searchParams.append('id', params.id);
            if (params.name) searchParams.append('name', params.name);
            if (params.description) searchParams.append('description', params.description);
            if (params.isNatural !== undefined) searchParams.append('isNatural', params.isNatural.toString());
            if (params.minPrice !== undefined) searchParams.append('minPrice', params.minPrice.toString());
            if (params.maxPrice !== undefined) searchParams.append('maxPrice', params.maxPrice.toString());
            if (params.categoryName) searchParams.append('categoryName', params.categoryName);
            if (params.page !== undefined) searchParams.append('page', params.page.toString());
            if (params.size !== undefined) searchParams.append('size', params.size.toString());
            if (params.sort && params.sort.length > 0) {
                params.sort.forEach(sortParam => searchParams.append('sort', sortParam));
            }

            const response = await apiClient.get<PaginatedResponse<OrchidReadResponse>>('/api/orchids/search', {
                params: searchParams
            });
            return response.data;
        } catch (error) {
            console.error('Error searching orchids:', error);
            // Fallback to getAll with client-side pagination
            const allOrchids = await orchidApi.getAll();
            const filteredOrchids = allOrchids.filter(orchid => {
                if (params.name && !orchid.name.toLowerCase().includes(params.name.toLowerCase())) return false;
                if (params.description && !orchid.description?.toLowerCase().includes(params.description.toLowerCase())) return false;
                if (params.categoryName && orchid.categoryName !== params.categoryName) return false;
                if (params.isNatural && orchid.isNatural !== params.isNatural) return false;
                if (params.minPrice !== undefined && (orchid.price || 0) < params.minPrice) return false;
                if (params.maxPrice !== undefined && (orchid.price || 0) > params.maxPrice) return false;
                return true;
            });
            
            const page = params.page || 0;
            const size = params.size || 10;
            const startIndex = page * size;
            const endIndex = startIndex + size;
            const paginatedOrchids = filteredOrchids.slice(startIndex, endIndex);
            
            return {
                content: paginatedOrchids,
                totalElements: filteredOrchids.length,
                totalPages: Math.ceil(filteredOrchids.length / size),
                numberOfElements: paginatedOrchids.length,
                page,
                size,
                first: page === 0,
                last: page >= Math.ceil(filteredOrchids.length / size) - 1
            };
        }
    },
};
