import React, { useState } from 'react';
import { X, Search, Filter } from 'lucide-react';
import type { CategoryDTO, OrchidSearchParams } from '../types/types';

interface FilterPopupProps {
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryDTO[];
  onApplyFilters: (params: OrchidSearchParams) => void;
  initialFilters?: OrchidSearchParams;
}

export const FilterPopup: React.FC<FilterPopupProps> = ({
  isOpen,
  onClose,
  categories,
  onApplyFilters,
  initialFilters = {}
}) => {
  const [filters, setFilters] = useState<OrchidSearchParams>({
    name: initialFilters.name || '',
    categoryName: initialFilters.categoryName || '',
    isNatural: initialFilters.isNatural || '',
    minPrice: initialFilters.minPrice || undefined,
    maxPrice: initialFilters.maxPrice || undefined,
    sort: initialFilters.sort || ['name,asc']
  });

  const handleInputChange = (field: keyof OrchidSearchParams, value: any) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSortChange = (sortValue: string) => {
    setFilters(prev => ({
      ...prev,
      sort: [sortValue]
    }));
  };

  const handleApply = () => {
    // Clean up empty values
    const cleanFilters: OrchidSearchParams = {};
    
    if (filters.name?.trim()) cleanFilters.name = filters.name.trim();
    if (filters.categoryName && filters.categoryName !== 'all') cleanFilters.categoryName = filters.categoryName;
    if (filters.isNatural && filters.isNatural !== 'all') cleanFilters.isNatural = filters.isNatural;
    if (filters.minPrice !== undefined && filters.minPrice > 0) cleanFilters.minPrice = filters.minPrice;
    if (filters.maxPrice !== undefined && filters.maxPrice > 0) cleanFilters.maxPrice = filters.maxPrice;
    if (filters.sort && filters.sort.length > 0) cleanFilters.sort = filters.sort;

    onApplyFilters(cleanFilters);
    onClose();
  };

  const handleClear = () => {
    setFilters({
      name: '',
      categoryName: '',
      isNatural: '',
      minPrice: undefined,
      maxPrice: undefined,
      sort: ['name,asc']
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-emerald-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filter & Sort</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search by Name
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={filters.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Search orchids..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={filters.categoryName || 'all'}
              onChange={(e) => handleInputChange('categoryName', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id || category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={filters.isNatural || 'all'}
              onChange={(e) => handleInputChange('isNatural', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Types</option>
              <option value="true">Natural</option>
              <option value="false">Hybrid</option>
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="number"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleInputChange('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="Min price"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              <div>
                <input
                  type="number"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleInputChange('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="Max price"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={(filters.sort && filters.sort[0]) || 'name,asc'}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="name,asc">Name (A-Z)</option>
              <option value="name,desc">Name (Z-A)</option>
              <option value="price,asc">Price (Low to High)</option>
              <option value="price,desc">Price (High to Low)</option>
              <option value="categoryName,asc">Category (A-Z)</option>
              <option value="categoryName,desc">Category (Z-A)</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            onClick={handleClear}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Clear All
          </button>
          <div className="space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
