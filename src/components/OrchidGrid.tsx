import { useState } from 'react';
import { Filter, Search } from 'lucide-react';
import type { OrchidDTO, CategoryDTO } from '../types/types';
import { OrchidCard } from './OrchidCard';

interface OrchidGridProps {
  orchids: OrchidDTO[];
  categories?: CategoryDTO[];
  onViewDetails: (orchid: OrchidDTO) => void;
}

export function OrchidGrid({ orchids, categories = [], onViewDetails }: OrchidGridProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map(category => ({
      value: category.id || category.name.toLowerCase(),
      label: category.name
    }))
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'natural', label: 'Natural First' },
    { value: 'price', label: 'Price' },
    { value: 'category', label: 'Category' },
  ];

  const filteredOrchids = orchids
    .filter(orchid => {
      const matchesSearch = orchid.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (orchid.categoryName && orchid.categoryName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (orchid.description && orchid.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || 
                             (orchid.categoryName && orchid.categoryName === selectedCategory) ||
                             (orchid.categoryName && orchid.categoryName.toLowerCase() === selectedCategory);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'natural':
          // Sort natural orchids first (true string value comes first)
          if (a.isNatural === 'true' && b.isNatural !== 'true') return -1;
          if (a.isNatural !== 'true' && b.isNatural === 'true') return 1;
          return 0;
        case 'price':
          const priceA = a.price || 50;
          const priceB = b.price || 50;
          return priceA - priceB;
        case 'category':
          return (a.categoryName || '').localeCompare(b.categoryName || '');
        default:
          return a.name.localeCompare(b.name);
      }
    });

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

      {/* Filters and Search */}
      <div className="mb-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search orchids..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Filters Toggle (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2 rounded-lg"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>

          {/* Desktop Filters */}
          <div className={`flex flex-col lg:flex-row gap-4 ${showFilters ? 'block' : 'hidden lg:flex'}`}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {categoryOptions.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  Sort by {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredOrchids.length} of {orchids.length} orchids
        </p>
      </div>

      {/* Orchid Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredOrchids.map(orchid => (
          <OrchidCard
            key={orchid.id}
            orchid={orchid}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>

      {/* No Results */}
      {filteredOrchids.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No orchids found</h3>
          <p className="text-gray-600">
            Try adjusting your search terms or filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
}