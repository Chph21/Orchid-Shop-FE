import { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, OrchidDTO } from '../types/types';

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

interface CartContextType extends CartState {
  addToCart: (orchid: OrchidDTO, quantity?: number) => void;
  removeFromCart: (orchidId: string) => void;
  updateQuantity: (orchidId: string, quantity: number) => void;
  clearCart: () => void;
}

type CartAction = 
  | { type: 'ADD_TO_CART'; orchid: OrchidDTO; quantity: number }
  | { type: 'REMOVE_FROM_CART'; orchidId: string }
  | { type: 'UPDATE_QUANTITY'; orchidId: string; quantity: number }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.orchid.id === action.orchid.id);
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.orchid.id === action.orchid.id
            ? { ...item, quantity: item.quantity + action.quantity }
            : item
        );
        return calculateTotals({ ...state, items: updatedItems });
      } else {
        const newItem: CartItem = { orchid: action.orchid, quantity: action.quantity };
        return calculateTotals({ ...state, items: [...state.items, newItem] });
      }
    }
    
    case 'REMOVE_FROM_CART': {
      const updatedItems = state.items.filter(item => item.orchid.id !== action.orchidId);
      return calculateTotals({ ...state, items: updatedItems });
    }
    
    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_FROM_CART', orchidId: action.orchidId });
      }
      
      const updatedItems = state.items.map(item =>
        item.orchid.id === action.orchidId
          ? { ...item, quantity: action.quantity }
          : item
      );
      return calculateTotals({ ...state, items: updatedItems });
    }
    
    case 'CLEAR_CART':
      return { items: [], total: 0, itemCount: 0 };
    
    default:
      return state;
  }
};

const calculateTotals = (state: CartState): CartState => {
  const total = state.items.reduce((sum, item) => {
    // Use the actual price from OrchidDTO, fallback to 50 if not available
    const price = item.orchid.price || 50;
    return sum + (price * item.quantity);
  }, 0);
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  return { ...state, total, itemCount };
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], total: 0, itemCount: 0 });

  const addToCart = (orchid: OrchidDTO, quantity: number = 1) => {
    // Ensure orchid has an ID before adding to cart
    if (!orchid.id) {
      console.error('Cannot add orchid to cart: missing ID');
      return;
    }
    dispatch({ type: 'ADD_TO_CART', orchid, quantity });
  };

  const removeFromCart = (orchidId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', orchidId });
  };

  const updateQuantity = (orchidId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', orchidId, quantity });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{
      ...state,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};