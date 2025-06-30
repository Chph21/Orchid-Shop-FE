import React, { useState, useEffect, useCallback } from 'react';
import { Filter, Search } from 'lucide-react';
import { orchidApi } from '../api/orchidApi';
import { categoryApi } from '../api/categoryApi';
import { OrchidCard } from '../components/OrchidCard';
import { FilterPopup } from '../components/FilterPopup';
import { Pagination } from '../components/Pagination';
import type { OrchidReadResponse, CategoryDTO, OrchidSearchParams} from '../types/types';

interface ShopPageState {
  orchids: OrchidReadResponse[];
  categories: CategoryDTO[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export const ShopPage: React.FC = () => {
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [searchFilters, setSearchFilters] = useState<OrchidSearchParams>({
    sort: ['name,asc']
  });
  
  const [state, setState] = useState<ShopPageState>({
    orchids: [],
    categories: [],
    loading: false,
    error: null,
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    pageSize: 9
  });

  const fetchOrchids = useCallback(async (page: number = 1, filters: OrchidSearchParams = {}) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const searchParams: OrchidSearchParams = {
        ...filters,
        page: page,
        size: state.pageSize,
        sort: filters.sort || ['name,asc']
      };

      // Try to use the new paginated endpoint first, fallback to old method
      try {
        const paginatedResult = await orchidApi.searchPaginated(searchParams);
        
        setState(prev => ({
          ...prev,
          orchids: paginatedResult.content,
          totalItems: paginatedResult.totalElements,
          totalPages: paginatedResult.totalPages,
          currentPage: paginatedResult.page, // Convert back to 1-based for UI
          loading: false
        }));
      } catch (paginatedError) {
        // Fallback to old search method if paginated endpoint doesn't exist
        console.warn('Paginated search not available, falling back to regular search:', paginatedError);
        
        const results = (await orchidApi.searchPaginated(searchParams)).content;
        
        // Frontend pagination fallback
        const totalItems = results.length;
        const totalPages = Math.ceil(totalItems / state.pageSize);
        
        const startIndex = (page - 1) * state.pageSize;
        const endIndex = startIndex + state.pageSize;
        const pageOrchids = results.slice(startIndex, endIndex);
        
        setState(prev => ({
          ...prev,
          orchids: pageOrchids,
          totalItems,
          totalPages,
          currentPage: page,
          loading: false
        }));
      }
    } catch (err) {
      console.error('Error fetching orchids:', err);
      setState(prev => ({
        ...prev,
        error: 'Failed to load orchids. Please try again.',
        loading: false
      }));
    }
  }, [state.pageSize]);

  const fetchCategories = useCallback(async () => {
    try {
      const categories = await categoryApi.getAll();
      setState(prev => ({ ...prev, categories }));
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchOrchids(1, searchFilters);
  }, [searchFilters, fetchOrchids]);

  const handleApplyFilters = (filters: OrchidSearchParams) => {
    setSearchFilters(filters);
  };

  const handlePageChange = (page: number) => {
    fetchOrchids(page, searchFilters);
  };

  const handleQuickSearch = (searchTerm: string) => {
    const newFilters = { ...searchFilters, name: searchTerm };
    setSearchFilters(newFilters);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Orchid Collection</h2>
        <p className="text-gray-600 max-w-2xl">
          Explore our carefully curated selection of premium orchids. Each variety has been 
          selected for its beauty, health, and unique characteristics.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Quick Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Quick search orchids..."
              defaultValue={searchFilters.name || ''}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleQuickSearch(e.currentTarget.value);
                }
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilterPopup(true)}
            className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span>Advanced Filters</span>
          </button>
        </div>

        {/* Active Filters Display */}
        {(searchFilters.name || searchFilters.categoryName || searchFilters.isNatural || 
          searchFilters.minPrice || searchFilters.maxPrice) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600 mr-2">Active filters:</span>
              {searchFilters.name && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  Name: {searchFilters.name}
                </span>
              )}
              {searchFilters.categoryName && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Category: {searchFilters.categoryName}
                </span>
              )}
              {searchFilters.isNatural && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Type: {searchFilters.isNatural? 'Natural' : 'Hybrid'}
                </span>
              )}
              {(searchFilters.minPrice || searchFilters.maxPrice) && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                  Price: ${searchFilters.minPrice || 0} - ${searchFilters.maxPrice || '∞'}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {state.loading && (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg text-gray-600">Loading orchids...</div>
        </div>
      )}

      {/* Error State */}
      {state.error && (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg text-red-600">{state.error}</div>
        </div>
      )}

      {/* Results */}
      {!state.loading && !state.error && (
        <>
          {/* Results Count and Quick Page Navigation */}
          <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* <p className="text-gray-600">
              Showing {state.orchids.length} of {state.totalItems} orchids
            </p> */}
            
            {/* Quick Page Navigation - only show if more than 1 page */}
            {state.totalPages > 1 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Quick jump:</span>
                <div className="flex items-center space-x-1">
                  {/* First Page */}
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={state.currentPage === 1}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-200 transition-colors"
                  >
                    First
                  </button>
                  
                  {/* Previous 5 pages */}
                  {state.currentPage > 5 && (
                    <button
                      onClick={() => handlePageChange(Math.max(1, state.currentPage - 5))}
                      className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors"
                    >
                      -5
                    </button>
                  )}
                  
                  {/* Next 5 pages */}
                  {state.currentPage + 5 <= state.totalPages && (
                    <button
                      onClick={() => handlePageChange(Math.min(state.totalPages, state.currentPage + 5))}
                      className="px-2 py-1 text-xs bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors"
                    >
                      +5
                    </button>
                  )}
                  
                  {/* Last Page */}
                  <button
                    onClick={() => handlePageChange(state.totalPages)}
                    disabled={state.currentPage === state.totalPages}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded disabled:opacity-50 hover:bg-gray-200 transition-colors"
                  >
                    Last
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Orchid Grid */}
          {state.orchids.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {state.orchids.map(orchid => (
                <OrchidCard
                  key={orchid.id}
                  orchid={orchid}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orchids found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setSearchFilters({ sort: ['name,asc'] });
                }}
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={state.currentPage}
            totalPages={state.totalPages}
            totalItems={state.totalItems}
            pageSize={state.pageSize}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Filter Popup */}
      <FilterPopup
        isOpen={showFilterPopup}
        onClose={() => setShowFilterPopup(false)}
        categories={state.categories}
        onApplyFilters={handleApplyFilters}
        initialFilters={searchFilters}
      />
    </div>
  );
};