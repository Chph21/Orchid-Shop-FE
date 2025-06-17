import React from 'react';
import { Star, ShoppingCart, Eye, Heart } from 'lucide-react';
import type { OrchidDTO } from '../types/types';
import { useCart } from '../context/CartContext';

interface OrchidCardProps {
  orchid: OrchidDTO;
  onViewDetails: (orchid: OrchidDTO) => void;
}

export function OrchidCard({ orchid, onViewDetails }: OrchidCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(orchid);
  };

  // Use the actual price from OrchidDTO, fallback to random price for display
  const displayPrice = orchid.price || Math.floor(Math.random() * 150) + 50; // $50-$200

  return (
    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Natural Badge */}
      {orchid.isNatural === 'true' && (
        <div className="absolute top-3 left-3 z-10 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
          NATURAL
        </div>
      )}

      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={orchid.url}
          alt={orchid.name} 
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/300x256?text=No+Image';
          }}
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => onViewDetails(orchid)}
              className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Eye className="h-5 w-5" />
            </button>
            <button className="bg-white text-gray-800 p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Heart className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-emerald-600 font-medium capitalize">
            {orchid.categoryName || 'Orchid'} 
          </span>
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">
              {(Math.random() * 1.5 + 3.5).toFixed(1)}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors">
          {orchid.name} 
        </h3>
        
        <div className="flex items-center space-x-2 mb-3">
          {orchid.isNatural === 'true' && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Natural
            </span>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {orchid.description || `Beautiful ${orchid.name} orchid with stunning blooms.`}
        </p>

        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-900">
              ${displayPrice.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}