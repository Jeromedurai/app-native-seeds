export interface ProductImage {
  imageId: number;
  poster: string;
  main: boolean;
  active: boolean;
  orderBy: number;
}

// Review types
export interface ProductReview {
  reviewId: number;
  productId: number;
  userId: number;
  userName: string;
  userEmail: string;
  rating: number;
  title: string;
  comment: string;
  helpful: number;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    [key: number]: number; // rating (1-5) -> count
  };
}

export interface Product {
  productId: number;
  tenantId: number;
  productName: string;
  productDescription: string;
  productCode: string;
  fullDescription: string;
  specification: string;
  story: string;
  packQuantity: number;
  quantity: number;
  total: number;
  price: number;
  categrory: number; // Note: keeping the typo from the API
  rating: number;
  active: boolean;
  trending: number;
  userBuyCount: number;
  return: number;
  created: string;
  modified: string;
  in_stock: boolean;
  best_seller: boolean;
  deleveryDate: number;
  offer: string;
  orderBy: number;
  userId: number;
  overview: string;
  long_description: string;
  images: ProductImage[];
  reviews?: ProductReview[];
  reviewStats?: ReviewStats;
}

export interface ProductMaster {
  productMaster: Product[];
}

// Legacy Product interface for backwards compatibility
export interface LegacyProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  rating: number;
  reviews: number;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface DiscountCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minAmount?: number;
  active: boolean;
}

export interface CartTotals {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: Address;
  emailVerified: boolean;
  phoneVerified: boolean;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
  role?: 'customer' | 'admin' | 'executive';
  permissions?: string[];
  tenantId?: number;
  bio?: string;
  website?: string;
  profilePicture?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Authentication Interfaces
export interface LoginCredentials {
  emailOrPhone: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string; // Indian format: +91 XXXXX XXXXX
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn: number;
}

export interface PasswordResetRequest {
  emailOrPhone: string;
  method: 'email' | 'sms';
}

export interface PasswordResetConfirm {
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}

export interface VerificationRequest {
  type: 'email' | 'phone';
  value: string;
}

export interface VerificationConfirm {
  type: 'email' | 'phone';
  value: string;
  code: string;
}

export interface SocialLoginProvider {
  id: 'google' | 'facebook' | 'apple';
  name: string;
  icon: string;
  color: string;
}

export interface SocialLoginData {
  provider: 'google' | 'facebook' | 'apple';
  accessToken: string;
  idToken?: string;
  profile: {
    id: string;
    email: string;
    name: string;
    avatar?: string;
  };
}

// Password strength interface
export interface PasswordStrength {
  score: number; // 0-4
  feedback: string[];
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

// Form validation interfaces
export interface AuthValidation {
  isValid: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

export interface PhoneNumberValidation {
  isValid: boolean;
  formatted: string;
  countryCode: string;
  nationalNumber: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  createdAt: Date;
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  success: boolean;
  message?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Menu types for dynamic navigation
export interface MenuCategory {
  categoryId: number;
  category: string;
  active: boolean;
  orderBy: number;
  icon: string;
  description: string;
}

export interface MenuItem {
  menuId: number;
  menuName: string;
  orderBy: number;
  active: boolean;
  image: string;
  subMenu: boolean;
  tenantId: number;
  created: string;
  modified: string;
  category: MenuCategory[];
}

export interface MenuMaster {
  menuMaster: MenuItem[];
}

export interface AppContext {
  user: User | null;
  cart: CartItem[];
  products: Product[];
  menuItems: MenuItem[];
  loading: LoadingState;
  currentCategory: number | null;
  pagination: {
    page: number;
    hasNext: boolean;
    isLoadingMore: boolean;
    total: number;
  };
  addToCart: (product: Product, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateCartQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  // Authentication methods
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  requestPasswordReset: (data: PasswordResetRequest) => Promise<{ message: string }>;
  confirmPasswordReset: (data: PasswordResetConfirm) => Promise<{ message: string }>;
  requestVerification: (data: VerificationRequest) => Promise<{ message: string }>;
  confirmVerification: (data: VerificationConfirm) => Promise<{ message: string }>;
  socialLogin: (data: SocialLoginData) => Promise<void>;
  // Product and menu methods
  fetchProducts: () => Promise<void>;
  fetchProductsByCategory: (categoryId: number) => Promise<void>;
  fetchMenuItems: () => Promise<void>;
  loadMoreProducts: () => Promise<void>;
}

// Checkout and Order Types

export interface CheckoutAddress {
  id?: string;
  type: 'shipping' | 'billing';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'paypal' | 'apple_pay' | 'google_pay' | 'bank_transfer';
  name: string;
  icon: string;
  description?: string;
  enabled: boolean;
}

export interface CreditCardInfo {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderName: string;
  saveCard?: boolean;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  carrier?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  total: number;
}

export interface OrderTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
}

export interface CheckoutOrder {
  orderId: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  totals: OrderTotals;
  shippingAddress: CheckoutAddress;
  billingAddress: CheckoutAddress;
  paymentMethod: string;
  shippingMethod: ShippingMethod;
  orderDate: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  notes?: string;
}

export interface CheckoutData {
  isGuest: boolean;
  customerInfo?: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
  };
  shippingAddress: CheckoutAddress | null;
  billingAddress: CheckoutAddress | null;
  sameBillingAddress: boolean;
  shippingMethod: ShippingMethod | null;
  paymentMethod: PaymentMethod | null;
  creditCardInfo: CreditCardInfo | null;
  appliedDiscount: DiscountCode | null;
  orderNotes?: string;
}

export interface CheckoutStep {
  id: number;
  name: string;
  title: string;
  description: string;
  completed: boolean;
  active: boolean;
}

export interface CheckoutValidation {
  [field: string]: string | null;
}

// API Response types for checkout
export interface CheckoutApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: CheckoutValidation;
}

// Product Management Types
export interface ProductFormData {
  productId?: number;
  tenantId: number;
  productName: string;
  productDescription: string;
  productCode: string;
  fullDescription: string;
  specification: string;
  story: string;
  packQuantity: number;
  quantity: number;
  total: number;
  price: number;
  categrory: number;
  rating: number;
  active: boolean;
  trending: number;
  userBuyCount: number;
  return: number;
  in_stock: boolean;
  best_seller: boolean;
  deleveryDate: number;
  offer: string;
  orderBy: number;
  userId: number;
}

export interface ProductCategory {
  id: number;
  name: string;
  active: boolean;
}

export interface ProductImageUpload {
  id?: string;
  file: File;
  preview: string;
  main: boolean;
  orderBy: number;
}

export interface ProductImageData {
  imageId: number;
  productId: number;
  poster: string;
  main: boolean;
  active: boolean;
  orderBy: number;
  created: string;
  modified: string;
} 