import axios from 'axios';
import type { 
    OrderReadResponse, 
    OrderSearchParams, 
    OrderWriteRequest,
    OrderDetailReadResponse 
} from '../types/types';

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

export const orderApi = {
    // Get all orders
    getAll: async (): Promise<OrderReadResponse[]> => {
        try {
            const response = await axios.get<OrderReadResponse[]>(`${API_BASE_URL}/api/orders`, {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    },

    // Search orders with filters
    search: async (params: OrderSearchParams = {}): Promise<OrderReadResponse[]> => {
        try {
            const searchParams = new URLSearchParams();
            
            if (params.id) searchParams.append('id', params.id);
            if (params.date) searchParams.append('date', params.date);
            if (params.totalAmount) searchParams.append('totalAmount', params.totalAmount.toString());
            if (params.status) searchParams.append('status', params.status);
            if (params.page !== undefined) searchParams.append('page', params.page.toString());
            if (params.size !== undefined) searchParams.append('size', params.size.toString());
            if (params.sort && params.sort.length > 0) {
                params.sort.forEach(sortParam => searchParams.append('sort', sortParam));
            }

            const response = await axios.get<OrderReadResponse[]>(`${API_BASE_URL}/api/orders/search`, {
                params: searchParams,
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            console.error('Error searching orders:', error);
            throw error;
        }
    },

    // Get order by ID
    getById: async (id: string): Promise<OrderReadResponse | null> => {
        try {
            const results = await orderApi.search({ id });
            return results.length > 0 ? results[0] : null;
        } catch (error) {
            console.error('Error fetching order by ID:', error);
            throw error;
        }
    },

    // Get order details by order ID
    getDetailsById: async (orderId: string): Promise<OrderDetailReadResponse[]> => {
        try {
            const response = await axios.get<OrderDetailReadResponse[]>(
                `${API_BASE_URL}/api/orders/${orderId}`,
                {
                    headers: getAuthHeaders()
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching order details:', error);
            throw error;
        }
    },

    // Create new order
    create: async (orderData: OrderWriteRequest): Promise<string> => {
        try {
            const response = await axios.post<string>(
                `${API_BASE_URL}/api/orders`,
                orderData,
                {
                    headers: getAuthHeaders()
                }
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
            await axios.delete(`${API_BASE_URL}/api/orders/${id}`, {
                headers: getAuthHeaders()
            });
        } catch (error) {
            console.error('Error deleting order:', error);
            throw error;
        }
    },

    // Convenience methods for common searches
    searchByStatus: async (status: string): Promise<OrderReadResponse[]> => {
        return orderApi.search({ status });
    },

    searchByDate: async (date: string): Promise<OrderReadResponse[]> => {
        return orderApi.search({ date });
    },

    searchByAccountId: async (accountId: string): Promise<OrderReadResponse[]> => {
        return orderApi.search({ id: accountId });
    }
};