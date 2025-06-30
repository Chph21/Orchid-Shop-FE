import apiClient from './apiClient';
import type { 
    OrderReadResponse, 
    OrderSearchParams, 
    OrderWriteRequest,
    OrderDetailReadResponse,
    PaginatedResponse
} from '../types/types';

export const orderApi = {
    // Get all orders
    getAll: async (): Promise<OrderReadResponse[]> => {
        try {
            const response = await apiClient.get<OrderReadResponse[]>('/api/orders');
            return response.data;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    },

    // Search orders with filters
    search: async (params: OrderSearchParams = {}): Promise<PaginatedResponse<OrderReadResponse>> => {
        try {
            const searchParams = new URLSearchParams();
            
            if (params.id) searchParams.append('id', params.id);
            if (params.accountId) searchParams.append('accountId', params.accountId);
            if (params.date) searchParams.append('date', params.date);
            if (params.totalAmount) searchParams.append('totalAmount', params.totalAmount.toString());
            if (params.status) searchParams.append('status', params.status);
            if (params.page !== undefined) searchParams.append('page', params.page.toString());
            if (params.size !== undefined) searchParams.append('size', params.size.toString());
            if (params.sort && params.sort.length > 0) {
                params.sort.forEach(sortParam => searchParams.append('sort', sortParam));
            }

            const response = await apiClient.get<PaginatedResponse<OrderReadResponse>>('/api/orders/search', {
                params: searchParams
            });
            return response.data;
        } catch (error) {
            console.error('Error searching orders:', error);
            // Fallback to getAll with client-side pagination
            const allOrders = await orderApi.getAll();
            const filteredOrders = allOrders.filter(order => {
                if (params.id && !order.id.toLowerCase().includes(params.id.toLowerCase())) return false;
                if (params.accountId && !order.accountId.toLowerCase().includes(params.accountId.toLowerCase())) return false;
                if (params.status && !order.status.toLowerCase().includes(params.status.toLowerCase())) return false;
                return true;
            });
            
            const page = params.page || 0;
            const size = params.size || 10;
            const startIndex = page * size;
            const endIndex = startIndex + size;
            const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
            
            return {
                content: paginatedOrders,
                totalElements: filteredOrders.length,
                totalPages: Math.ceil(filteredOrders.length / size),
                numberOfElements: paginatedOrders.length,
                page,
                size,
                first: page === 0,
                last: page >= Math.ceil(filteredOrders.length / size) - 1
            };
        }
    },

    // Get order by ID
    getById: async (id: string): Promise<OrderReadResponse | null> => {
        try {
            const results = await orderApi.search({ id });
            return results.content.length > 0 ? results.content[0] : null;
        } catch (error) {
            console.error('Error fetching order by ID:', error);
            throw error;
        }
    },

    // Get order details by order ID
    getDetailsById: async (orderId: string): Promise<OrderDetailReadResponse[]> => {
        try {
            const response = await apiClient.get<OrderDetailReadResponse[]>(
                `/api/orders/details/${orderId}`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching order details:', error);
            throw error;
        }
    },

    // Find order detail by ID - new function to get specific order detail
    findOrderDetailById: async (orderDetailId: string): Promise<OrderDetailReadResponse | null> => {
        try {
            const response = await apiClient.get<OrderDetailReadResponse>(
                `/api/order-details/${orderDetailId}`
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching order detail by ID:', error);
            return null;
        }
    },

    // Create new order
    create: async (orderData: OrderWriteRequest): Promise<string> => {
        try {
            const response = await apiClient.post<string>(
                '/api/orders',
                orderData
            );
            return response.data;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    },

    // Delete order
    delete: async (id: string): Promise<void> => {
        try {
            await apiClient.delete(`/api/orders/${id}`);
        } catch (error) {
            console.error('Error deleting order:', error);
            throw error;
        }
    },

    // Convenience methods for common searches
    searchByStatus: async (status: string): Promise<OrderReadResponse[]> => {
        const result = await orderApi.search({ status });
        return result.content;
    },

    searchByDate: async (date: string): Promise<OrderReadResponse[]> => {
        const result = await orderApi.search({ date });
        return result.content;
    },

    searchByAccountId: async (accountId: string): Promise<OrderReadResponse[]> => {
        const result = await orderApi.search({ accountId });
        return result.content;
    }
};