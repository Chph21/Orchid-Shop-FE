import React from 'react';
import type { CartItem } from '../../types/types';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({items}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6 sticky top-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
      
      {/* Items */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.orchid.id} className="flex items-center space-x-3">
            <img
              src={item.orchid.url}
              alt={item.orchid.name}
              className="w-12 h-12 object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.src = '';
              }}
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {item.orchid.name}
              </h4>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              <p className="text-xs text-gray-400">
                {item.orchid.isNatural === 'true' ? 'Natural' : 'Hybrid'}
              </p>
            </div>
            <span className="text-sm font-medium text-gray-900">
              ${((item.orchid.price || 0) * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Totals
      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-900">
            {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="text-gray-900">${tax.toFixed(2)}</span>
        </div>
        
        {/* <div className="border-t border-gray-200 pt-2">
          <div className="flex justify-between">
            <span className="text-base font-semibold text-gray-900">Total</span>
            <span className="text-base font-semibold text-emerald-600">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
      </div> */}

      {/* Security Notice
      <div className="mt-6 text-xs text-gray-500 text-center">
        <p>🔒 Your payment information is secure and encrypted</p>
        <p className="mt-1">30-day healthy arrival guarantee for all orchids</p>
        <p className="mt-1">Free shipping on orders over $100</p>
      </div> */}
    </div>
  );
};