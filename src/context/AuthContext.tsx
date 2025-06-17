import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import { authApi } from '../api/authApi';
import { userApi } from '../api/userApi';
import type { 
  User, 
  LoginRequest, 
  RegisterRequest, 
  LoginResponse, 
  RegisterResponse,
  UserDTO 
} from '../types/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => void;
  register: (userData: RegisterRequest) => Promise<boolean>;
  refreshAccessToken: () => Promise<boolean>;
}

type AuthAction = 
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; user: User; accessToken: string; refreshToken: string }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'SET_USER'; user: User }
  | { type: 'SET_TOKENS'; accessToken: string; refreshToken: string }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; user: User; accessToken: string; refreshToken: string }
  | { type: 'REGISTER_FAILURE' };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'REGISTER_START':
      return { ...state, isLoading: true };
    
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      return { 
        user: action.user, 
        isAuthenticated: true, 
        isLoading: false,
        accessToken: action.accessToken,
        refreshToken: action.refreshToken
      };
    
    case 'LOGIN_FAILURE':
    case 'REGISTER_FAILURE':
      return { 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        accessToken: null,
        refreshToken: null
      };
    
    case 'LOGOUT':
      return { 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        accessToken: null,
        refreshToken: null
      };
    
    case 'SET_USER':
      return { ...state, user: action.user };
    
    case 'SET_TOKENS':
      return { 
        ...state, 
        accessToken: action.accessToken, 
        refreshToken: action.refreshToken 
      };
    
    default:
      return state;
  }
};

// Helper function to transform UserDTO to User
const transformUserDTOToUser = (userDTO: UserDTO): User => {
  return {
    id: userDTO.id || '',
    email: userDTO.email,
    name: userDTO.name,
    role: userDTO.roleName === 'ROLE_ADMIN' ? 'admin' : 'customer'
  };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    accessToken: null,
    refreshToken: null
  });

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem('orchid_user');
    const storedAccessToken = localStorage.getItem('orchid_access_token');
    const storedRefreshToken = localStorage.getItem('orchid_refresh_token');
    
    if (storedUser && storedAccessToken) {
      try {
        const user: User = JSON.parse(storedUser);
        dispatch({ 
          type: 'LOGIN_SUCCESS', 
          user, 
          accessToken: storedAccessToken,
          refreshToken: storedRefreshToken || ''
        });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear corrupted data
        localStorage.removeItem('orchid_user');
        localStorage.removeItem('orchid_access_token');
        localStorage.removeItem('orchid_refresh_token');
      }
    }
  }, []);

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    dispatch({ type: 'LOGIN_START' });
    
    try {
      // Step 1: Authenticate user and get tokens
      const authResponse: LoginResponse = await authApi.login(credentials);

      // Step 2: Set tokens in localStorage temporarily for API calls
      localStorage.setItem('orchid_access_token', authResponse.accessToken);
      localStorage.setItem('orchid_refresh_token', authResponse.refreshToken);

      // Step 3: Fetch user information using the email from auth response
      // Find user by email using dedicated API endpoint
      const currentUser = await userApi.findByEmail(authResponse.email);
      
      if (!currentUser) {
        throw new Error('User information not found after successful authentication');
      }

      // Step 4: Transform UserDTO to User format
      const user: User = transformUserDTOToUser(currentUser);

      // Step 5: Store complete user data
      localStorage.setItem('orchid_user', JSON.stringify(user));

      // Step 6: Update state with complete user information
      dispatch({ 
        type: 'LOGIN_SUCCESS', 
        user, 
        accessToken: authResponse.accessToken,
        refreshToken: authResponse.refreshToken
      });
      
      console.log('Login process completed successfully for user:', user.name);
      return true;

    } catch (error) {
      // Clean up any partial data on error
      localStorage.removeItem('orchid_user');
      localStorage.removeItem('orchid_access_token');
      localStorage.removeItem('orchid_refresh_token');
      
      dispatch({ type: 'LOGIN_FAILURE' });
      return false;
    }
  };

  const register = async (userData: RegisterRequest): Promise<boolean> => {
    dispatch({ type: 'REGISTER_START' });
    
    try {
      // Step 1: Register user
      console.log('Step 1: Registering new user');
      const authResponse: RegisterResponse = await authApi.register(userData);
      console.log('Registration successful');

      // Step 2: Set tokens temporarily
      localStorage.setItem('orchid_access_token', authResponse.accessToken);
      localStorage.setItem('orchid_refresh_token', authResponse.refreshToken);

      // Step 3: Fetch the newly created user information
      console.log('Step 3: Fetching newly created user information for email:', authResponse.email);
      
      // Find user by email using dedicated API endpoint
      const newUser = await userApi.findByEmail(authResponse.email);
      
      if (!newUser) {
        throw new Error('Newly registered user information not found');
      }

      // Step 4: Transform and store user data
      const user: User = transformUserDTOToUser(newUser);
      localStorage.setItem('orchid_user', JSON.stringify(user));

      dispatch({ 
        type: 'REGISTER_SUCCESS', 
        user, 
        accessToken: authResponse.accessToken,
        refreshToken: authResponse.refreshToken
      });
      
      console.log('Registration process completed successfully for user:', user.name);
      return true;

    } catch (error) {
      console.error('Registration error:', error);
      
      // Clean up any partial data on error
      localStorage.removeItem('orchid_user');
      localStorage.removeItem('orchid_access_token');
      localStorage.removeItem('orchid_refresh_token');
      
      dispatch({ type: 'REGISTER_FAILURE' });
      return false;
    }
  };

  const refreshAccessToken = async (): Promise<boolean> => {
    const storedRefreshToken = localStorage.getItem('orchid_refresh_token');
    
    if (!storedRefreshToken) {
      logout();
      return false;
    }

    try {
      // You would need to implement a refresh token endpoint in your authApi
      // For now, this is a placeholder
      console.log('Refreshing access token...');
      // const response = await authApi.refreshToken(storedRefreshToken);
      // 
      // localStorage.setItem('orchid_access_token', response.accessToken);
      // dispatch({ 
      //   type: 'SET_TOKENS', 
      //   accessToken: response.accessToken, 
      //   refreshToken: response.refreshToken || storedRefreshToken 
      // });
      
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      return false;
    }
  };

  const logout = () => {
    // Clear stored auth data
    localStorage.removeItem('orchid_user');
    localStorage.removeItem('orchid_access_token');
    localStorage.removeItem('orchid_refresh_token');
    
    // Call authApi logout to clear axios headers
    // authApi.logout();
    
    dispatch({ type: 'LOGOUT' });
    console.log('User logged out successfully');
  };

  return (
    <AuthContext.Provider value={{
      ...state,
      login,
      logout,
      register,
      refreshAccessToken
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};