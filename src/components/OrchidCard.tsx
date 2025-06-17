import React from 'react';
import type { OrchidDTO } from '../types/types';
import { useCart } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';

interface OrchidCardProps {
  orchid: OrchidDTO;
  onViewDetails: (orchid: OrchidDTO) => void;
}

export const OrchidCard: React.FC<OrchidCardProps> = ({ orchid, onViewDetails }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(orchid, 1);
  };

  return (
    <div 
      onClick={() => onViewDetails(orchid)}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Fixed height image container */}
      <div className="w-full h-48 relative">
        <img
          src={orchid.url}
          alt={orchid.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          {orchid.isNatural && (
            <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded">
              Natural
            </span>
          )}
        </div>
      </div>

      {/* Fixed height content container */}
      <div className="p-4 h-48 flex flex-col">
        {/* Title with truncate */}
        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
          {orchid.name}
        </h3>

        {/* Description with line clamp */}
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
          {orchid.description}
        </p>

        {/* Category */}
        <p className="text-sm text-gray-500 mb-2 truncate">
          Category: {orchid.categoryName}
        </p>

        {/* Price and Add to Cart - pushed to bottom */}
        <div className="mt-auto flex justify-between items-center">
          <span className="text-lg font-bold text-emerald-600">
            ${orchid.price.toFixed(2)}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-emerald-600 text-white p-2 rounded-full hover:bg-emerald-700 transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};