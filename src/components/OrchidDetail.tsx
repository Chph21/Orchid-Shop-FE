import { useState } from 'react';
import { X, Star, ShoppingCart, Minus, Plus, Heart, Share2, Truck, Shield, Info } from 'lucide-react';
import type { OrchidDTO } from '../types/types';
import { useCart } from '../context/CartContext';

interface OrchidDetailProps {
  orchid: OrchidDTO;
  onClose: () => void;
}

export function OrchidDetail({ orchid, onClose }: OrchidDetailProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Use actual price from OrchidDTO, fallback to random price for display
  const price = orchid.price || Math.floor(Math.random() * 150) + 50;
  const rating = Math.round((Math.random() * 1.5 + 3.5) * 10) / 10;
  const reviews = Math.floor(Math.random() * 200) + 10;

  const handleAddToCart = () => {
    addToCart(orchid, quantity);
    onClose();
  };

  const careInfo = {
    light: 'Bright, indirect light',
    water: 'Water when substrate is almost dry',
    humidity: '50-70%',
    temperature: '65-80°F (18-27°C)'
  };

  const features = [
    orchid.isNatural === 'true' ? 'Natural variety' : 'Hybrid variety',
    'Beautiful flowers',
    'Easy to care for',
    'Long-lasting blooms',
    'Perfect for home decoration'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{orchid.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden">
              <img
                src={orchid.url} 
                alt={orchid.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/500x500?text=No+Image';
                }}
              />
            </div>
          </div>

          {/* Orchid Info */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-emerald-600 font-medium capitalize">
                  {orchid.categoryName || 'Orchid'} 
                </span>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Heart className="h-5 w-5" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">{orchid.name}</h1>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {rating} ({reviews} reviews)
                  </span>
                </div>
                <div className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  In Stock
                </div>
              </div>

              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ${price.toFixed(2)} 
                </span>
              </div>

              {/* Orchid Properties */}
              <div className="flex items-center space-x-4 mb-4">
                {orchid.isNatural === 'true' && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Natural Variety
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {orchid.description || `${orchid.name} is a beautiful orchid with stunning blooms and elegant appearance. ${orchid.isNatural === 'true' ? 'This natural variety' : 'This hybrid variety'} is perfect for both beginners and experienced orchid enthusiasts.`}
              </p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
              <div className="grid grid-cols-2 gap-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Care Instructions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Care Instructions</h3>
              <div className="bg-emerald-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Light:</span>
                  <span className="text-gray-600">{careInfo.light}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Water:</span>
                  <span className="text-gray-600">{careInfo.water}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Humidity:</span>
                  <span className="text-gray-600">{careInfo.humidity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Temperature:</span>
                  <span className="text-gray-600">{careInfo.temperature}</span>
                </div>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
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

            {/* Guarantees */}
            <div className="border-t border-gray-200 pt-6 space-y-3">
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-emerald-600" />
                <span className="text-sm text-gray-600">Free shipping on orders over $100</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-emerald-600" />
                <span className="text-sm text-gray-600">30-day healthy arrival guarantee</span>
              </div>
              <div className="flex items-center space-x-3">
                <Info className="h-5 w-5 text-emerald-600" />
                <span className="text-sm text-gray-600">Expert care support included</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}