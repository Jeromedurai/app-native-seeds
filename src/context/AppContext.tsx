import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { 
  User, 
  Product, 
  CartItem, 
  LoadingState, 
  MenuItem, 
  AppContext as IAppContext,
  LoginCredentials,
  RegisterData,
  PasswordResetRequest,
  PasswordResetConfirm,
  VerificationRequest,
  VerificationConfirm,
  SocialLoginData
} from '../types';
import { getProducts, getMenuItems, getProductsByCategory } from '../services/mockData';
import { mockCartApi } from '../services/mockCartApi';
import { mockAuthApi } from '../services/mockAuthApi';
import { generateId } from '../utils';

// Action types
type AppAction =
  | { type: 'SET_LOADING'; payload: LoadingState }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'APPEND_PRODUCTS'; payload: Product[] }
  | { type: 'SET_MENU_ITEMS'; payload: MenuItem[] }
  | { type: 'SET_CURRENT_CATEGORY'; payload: number | null }
  | { type: 'SET_PAGINATION'; payload: { page: number; hasNext: boolean; isLoadingMore: boolean; total: number } }
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' };

// Initial state
interface AppState {
  user: User | null;
  products: Product[];
  menuItems: MenuItem[];
  currentCategory: number | null;
  cart: CartItem[];
  loading: LoadingState;
  pagination: {
    page: number;
    hasNext: boolean;
    isLoadingMore: boolean;
    total: number;
  };
}

const initialState: AppState = {
  user: null,
  products: [],
  menuItems: [],
  currentCategory: null,
  cart: [],
  loading: {
    isLoading: false,
    error: null,
  },
  pagination: {
    page: 1,
    hasNext: false,
    isLoadingMore: false,
    total: 0,
  },
};

// Reducer
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'SET_PRODUCTS':
      return {
        ...state,
        products: action.payload,
      };
    case 'APPEND_PRODUCTS':
      return {
        ...state,
        products: [...state.products, ...action.payload],
      };
    case 'SET_MENU_ITEMS':
      return {
        ...state,
        menuItems: action.payload,
      };
    case 'SET_CURRENT_CATEGORY':
      return {
        ...state,
        currentCategory: action.payload,
      };
    case 'SET_PAGINATION':
      return {
        ...state,
        pagination: action.payload,
      };
    case 'SET_CART':
      return {
        ...state,
        cart: action.payload,
      };
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.product.productId === action.payload.product.productId);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.product.productId === action.payload.product.productId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [
          ...state.cart,
          {
            id: generateId(),
            product: action.payload.product,
            quantity: action.payload.quantity,
          },
        ],
      };
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.product.productId.toString() !== action.payload),
      };
    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product.productId.toString() === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
      };
    default:
      return state;
  }
};

// Context
const AppContext = createContext<IAppContext | undefined>(undefined);

// Provider
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Actions
  const setLoading = useCallback((loading: LoadingState) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  // Fetch cart from API
  const fetchCart = useCallback(async () => {
    try {
      const response = await mockCartApi.getCart();
      if (response.success) {
        dispatch({ type: 'SET_CART', payload: response.data || [] });
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      dispatch({ type: 'SET_CART', payload: [] });
    }
  }, []);

  const addToCart = useCallback(async (product: Product, quantity: number) => {
    try {
      const response = await mockCartApi.addProductToCart(product, quantity);
      if (response.success) {
        // Fetch fresh cart data from API
        await fetchCart();
      } else {
        setLoading({ isLoading: false, error: response.message || 'Failed to add item to cart' });
      }
    } catch (error) {
      setLoading({ isLoading: false, error: 'Failed to add item to cart' });
    }
  }, [fetchCart, setLoading]);

  const removeFromCart = useCallback(async (productId: string) => {
    try {
      const response = await mockCartApi.removeFromCart(productId);
      if (response.success) {
        // Fetch fresh cart data from API
        await fetchCart();
      } else {
        setLoading({ isLoading: false, error: response.message || 'Failed to remove item from cart' });
      }
    } catch (error) {
      setLoading({ isLoading: false, error: 'Failed to remove item from cart' });
    }
  }, [fetchCart, setLoading]);

  const updateCartQuantity = useCallback(async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    
    try {
      const response = await mockCartApi.updateCartItem(productId, quantity);
      if (response.success) {
        // Fetch fresh cart data from API
        await fetchCart();
      } else {
        setLoading({ isLoading: false, error: response.message || 'Failed to update cart item' });
      }
    } catch (error) {
      setLoading({ isLoading: false, error: 'Failed to update cart item' });
    }
  }, [removeFromCart, fetchCart, setLoading]);

  const clearCart = useCallback(async () => {
    try {
      const response = await mockCartApi.clearCart();
      if (response.success) {
        dispatch({ type: 'CLEAR_CART' });
      } else {
        setLoading({ isLoading: false, error: response.message || 'Failed to clear cart' });
      }
    } catch (error) {
      setLoading({ isLoading: false, error: 'Failed to clear cart' });
    }
  }, [setLoading]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setLoading({ isLoading: true, error: null });
    try {
      const response = await mockAuthApi.login(credentials);
      if (response.success) {
        localStorage.setItem('authToken', response.data.token);
        dispatch({ type: 'SET_USER', payload: response.data.user });
        // Fetch cart after login
        await fetchCart();
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      setLoading({ isLoading: false, error: error instanceof Error ? error.message : 'Login failed' });
      throw error; // Re-throw for component error handling
    } finally {
      setLoading({ isLoading: false, error: null });
    }
  }, [setLoading, fetchCart]);

  const register = useCallback(async (userData: RegisterData) => {
    setLoading({ isLoading: true, error: null });
    try {
      const response = await mockAuthApi.register(userData);
      if (response.success) {
        localStorage.setItem('authToken', response.data.token);
        dispatch({ type: 'SET_USER', payload: response.data.user });
        // Fetch cart after registration
        await fetchCart();
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      setLoading({ isLoading: false, error: error instanceof Error ? error.message : 'Registration failed' });
      throw error; // Re-throw for component error handling
    } finally {
      setLoading({ isLoading: false, error: null });
    }
  }, [setLoading, fetchCart]);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    dispatch({ type: 'SET_USER', payload: null });
    clearCart();
  }, [clearCart]);

  const requestPasswordReset = useCallback(async (data: PasswordResetRequest) => {
    setLoading({ isLoading: true, error: null });
    try {
      const response = await mockAuthApi.requestPasswordReset(data);
      if (!response.success) {
        throw new Error(response.message || 'Password reset request failed');
      }
      return response.data;
    } catch (error) {
      setLoading({ isLoading: false, error: error instanceof Error ? error.message : 'Password reset request failed' });
      throw error;
    } finally {
      setLoading({ isLoading: false, error: null });
    }
  }, [setLoading]);

  const confirmPasswordReset = useCallback(async (data: PasswordResetConfirm) => {
    setLoading({ isLoading: true, error: null });
    try {
      const response = await mockAuthApi.confirmPasswordReset(data);
      if (!response.success) {
        throw new Error(response.message || 'Password reset failed');
      }
      return response.data;
    } catch (error) {
      setLoading({ isLoading: false, error: error instanceof Error ? error.message : 'Password reset failed' });
      throw error;
    } finally {
      setLoading({ isLoading: false, error: null });
    }
  }, [setLoading]);

  const requestVerification = useCallback(async (data: VerificationRequest) => {
    setLoading({ isLoading: true, error: null });
    try {
      const response = await mockAuthApi.requestVerification(data);
      if (!response.success) {
        throw new Error(response.message || 'Verification request failed');
      }
      return response.data;
    } catch (error) {
      setLoading({ isLoading: false, error: error instanceof Error ? error.message : 'Verification request failed' });
      throw error;
    } finally {
      setLoading({ isLoading: false, error: null });
    }
  }, [setLoading]);

  const confirmVerification = useCallback(async (data: VerificationConfirm) => {
    setLoading({ isLoading: true, error: null });
    try {
      const response = await mockAuthApi.confirmVerification(data);
      if (!response.success) {
        throw new Error(response.message || 'Verification failed');
      }
      // Update user verification status
      if (state.user) {
        const updatedUser = { 
          ...state.user,
          emailVerified: data.type === 'email' ? true : state.user.emailVerified,
          phoneVerified: data.type === 'phone' ? true : state.user.phoneVerified
        };
        dispatch({ type: 'SET_USER', payload: updatedUser });
      }
      return response.data;
    } catch (error) {
      setLoading({ isLoading: false, error: error instanceof Error ? error.message : 'Verification failed' });
      throw error;
    } finally {
      setLoading({ isLoading: false, error: null });
    }
  }, [setLoading, state.user]);

  const socialLogin = useCallback(async (data: SocialLoginData) => {
    setLoading({ isLoading: true, error: null });
    try {
      const response = await mockAuthApi.socialLogin(data);
      if (response.success) {
        localStorage.setItem('authToken', response.data.token);
        dispatch({ type: 'SET_USER', payload: response.data.user });
        // Fetch cart after social login
        await fetchCart();
      } else {
        throw new Error(response.message || 'Social login failed');
      }
    } catch (error) {
      setLoading({ isLoading: false, error: error instanceof Error ? error.message : 'Social login failed' });
      throw error;
    } finally {
      setLoading({ isLoading: false, error: null });
    }
  }, [setLoading, fetchCart]);

  const fetchProducts = useCallback(async () => {
    setLoading({ isLoading: true, error: null });
    try {
      // Use mock data for development
      const products = await getProducts(1, 10); // Initially load 10 products
      dispatch({ type: 'SET_PRODUCTS', payload: products });
      dispatch({ type: 'SET_CURRENT_CATEGORY', payload: null });
      
      // Set pagination state
      dispatch({ 
        type: 'SET_PAGINATION', 
        payload: { 
          page: 1,
          hasNext: products.length === 10,
          isLoadingMore: false,
          total: products.length
        } 
      });
      
      setLoading({ isLoading: false, error: null });
    } catch (error) {
      setLoading({ isLoading: false, error: error instanceof Error ? error.message : 'Failed to fetch products' });
    }
  }, [setLoading]);

  const fetchProductsByCategory = useCallback(async (categoryId: number) => {
    setLoading({ isLoading: true, error: null });
    try {
      // Use mock data for development - get first page
      const products = await getProductsByCategory(categoryId, 1, 10);
      dispatch({ type: 'SET_PRODUCTS', payload: products });
      dispatch({ type: 'SET_CURRENT_CATEGORY', payload: categoryId });
      
      // Set pagination state
      dispatch({ 
        type: 'SET_PAGINATION', 
        payload: { 
          page: 1,
          hasNext: products.length === 10, // If we got 10 products, there might be more
          isLoadingMore: false,
          total: products.length
        } 
      });
      
      setLoading({ isLoading: false, error: null });
    } catch (error) {
      setLoading({ isLoading: false, error: error instanceof Error ? error.message : 'Failed to fetch products by category' });
    }
  }, [setLoading]);

  const fetchMenuItems = useCallback(async () => {
    try {
      // Use mock data for development
      const menuData = await getMenuItems();
      // Filter only active menu items and sort by orderBy
      const activeMenuItems = menuData.menuMaster
        .filter(item => item.active)
        .sort((a, b) => a.orderBy - b.orderBy);
      
      dispatch({ type: 'SET_MENU_ITEMS', payload: activeMenuItems });
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
    }
  }, []);

  const loadMoreProducts = useCallback(async () => {
    if (!state.pagination.hasNext || state.pagination.isLoadingMore) return;
    
    // Set loading more state
    dispatch({ 
      type: 'SET_PAGINATION', 
      payload: { 
        ...state.pagination, 
        isLoadingMore: true 
      } 
    });

    try {
      const nextPage = state.pagination.page + 1;
      const limit = 10;
      
      let products: Product[] = [];
      
      if (state.currentCategory) {
        products = await getProductsByCategory(state.currentCategory, nextPage, limit);
      } else {
        products = await getProducts(nextPage, limit);
      }
      
      dispatch({ type: 'APPEND_PRODUCTS', payload: products });
      
      // Update pagination state
      dispatch({ 
        type: 'SET_PAGINATION', 
        payload: { 
          page: nextPage,
          hasNext: products.length === limit,
          isLoadingMore: false,
          total: state.pagination.total + products.length
        } 
      });
    } catch (error) {
      // Reset loading state on error
      dispatch({ 
        type: 'SET_PAGINATION', 
        payload: { 
          ...state.pagination, 
          isLoadingMore: false 
        } 
      });
    }
  }, [state.pagination, state.currentCategory]);

  // Load initial data on mount
  useEffect(() => {
    fetchProducts();
    fetchMenuItems();
    // Always fetch cart for demo (in real app, check authentication)
    fetchCart();
  }, [fetchProducts, fetchMenuItems, fetchCart]);

  const contextValue: IAppContext = {
    user: state.user,
    cart: state.cart,
    products: state.products,
    menuItems: state.menuItems,
    currentCategory: state.currentCategory,
    loading: state.loading,
    pagination: state.pagination,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    fetchCart,
    login,
    logout,
    fetchProducts,
    fetchProductsByCategory,
    fetchMenuItems,
    loadMoreProducts,
    register,
    requestPasswordReset,
    confirmPasswordReset,
    requestVerification,
    confirmVerification,
    socialLogin,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use the context
export const useAppContext = (): IAppContext => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}; 