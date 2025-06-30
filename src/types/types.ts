// API Request/Response Types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
}

export interface LoginResponse {
    email: string;
    password: string;
    accessToken: string;
    refreshToken: string;
}

export interface RegisterResponse {
    email: string;
    password: string;
    accessToken: string;
    refreshToken: string;
}

// Entity DTOs (matching Spring Boot DTOs)
export interface RoleDTO {
    id?: string;
    name: string;
}

export interface UserDTO {
    id?: string;
    name: string;
    email: string;
    password?: string;
    roleId: string;
    roleName: string;
    role?: RoleDTO;
    isActive?: boolean;
    createdAt?: string;
    lastLogin?: string;
}

export interface CategoryDTO {
    id?: string;
    name: string;
}

export interface OrchidDTO {
    id: string;
    name: string;
    description: string;
    isNatural: boolean;
    url: string;
    price: number;
    categoryName: string;
}

// UI/Context Types
export interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user' | 'customer';
}

export interface CartItem {
    orchid: OrchidDTO;
    quantity: number;
}

// Page Types
export type PageType = 'home' | 'shop' | 'about' | 'contact' | 'orders' | 'admin';

// Component Props Types
export interface AppRoutesProps {
    currentPage: string;
    orchids: OrchidDTO[];
    categories: CategoryDTO[];
    loading: boolean;
    error: string | null;
    onViewDetails: (orchid: OrchidDTO) => void;
    onShopClick: () => void;
}

export interface OrchidReadResponse {
    id: string;
    name: string;
    description: string;
    isNatural: boolean;
    url: string;
    price: number;
    categoryName: string;
}

export interface OrchidWriteRequest {
    name: string;
    description: string;
    isNatural: string;
    url: string;
    price: number;
    categoryId: string;
}

export interface OrchidSearchParams {
    id?: string;
    name?: string;
    description?: string;
    isNatural?: boolean;
    minPrice?: number;
    maxPrice?: number;
    categoryName?: string;
    page?: number;
    size?: number;
    sort?: string[];
}

export interface OrderReadResponse {
    id: string;
    accountId: string;
    orderDate: string;
    status: string;
    totalAmount: number;
}

export interface OrderWriteRequest {
    accountId: string;
    orderDate: string;
    status: string;
    totalAmount: number;
}

export interface OrderSearchParams {
    id?: string;
    accountId?: string;
    date?: string;
    totalAmount?: number;
    status?: string;
    page?: number;
    size?: number;
    sort?: string[];
}

export interface OrderDetailWriteRequest {
    orchidId: string;
    quantity: number;
    price: number;
}

export interface OrderWriteRequest {
    accountId: string;
    orderDate: string;
    status: string;
    totalAmount: number;
    orderDetails: OrderDetailWriteRequest[];
}

export interface OrderDetailReadResponse {
    id: string;
    orderId: string;
    orchidId: string;
    orchidName: string;
    price: number;
    quantity: number;
}

// Paginated response interface for better API pagination
export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

// Enhanced search params with better pagination support
export interface EnhancedOrchidSearchParams extends OrchidSearchParams {
  page?: number;
  size?: number;
  sort?: string[];
}