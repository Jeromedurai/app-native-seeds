const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const endpoints = {
  // Products
  products: {
    list: `${API_BASE_URL}/products`,
    master: `${API_BASE_URL}/products/master`,
    detail: (id: string) => `${API_BASE_URL}/products/${id}`,
    byCategory: (categoryId: string) => `${API_BASE_URL}/products/category/${categoryId}`,
    search: (query: string) => `${API_BASE_URL}/products/search?q=${query}`,
  },

  // Menu
  menu: {
    master: `${API_BASE_URL}/menu/master`,
  },
  
  // User Authentication
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    logout: `${API_BASE_URL}/auth/logout`,
    profile: `${API_BASE_URL}/auth/profile`,
    updateProfile: `${API_BASE_URL}/auth/profile`,
    forgotPassword: `${API_BASE_URL}/auth/forgot-password`,
    resetPassword: `${API_BASE_URL}/auth/reset-password`,
    requestVerification: `${API_BASE_URL}/auth/request-verification`,
    confirmVerification: `${API_BASE_URL}/auth/confirm-verification`,
    socialLogin: `${API_BASE_URL}/auth/social-login`,
    refreshToken: `${API_BASE_URL}/auth/refresh-token`,
  },

  // Cart
  cart: {
    get: `${API_BASE_URL}/cart`,
    add: `${API_BASE_URL}/cart/add`,
    update: `${API_BASE_URL}/cart/update`,
    remove: `${API_BASE_URL}/cart/remove`,
    clear: `${API_BASE_URL}/cart/clear`,
  },

  // Orders
  orders: {
    create: `${API_BASE_URL}/orders`,
    list: `${API_BASE_URL}/orders`,
    detail: (id: string) => `${API_BASE_URL}/orders/${id}`,
    cancel: (id: string) => `${API_BASE_URL}/orders/${id}/cancel`,
  },

  // Categories
  categories: {
    list: `${API_BASE_URL}/categories`,
  },

  // Reviews
  reviews: {
    byProduct: (productId: string) => `${API_BASE_URL}/reviews/product/${productId}`,
    create: `${API_BASE_URL}/reviews`,
    update: (id: string) => `${API_BASE_URL}/reviews/${id}`,
    delete: (id: string) => `${API_BASE_URL}/reviews/${id}`,
  },
};

export default endpoints; 