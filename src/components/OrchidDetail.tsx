import React, { useState } from 'react';
import { ArrowLeft, ShoppingCart, Heart, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import type { OrchidDTO } from '../types/types';
import { toast } from 'react-hot-toast';

interface OrchidDetailProps {
  orchid: OrchidDTO;
}

export const OrchidDetail: React.FC<OrchidDetailProps> = ({ orchid }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = () => {
    addToCart(orchid, quantity);
    toast.success(`Added ${quantity} ${orchid.name} to cart!`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Shop
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="relative">
              <img
                src={orchid.url}
                alt={orchid.name}
                className="w-full h-96 lg:h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/600x400?text=No+Image';
                }}
              />
              {orchid.isNatural && (
                <div className="absolute top-4 left-4">
                  <span className="bg-emerald-100 text-emerald-800 text-sm font-medium px-3 py-1 rounded-full">
                    Natural
                  </span>
                </div>
              )}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
              >
                <Heart className={`h-6 w-6 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
              </button>
            </div>

            {/* Details Section */}
            <div className="p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{orchid.name}</h1>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-emerald-600 text-2xl font-bold">
                    ${orchid.price.toFixed(2)}
                  </span>
                  {orchid.categoryName && (
                    <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {orchid.categoryName}
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {orchid.description}
                </p>
              </div>

              {/* Orchid Details */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Orchid Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-1">Type</h4>
                    <p className="text-gray-600">
                      {orchid.isNatural? 'Natural' : 'Hybrid'}
                    </p>
                  </div>
                  {orchid.categoryName && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-1">Category</h4>
                      <p className="text-gray-600">{orchid.categoryName}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Care Tips */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Care Instructions</h3>
                <div className="bg-emerald-50 p-4 rounded-lg">
                  <ul className="space-y-2 text-sm text-emerald-800">
                    <li>• Water weekly or when potting medium is nearly dry</li>
                    <li>• Provide bright, indirect light</li>
                    <li>• Maintain humidity levels between 40-70%</li>
                    <li>• Keep in temperatures between 65-80°F (18-27°C)</li>
                    <li>• Fertilize monthly during growing season</li>
                  </ul>
                </div>
              </div>

              {/* Add to Cart Section */}
              <div className="border-t border-gray-200 pt-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                      Quantity:
                    </label>
                    <select
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-emerald-500"
                    >
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    <span>Add to Cart - ${(orchid.price * quantity).toFixed(2)}</span>
                  </button>
                  
                  <button
                    onClick={() => navigate('/shop')}
                    className="flex-1 sm:flex-none bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>

                {!user && (
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    Sign in for faster checkout and to track your orders
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Choose Our Orchids?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-emerald-600 font-bold">✓</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600 text-sm">
                Each orchid is carefully selected and inspected before shipping
              </p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-emerald-600 font-bold">📦</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Safe Shipping</h3>
              <p className="text-gray-600 text-sm">
                Specialized packaging ensures your orchid arrives in perfect condition
              </p>
            </div>
            <div className="text-center">
              <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-emerald-600 font-bold">💬</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Expert Support</h3>
              <p className="text-gray-600 text-sm">
                Get ongoing care advice from our orchid specialists
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};