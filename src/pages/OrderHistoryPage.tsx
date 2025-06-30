import React, { useState, useEffect } from 'react';
import { Calendar, Package, DollarSign, Eye, Search } from 'lucide-react';
import { orderApi } from '../api/orderApi';
import { useAuth } from '../context/AuthContext';
import { Pagination } from '../components/Pagination';
import type { OrderReadResponse, OrderDetailReadResponse } from '../types/types';

interface OrderHistoryState {
  orders: OrderReadResponse[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export const OrderHistoryPage: React.FC = () => {
  const { user } = useAuth();
  const [state, setState] = useState<OrderHistoryState>({
    orders: [],
    loading: false,
    error: null,
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    pageSize: 10
  });
  
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: ''
  });
  
  const [selectedOrder, setSelectedOrder] = useState<OrderReadResponse | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetailReadResponse[]>([]);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const fetchOrders = async (page: number = 0) => {
    if (!user?.id) return;

    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const searchParams: any = {
        accountId: user.id,
        page,
        size: state.pageSize,
        sort: ['orderDate,desc']
      };

      // Add filters if they exist
      if (filters.status) searchParams.status = filters.status;
      if (filters.startDate) searchParams.date = filters.startDate;
      if (filters.minAmount) searchParams.totalAmount = parseFloat(filters.minAmount);

      const results = await orderApi.search(searchParams);
      
      setState(prev => ({
        ...prev,
        orders: results.content,
        currentPage: results.page,
        totalPages: results.totalPages,
        totalItems: results.totalElements,
        loading: false
      }));
    } catch (err) {
      console.error('Error fetching orders:', err);
      setState(prev => ({
        ...prev,
        error: 'Failed to load order history. Please try again.',
        loading: false
      }));
    }
  };

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const details = await orderApi.getDetailsById(orderId);
      setOrderDetails(details);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setOrderDetails([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user?.id]);

  const handleViewDetails = async (order: OrderReadResponse) => {
    setSelectedOrder(order);
    await fetchOrderDetails(order.id);
    setShowOrderDetails(true);
  };

  const handlePageChange = (newPage: number) => {
    fetchOrders(newPage);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    fetchOrders(0); // Reset to first page when searching
  };

  const handleClearFilters = () => {
    setFilters({
      status: '',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: ''
    });
    fetchOrders(0);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
          <p className="text-gray-600">You need to be signed in to view your order history.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order History</h1>
          <p className="text-gray-600 mt-2">Track and manage your orchid orders</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Orders</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Amount ($)</label>
              <input
                type="number"
                step="0.01"
                value={filters.minAmount}
                onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                placeholder="0.00"
              />
            </div>

            <div className="flex items-end space-x-2">
              <button
                onClick={handleSearch}
                className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </button>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {state.loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-lg text-gray-600">Loading your orders...</div>
          </div>
        )}

        {/* Error State */}
        {state.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <div className="text-red-800">{state.error}</div>
          </div>
        )}

        {/* Orders List */}
        {!state.loading && !state.error && (
          <>
            {state.orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Orders Found</h3>
                <p className="text-gray-600">You haven't placed any orders yet or no orders match your filters.</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {state.orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900">
                              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                              {new Date(order.orderDate).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm font-medium text-gray-900">
                              <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                              {order.totalAmount.toFixed(2)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleViewDetails(order)}
                              className="text-emerald-600 hover:text-emerald-900 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-gray-200">
                  {state.orders.map((order) => (
                    <div key={order.id} className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(order.orderDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm font-medium text-gray-900">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {order.totalAmount.toFixed(2)}
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="w-full text-center py-2 text-emerald-600 hover:text-emerald-900 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Page Jump Input */}
            {state.totalPages > 2 && (
              <div className="flex justify-center items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Jump to page:</span>
                <input
                  type="number"
                  min="1"
                  max={state.totalPages}
                  placeholder={`1-${state.totalPages}`}
                  className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const page = parseInt((e.target as HTMLInputElement).value);
                      if (page >= 1 && page <= state.totalPages) {
                        handlePageChange(page - 1); // Convert to 0-based
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
                <span className="text-xs text-gray-500">Press Enter to go</span>
              </div>
            )}

            {/* Quick Page Navigation */}
            {state.totalPages > 5 && (
              <div className="flex justify-center items-center space-x-2 mb-4">
                <span className="text-sm text-gray-600">Quick jump:</span>
                <button
                  onClick={() => handlePageChange(0)}
                  disabled={state.currentPage === 0}
                  className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-200 transition-colors"
                >
                  First
                </button>
                {state.currentPage > 4 && (
                  <button
                    onClick={() => handlePageChange(Math.max(0, state.currentPage - 5))}
                    className="px-3 py-1 text-xs bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors"
                  >
                    -5
                  </button>
                )}
                {state.currentPage + 5 < state.totalPages && (
                  <button
                    onClick={() => handlePageChange(Math.min(state.totalPages - 1, state.currentPage + 5))}
                    className="px-3 py-1 text-xs bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors"
                  >
                    +5
                  </button>
                )}
                <button
                  onClick={() => handlePageChange(state.totalPages - 1)}
                  disabled={state.currentPage === state.totalPages - 1}
                  className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-200 transition-colors"
                >
                  Last
                </button>
              </div>
            )}

            {/* Pagination */}
            {state.totalPages > 1 && (
              <Pagination
                currentPage={state.currentPage + 1} // Convert to 1-based for UI
                totalPages={state.totalPages}
                totalItems={state.totalItems}
                pageSize={state.pageSize}
                onPageChange={(page) => handlePageChange(page - 1)} // Convert back to 0-based
              />
            )}
          </>
        )}

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Order Details - #{selectedOrder.id}
                </h3>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Order Date</label>
                    <p className="text-gray-900">{new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Total Amount</label>
                    <p className="text-gray-900 font-semibold">${selectedOrder.totalAmount.toFixed(2)}</p>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h4>
                  {orderDetails.length > 0 ? (
                    <div className="space-y-3">
                      {orderDetails.map((detail) => (
                        <div key={detail.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                          <div className="flex items-center space-x-4">
                            <Package className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                            <div>
                              <p className="font-semibold text-gray-900">{detail.orchidName}</p>
                              <p className="text-sm text-gray-600">Quantity: {detail.quantity}</p>
                              <p className="text-sm text-gray-600">Unit Price: ${detail.price.toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-lg text-gray-900">
                              ${(detail.price * detail.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">Total</p>
                          </div>
                        </div>
                      ))}
                      
                      {/* Order Summary */}
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-900">Order Total:</span>
                          <span className="text-xl font-bold text-emerald-600">
                            ${selectedOrder.totalAmount.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">No order details available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};