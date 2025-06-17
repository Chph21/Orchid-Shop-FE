import React, { useState } from 'react';
import { X, ArrowLeft, ArrowRight, Truck, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ShippingForm } from './ShippingForm';
import { OrderSummary } from './OrderSummary';
import { OrderConfirmation } from './OrderConfirmation';

interface CheckoutFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

export type CheckoutStep = 'shipping' | 'review' | 'confirmation';

export interface ShippingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  apartment?: string;
}

export const CheckoutFlow: React.FC<CheckoutFlowProps> = ({ isOpen, onClose }) => {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [orderNumber, setOrderNumber] = useState<string>('');

  if (!isOpen) return null;

  const steps = [
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'review', label: 'Review', icon: Check },
  ];

  const handleNext = () => {
    switch (currentStep) {
      case 'shipping':
        setCurrentStep('review');
        break;
      case 'review':
        // Process order - In real app, this would call an API
        const newOrderNumber = `ORD-${Date.now()}`;
        setOrderNumber(newOrderNumber);
        setCurrentStep('confirmation');
        clearCart();
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'review':
        setCurrentStep('shipping');
        break;
    }
  };

  const handleClose = () => {
    if (currentStep === 'confirmation') {
      onClose();
      setCurrentStep('shipping');
      setShippingData(null);
      setOrderNumber('');
    } else {
      onClose();
    }
  };

  const getShippingCost = () => total >= 100 ? 0 : 9.99; // Free shipping over $100
  const getTax = () => total * 0.08; // 8% tax
  const getFinalTotal = () => total + getShippingCost() + getTax();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {currentStep === 'confirmation' ? 'Order Confirmed' : 'Checkout'}
            </h2>
            {currentStep !== 'confirmation' && (
              <div className="flex items-center space-x-2">
                {steps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = step.id === currentStep;
                  const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
                  
                  return (
                    <div key={step.id} className="flex items-center">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        isCompleted 
                          ? 'bg-emerald-600 text-white' 
                          : isActive 
                            ? 'bg-emerald-100 text-emerald-600 border-2 border-emerald-600' 
                            : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isCompleted ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <StepIcon className="h-4 w-4" />
                        )}
                      </div>
                      <span className={`ml-2 text-sm font-medium ${
                        isActive ? 'text-emerald-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {step.label}
                      </span>
                      {index < steps.length - 1 && (
                        <div className={`w-8 h-px mx-4 ${
                          isCompleted ? 'bg-emerald-600' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {currentStep === 'shipping' && (
                <ShippingForm
                  data={shippingData}
                  user={user}
                  onDataChange={setShippingData}
                  onNext={handleNext}
                />
              )}
              
              {currentStep === 'review' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900">Review Your Order</h3>
                  
                  {/* Shipping Info */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Shipping Information</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="font-medium text-gray-900">{shippingData?.firstName} {shippingData?.lastName}</p>
                      <p>{shippingData?.email}</p>
                      <p>{shippingData?.phone}</p>
                      <p>{shippingData?.address}</p>
                      {shippingData?.apartment && <p>{shippingData.apartment}</p>}
                      <p>{shippingData?.city}, {shippingData?.state} {shippingData?.zipCode}</p>
                      <p>{shippingData?.country}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                    <div className="space-y-3">
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
                              <h5 className="font-medium text-gray-900">{item.orchid.name}</h5>
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
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <button
                      onClick={handleBack}
                      className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back to Shipping</span>
                    </button>
                    <button
                      onClick={handleNext}
                      className="flex items-center space-x-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                    >
                      <span>Place Order</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 'confirmation' && (
                <OrderConfirmation
                  orderNumber={orderNumber}
                  shippingData={shippingData!}
                  items={items}
                  total={getFinalTotal()}
                />
              )}
            </div>

            {/* Order Summary Sidebar */}
            {currentStep !== 'confirmation' && (
              <div className="lg:col-span-1">
                <OrderSummary
                  items={items}
                  subtotal={total}
                  shipping={getShippingCost()}
                  tax={getTax()}
                  total={getFinalTotal()}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};