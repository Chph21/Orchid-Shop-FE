import React, { useState } from 'react';
import { X, ShoppingCart, Minus, Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import type { OrchidDTO } from '../types/types';

interface OrchidDetailProps {
  orchid: OrchidDTO;
  onClose?: () => void;
}

export const OrchidDetail: React.FC<OrchidDetailProps> = ({ orchid, onClose }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(orchid);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header with close button */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Image */}
          <div className="aspect-square relative">
            <img
              src={orchid.url}
              alt={orchid.name}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/400x400?text=Orchid';
              }}
            />
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{orchid.name}</h1>
              <p className="text-sm text-emerald-600 mt-1">
                {orchid.categoryName}
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">Description</h2>
              <p className="text-gray-600 mt-2">{orchid.description}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Type</span>
                <span className="text-gray-900">
                  {orchid.isNatural === 'true' ? 'Natural' : 'Hybrid'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600">Price</span>
                <span className="text-2xl font-bold text-emerald-600">
                  ${orchid.price.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            {user && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center space-x-2 px-6 py-4 rounded-lg font-semibold transition-all duration-200 bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};