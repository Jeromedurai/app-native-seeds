import { CartItem, Product } from '../types';

// Price formatting
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Calculate cart total
export const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
};

// Calculate cart item count (distinct products, not total quantity)
export const calculateCartItemCount = (items: CartItem[]): number => {
  return items.length;
};

// Calculate total quantity of all items in cart (for cases where total qty is needed)
export const calculateCartTotalQuantity = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.quantity, 0);
};

// Validate email
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password (minimum 8 characters, at least one letter and one number)
export const validatePassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
};

// Debounce function
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle function
export const throttle = <T extends (...args: any[]) => void>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Format date
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Check if product is in cart
export const isProductInCart = (productId: string, cartItems: CartItem[]): boolean => {
  return cartItems.some(item => item.product.productId.toString() === productId);
};

// Get product quantity in cart
export const getProductQuantityInCart = (productId: string, cartItems: CartItem[]): number => {
  const item = cartItems.find(item => item.product.productId.toString() === productId);
  return item ? item.quantity : 0;
};

// Filter products by category
export const filterProductsByCategory = (products: Product[], categoryId: number): Product[] => {
  if (!categoryId) return products;
  return products.filter(product => product.categrory === categoryId && product.active);
};

// Search products
export const searchProducts = (products: Product[], query: string): Product[] => {
  if (!query) return products;
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product =>
    product.productName.toLowerCase().includes(lowercaseQuery) ||
    product.productDescription.toLowerCase().includes(lowercaseQuery) ||
    product.overview.toLowerCase().includes(lowercaseQuery) ||
    product.productCode.toLowerCase().includes(lowercaseQuery)
  );
};

// Sort products
export const sortProducts = (products: Product[], sortBy: 'name' | 'price' | 'rating'): Product[] => {
  return [...products].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.productName.localeCompare(b.productName);
      case 'price':
        return a.price - b.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });
};

// Get main product image
export const getMainProductImage = (product: Product): string => {
  const mainImage = product.images.find(img => img.main && img.active);
  return mainImage?.poster || product.images[0]?.poster || '/placeholder-image.jpg';
};

// Check if product is available
export const isProductAvailable = (product: Product): boolean => {
  return product.active && product.in_stock && product.quantity > 0;
};

// Calculate discounted price
export const calculateDiscountedPrice = (price: number, offer: string): number => {
  const discountPercent = parseInt(offer.replace('%', ''));
  return price * (1 - discountPercent / 100);
};

// Local storage helpers
export const storage = {
  get: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error getting item from localStorage:', error);
      return null;
    }
  },
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting item to localStorage:', error);
    }
  },
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from localStorage:', error);
    }
  },
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}; 