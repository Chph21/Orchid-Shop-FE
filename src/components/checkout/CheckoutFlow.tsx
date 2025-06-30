import React from 'react';
import { X, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderApi } from '../../api/orderApi';
import { toast } from 'react-hot-toast';

interface CheckoutFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutFlow: React.FC<CheckoutFlowProps> = ({ isOpen, onClose }) => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();

  if (!isOpen || !user) return null;

  const getShippingCost = () => total >= 100 ? 0 : 9.99;
  const getTax = () => total * 0.08;
  const getFinalTotal = () => total + getShippingCost() + getTax();

  const handleConfirmOrder = async () => {
    try {
      // Create order details from cart items
      const orderDetails = items.map(item => ({
        orchidId: item.orchid.id,
        quantity: item.quantity,
        price: item.orchid.price
      }));

      const orderData = {
        accountId: user.id,
        orderDate: new Date().toISOString(),
        status: 'PENDING',
        totalAmount: getFinalTotal(),
        orderDetails: orderDetails
      };

      await orderApi.create(orderData);
      clearCart();
      toast.success('Order placed successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Review Order</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content - Scrollable Items List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.orchid.id} className="flex gap-4">
                <img
                  src={item.orchid.url}
                  alt={item.orchid.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.orchid.name}</h3>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-gray-600">${item.orchid.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer with Totals and Confirm Button - Fixed */}
        <div className="border-t border-gray-200 p-6 bg-white">
          {/* Order Summary Totals */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>${getShippingCost().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax</span>
              <span>${getTax().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-3">
              <span>Total</span>
              <span>${getFinalTotal().toFixed(2)}</span>
            </div>
          </div>

          {/* Security Note and Confirm Button */}
          <div className="flex flex-col items-center gap-4">
            <div className="text-sm text-gray-500 text-center">
              <p>🔒 Your order information is secure</p>
              <p className="mt-1">Free shipping on orders over $100</p>
            </div>
            
            <button
              onClick={handleConfirmOrder}
              className="w-full md:w-auto bg-emerald-600 text-white px-8 py-3 rounded-lg 
                       font-medium hover:bg-emerald-700 transition-colors flex items-center 
                       justify-center gap-2"
            >
              <Check className="h-5 w-5" />
              <span>Confirm Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};