import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, ArrowLeft, Heart, Share2, Star, Truck, Shield, Headphones } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import type { OrchidDTO } from '../types/types';

interface OrchidDetailProps {
  orchid: OrchidDTO;
}

export const OrchidDetail: React.FC<OrchidDetailProps> = ({ orchid }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(orchid.url);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = () => {
    addToCart(orchid, quantity);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: orchid.name,
          text: orchid.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Mock related orchids (in a real app, this would come from an API)
  const relatedOrchids = [
    { id: '1', name: 'Purple Phalaenopsis', price: 45.99, url: 'https://images.pexels.com/photos/1034584/pexels-photo-1034584.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: '2', name: 'White Dendrobium', price: 52.99, url: 'https://images.pexels.com/photos/1379927/pexels-photo-1379927.jpeg?auto=compress&cs=tinysrgb&w=300' },
    { id: '3', name: 'Pink Cattleya', price: 68.99, url: 'https://images.pexels.com/photos/1034584/pexels-photo-1034584.jpeg?auto=compress&cs=tinysrgb&w=300' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Navigation */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <button
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-gray-700"
            >
              Home
            </button>
            <span className="text-gray-400">/</span>
            <button
              onClick={() => navigate('/shop')}
              className="text-gray-500 hover:text-gray-700"
            >
              Shop
            </button>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium">{orchid.name}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8 group"
        >
          <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square relative overflow-hidden rounded-2xl bg-gray-100">
              <img
                src={selectedImage}
                alt={orchid.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/600x600?text=Orchid';
                }}
              />
              
              {/* Favorite Button */}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
              >
                <Heart className={`h-6 w-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              </button>

              {/* Natural Badge */}
              {orchid.isNatural === 'true' && (
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Natural
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {[orchid.url, orchid.url, orchid.url, orchid.url].map((url, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(url)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === url ? 'border-emerald-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={url}
                    alt={`${orchid.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-emerald-600 font-medium text-sm uppercase tracking-wide">
                  {orchid.categoryName}
                </span>
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{orchid.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <span className="text-gray-600 text-sm">(4.9) • 127 reviews</span>
              </div>

              <div className="text-3xl font-bold text-emerald-600 mb-6">
                ${orchid.price.toFixed(2)}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600 leading-relaxed">{orchid.description}</p>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-2 gap-4 py-6 border-t border-b border-gray-200">
              <div>
                <span className="text-gray-500 text-sm">Type</span>
                <p className="font-medium text-gray-900">
                  {orchid.isNatural === 'true' ? 'Natural Species' : 'Hybrid Variety'}
                </p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Category</span>
                <p className="font-medium text-gray-900">{orchid.categoryName}</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Care Level</span>
                <p className="font-medium text-gray-900">Intermediate</p>
              </div>
              <div>
                <span className="text-gray-500 text-sm">Bloom Season</span>
                <p className="font-medium text-gray-900">Spring - Summer</p>
              </div>
            </div>

            {/* Add to Cart Section */}
            {user && (
              <div className="space-y-6">
                {/* Quantity Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-3 hover:bg-gray-100 transition-colors rounded-l-lg"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-6 py-3 text-center font-medium min-w-[60px]">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-3 hover:bg-gray-100 transition-colors rounded-r-lg"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-gray-500 text-sm">
                      Total: ${(orchid.price * quantity).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center space-x-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <ShoppingCart className="h-6 w-6" />
                  <span>Add to Cart</span>
                </button>

                {/* Buy Now Button */}
                <button className="w-full px-8 py-4 rounded-xl font-semibold text-lg border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 transition-colors">
                  Buy Now
                </button>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-1 gap-4 pt-6">
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-emerald-600" />
                <span className="text-gray-700">Free shipping on orders over $100</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-emerald-600" />
                <span className="text-gray-700">30-day healthy arrival guarantee</span>
              </div>
              <div className="flex items-center space-x-3">
                <Headphones className="h-5 w-5 text-emerald-600" />
                <span className="text-gray-700">Expert care support included</span>
              </div>
            </div>
          </div>
        </div>

        {/* Care Instructions */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Care Instructions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">💧 Watering</h3>
              <p className="text-gray-600">
                Water weekly, allowing the potting medium to dry slightly between waterings. 
                Use lukewarm water and avoid getting water on the leaves.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">☀️ Light</h3>
              <p className="text-gray-600">
                Bright, indirect light is ideal. East or west-facing windows work well. 
                Avoid direct sunlight which can burn the leaves.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">🌡️ Temperature</h3>
              <p className="text-gray-600">
                Maintain temperatures between 65-80°F (18-27°C) during the day, 
                with a slight drop at night to encourage blooming.
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedOrchids.map((related) => (
              <div
                key={related.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/orchid/${related.id}`)}
              >
                <div className="aspect-square">
                  <img
                    src={related.url}
                    alt={related.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">{related.name}</h3>
                  <p className="text-emerald-600 font-bold">${related.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};