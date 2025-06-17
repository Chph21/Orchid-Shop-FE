import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export function Cart({ isOpen, onClose, onCheckout }: CartProps) {
  const { items, total, itemCount, updateQuantity, removeFromCart } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
      <div className="bg-white h-full w-full max-w-md flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Shopping Cart</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Cart Items - Scrollable Area */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Your cart is empty
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.orchid.id} className="p-6">
                  <div className="flex items-center space-x-4 bg-gray-50 rounded-lg p-4">
                    <img
                      src={item.orchid.url} 
                      alt={item.orchid.name} 
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = '';
                      }}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.orchid.name} 
                      </h3>
                      <p className="text-sm text-gray-500 italic">
                        {item.orchid.description} 
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        {item.orchid.isNatural === 'true' && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Natural
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-semibold text-emerald-600">
                        ${item.orchid.price.toFixed(2)} 
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.orchid.id!, item.quantity - 1)}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.orchid.id!, item.quantity + 1)}
                        className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.orchid.id!)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="border-t border-gray-200 p-6 bg-white">
          {/* Subtotal */}
          <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
            <p>Subtotal ({itemCount} items)</p>
            <p>${total.toFixed(2)}</p>
          </div>

          {/* Buttons */}
          <div className="space-y-4">
            <button
              onClick={onCheckout}
              disabled={items.length === 0}
              className="w-full bg-emerald-600 text-white px-6 py-3 rounded-md font-medium 
                       hover:bg-emerald-700 transition-colors disabled:bg-gray-300"
            >
              Checkout
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-100 text-gray-800 px-6 py-3 rounded-md font-medium 
                       hover:bg-gray-200 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}