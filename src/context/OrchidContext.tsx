import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { orchidApi } from '../api/orchidApi';
import { categoryApi } from '../api/categoryApi';
import type { OrchidDTO, CategoryDTO } from '../types/types';

interface OrchidState {
  orchids: OrchidDTO[];
  categories: CategoryDTO[];
  loading: boolean;
  error: string | null;
}

interface OrchidContextType extends OrchidState {
  refreshOrchids: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

type OrchidAction = 
  | { type: 'FETCH_START' }
  | { type: 'FETCH_ORCHIDS_SUCCESS'; orchids: OrchidDTO[] }
  | { type: 'FETCH_CATEGORIES_SUCCESS'; categories: CategoryDTO[] }
  | { type: 'FETCH_ERROR'; error: string }
  | { type: 'CLEAR_ERROR' };

const OrchidContext = createContext<OrchidContextType | undefined>(undefined);

const orchidReducer = (state: OrchidState, action: OrchidAction): OrchidState => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    
    case 'FETCH_ORCHIDS_SUCCESS':
      return { ...state, orchids: action.orchids, loading: false };
    
    case 'FETCH_CATEGORIES_SUCCESS':
      return { ...state, categories: action.categories, loading: false };
    
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.error };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    default:
      return state;
  }
};

export function OrchidProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(orchidReducer, {
    orchids: [],
    categories: [],
    loading: false,
    error: null
  });

  const refreshOrchids = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const orchidData = await orchidApi.getAll();
      dispatch({ type: 'FETCH_ORCHIDS_SUCCESS', orchids: orchidData });
    } catch (err) {
      const errorMessage = 'Failed to load orchids. Please try again later.';
      dispatch({ type: 'FETCH_ERROR', error: errorMessage });
      console.error('Error fetching orchids:', err);
    }
  };

  const refreshCategories = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const categoryData = await categoryApi.getAll();
      dispatch({ type: 'FETCH_CATEGORIES_SUCCESS', categories: categoryData });
    } catch (err) {
      const errorMessage = 'Failed to load categories. Please try again later.';
      dispatch({ type: 'FETCH_ERROR', error: errorMessage });
      console.error('Error fetching categories:', err);
    }
  };

  const refreshAll = async () => {
    dispatch({ type: 'FETCH_START' });
    try {
      const [orchidData, categoryData] = await Promise.all([
        orchidApi.getAll(),
        categoryApi.getAll()
      ]);
      
      dispatch({ type: 'FETCH_ORCHIDS_SUCCESS', orchids: orchidData });
      dispatch({ type: 'FETCH_CATEGORIES_SUCCESS', categories: categoryData });
    } catch (err) {
      const errorMessage = 'Failed to load data. Please try again later.';
      dispatch({ type: 'FETCH_ERROR', error: errorMessage });
      console.error('Error fetching data:', err);
    }
  };

  // Fetch initial data on mount
  useEffect(() => {
    refreshAll();
  }, []);

  return (
    <OrchidContext.Provider value={{
      ...state,
      refreshOrchids,
      refreshCategories,
      refreshAll
    }}>
      {children}
    </OrchidContext.Provider>
  );
}

export const useOrchid = () => {
  const context = useContext(OrchidContext);
  if (!context) {
    throw new Error('useOrchid must be used within an OrchidProvider');
  }
  return context;
};