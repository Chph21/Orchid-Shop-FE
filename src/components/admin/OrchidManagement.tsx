import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Search, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useOrchid } from '../../context/OrchidContext';
import { orchidApi } from '../../api/orchidApi';
import { categoryApi } from '../../api/categoryApi';
import { OrchidEditModal } from './modals/OrchidEditModal';
import { toast } from 'react-hot-toast';
import type { CategoryDTO, OrchidReadResponse, PaginatedResponse } from '../../types/types';

export function OrchidManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [editingOrchid, setEditingOrchid] = useState<any>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  
  // Pagination states
  const [paginatedOrchids, setPaginatedOrchids] = useState<PaginatedResponse<OrchidReadResponse> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState({ field: 'name', direction: 'asc' });
  const [filters, setFilters] = useState({
    categoryName: '',
    isNatural: '',
    minPrice: '',
    maxPrice: ''
  });

  const { refreshOrchids } = useOrchid();

  const fetchOrchids = async (page: number = currentPage, size: number = pageSize, searchTerm: string = '') => {
    setLocalLoading(true);
    setLocalError(null);
    try {
      const result = await orchidApi.search({
        name: searchTerm || undefined,
        categoryName: filters.categoryName || undefined,
        isNatural: filters.isNatural ? filters.isNatural === 'true' : undefined,
        minPrice: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
        page: page,
        size: size,
        sort: [`${sort.field},${sort.direction}`]
      });
      setPaginatedOrchids(result);
    } catch (err) {
      setLocalError('Failed to load orchids');
    } finally {
      setLocalLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const result = await categoryApi.getAll();
      setCategories(result);
    } catch (err) {
      console.error('Error fetching categories:', err);
      toast.error('Failed to load categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchOrchids();
  }, [currentPage, pageSize, sort, filters]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchOrchids(1, pageSize, searchTerm);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleDeleteOrchid = async (orchidId: string) => {
    if (window.confirm('Are you sure you want to delete this orchid?')) {
      try {
        setLocalLoading(true);
        await orchidApi.delete(orchidId);
        await refreshOrchids();
        await fetchOrchids(); // Refresh current page
        toast.success('Orchid deleted successfully');
      } catch (err) {
        console.error('Error deleting orchid:', err);
        setLocalError('Failed to delete orchid');
        toast.error('Failed to delete orchid');
      } finally {
        setLocalLoading(false);
      }
    }
  };

  const handleEditOrchid = (orchid: any) => {
    setEditingOrchid(orchid);
  };

  const handleCreateOrchid = () => {
    setIsCreateModalOpen(true);
  };

  const handleModalClose = () => {
    setEditingOrchid(null);
    setIsCreateModalOpen(false);
    refreshOrchids();
    fetchOrchids(currentPage, pageSize, searchTerm);
  };

  // Sorting handlers
  const handleSort = (field: string) => {
    const newDirection = sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc';
    setSort({
      field,
      direction: newDirection
    });
    setCurrentPage(1);
    fetchOrchids(1, pageSize, searchTerm);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchOrchids(page, pageSize, searchTerm);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    setCurrentPage(1);
    fetchOrchids(1, newSize, searchTerm);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Orchid Management</h2>
        <button 
          onClick={handleCreateOrchid}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Orchid</span>
        </button>
      </div>

      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search orchids..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
        >
          Search
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <select
          value={filters.categoryName}
          onChange={(e) => setFilters(prev => ({ ...prev, categoryName: e.target.value }))}
          className="border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        
        <select
          value={filters.isNatural}
          onChange={(e) => setFilters(prev => ({ ...prev, isNatural: e.target.value }))}
          className="border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="">All Types</option>
          <option value="true">Natural</option>
          <option value="false">Hybrid</option>
        </select>
        
        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
          className="border border-gray-300 rounded-lg px-3 py-2"
        />
        
        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
          className="border border-gray-300 rounded-lg px-3 py-2"
        />
        
        <button
          onClick={() => {
            setCurrentPage(1);
            fetchOrchids(1, pageSize, searchTerm);
          }}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Apply Filters
        </button>
      </div>

      {/* Loading/Error States */}
      {localLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="text-lg text-gray-600">Loading orchids...</div>
        </div>
      )}

      {localError && (
        <div className="flex justify-center items-center py-8">
          <div className="text-lg text-red-600">{localError}</div>
        </div>
      )}

      {/* Orchids Table */}
      {!localLoading && !localError && paginatedOrchids && (
        <>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      onClick={() => handleSort('name')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Orchid</span>
                        {sort.field === 'name' && (
                          sort.direction === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('categoryName')}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    >
                      <div className="flex items-center space-x-1">
                        <span>Category</span>
                        {sort.field === 'categoryName' && (
                          sort.direction === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Natural
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedOrchids.content.map((orchid) => (
                    <tr key={orchid.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            className="h-10 w-10 rounded-lg object-cover"
                            src={orchid.url}
                            alt={orchid.name}
                            onError={(e) => {
                              e.currentTarget.src = 'https://via.placeholder.com/40x40?text=No+Image';
                            }}
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{orchid.name}</div>
                            <div className="text-sm text-gray-500">ID: {orchid.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-emerald-100 text-emerald-800 rounded-full capitalize">
                          {(orchid.categoryName || 'Uncategorized').toLowerCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          ${(orchid.price || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          orchid.isNatural
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {orchid.isNatural ? 'Natural' : 'Hybrid'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEditOrchid(orchid)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteOrchid(orchid.id!)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {paginatedOrchids && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === paginatedOrchids.totalPages}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{paginatedOrchids.numberOfElements}</span> of{' '}
                    <span className="font-medium">{paginatedOrchids.totalElements}</span> results
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    className="border border-gray-300 rounded-md px-2 py-1"
                  >
                    <option value="5">5 per page</option>
                    <option value="10">10 per page</option>
                    <option value="20">20 per page</option>
                    <option value="50">50 per page</option>
                  </select>
                  
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                    <button
                      onClick={() => handlePageChange(0)}
                      disabled={currentPage <= 1}
                      className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      <ChevronsLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300">
                      Page {currentPage} of {paginatedOrchids.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === paginatedOrchids.totalPages}
                      className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handlePageChange(paginatedOrchids.totalPages)}
                      disabled={currentPage === paginatedOrchids.totalPages}
                      className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      <ChevronsRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Edit/Create Modal */}
      {(editingOrchid || isCreateModalOpen) && (
        <OrchidEditModal
          orchid={editingOrchid}
          isOpen={true}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}