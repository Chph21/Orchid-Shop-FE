import React from 'react';
import { Check, Download, Mail, Truck } from 'lucide-react';
import type { ShippingData } from './CheckoutFlow';
import type { CartItem } from '../../types/types';

interface OrderConfirmationProps {
  orderNumber: string;
  shippingData: ShippingData;
  items: CartItem[];
  total: number;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  orderNumber,
  shippingData,
  items,
  total
}) => {
  return (
    <div className="max-w-2xl mx-auto text-center space-y-8">
      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
          <Check className="h-10 w-10 text-emerald-600" />
        </div>
      </div>

      {/* Success Message */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
        <p className="text-lg text-gray-600 mb-4">
          Thank you for your orchid purchase. Your order has been successfully placed.
        </p>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 inline-block">
          <p className="text-sm font-medium text-emerald-800">
            Order Number: <span className="font-bold">{orderNumber}</span>
          </p>
        </div>
      </div>

      {/* Order Details */}
      <div className="bg-gray-50 rounded-lg p-6 text-left">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
        
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.orchid.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={item.orchid.url}
                  alt={item.orchid.name}
                  className="w-12 h-12 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/48x48?text=Orchid';
                  }}
                />
                <div>
                  <h4 className="font-medium text-gray-900">{item.orchid.name}</h4>
                  <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  <p className="text-xs text-gray-400">
                    {item.orchid.isNatural === 'true' ? 'Natural' : 'Hybrid'}
                  </p>
                </div>
              </div>
              <span className="font-medium text-gray-900">
                ${((item.orchid.price || 0) * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
          
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span className="text-emerald-600">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Information */}
      <div className="bg-gray-50 rounded-lg p-6 text-left">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p className="font-medium text-gray-900">
            {shippingData.firstName} {shippingData.lastName}
          </p>
          <p>{shippingData.email}</p>
          <p>{shippingData.phone}</p>
          <p>{shippingData.address}</p>
          {shippingData.apartment && <p>{shippingData.apartment}</p>}
          <p>{shippingData.city}, {shippingData.state} {shippingData.zipCode}</p>
          <p>{shippingData.country}</p>
        </div>
      </div>

      {/* Next Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <h4 className="font-medium text-gray-900 mb-1">Confirmation Email</h4>
          <p className="text-sm text-gray-600">
            We've sent a confirmation email to {shippingData.email}
          </p>
        </div>

        <div className="text-center p-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Truck className="h-6 w-6 text-purple-600" />
          </div>
          <h4 className="font-medium text-gray-900 mb-1">Shipping Updates</h4>
          <p className="text-sm text-gray-600">
            You'll receive updates about your orchid's journey to you
          </p>
        </div>

        <div className="text-center p-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Download className="h-6 w-6 text-green-600" />
          </div>
          <h4 className="font-medium text-gray-900 mb-1">Care Guide</h4>
          <p className="text-sm text-gray-600">
            Download your personalized orchid care guide
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
          Download Orchid Care Guide
        </button>
        <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          Continue Shopping
        </button>
      </div>

      {/* Support */}
      <div className="text-center text-sm text-gray-500">
        <p>
          Questions about your orchid order? Contact us at{' '}
          <a href="mailto:support@orchidhaven.com" className="text-emerald-600 hover:text-emerald-700">
            support@orchidhaven.com
          </a>
        </p>
        <p className="mt-1">🌺 Thank you for choosing Orchid Haven!</p>
      </div>
    </div>
  );
};