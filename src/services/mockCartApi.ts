import { CartItem, Product, ApiResponse } from '../types';
import { generateId } from '../utils';

// In-memory cart storage (simulates server-side storage)
// This will reset when the app refreshes, simulating real API behavior
let cartStorage: CartItem[] = [];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate possible API failures
const simulateFailure = () => Math.random() < 0.05; // 5% chance of failure

export class MockCartApi {
  // Get cart from "server"
  async getCart(): Promise<ApiResponse<CartItem[]>> {
    await delay(300); // Simulate API delay
    
    if (simulateFailure()) {
      return {
        data: [] as CartItem[],
        success: false,
        message: 'Failed to fetch cart from server'
      };
    }

    return {
      data: [...cartStorage], // Return copy to avoid mutations
      success: true
    };
  }

  // Add item to cart on "server"
  async addToCart(productId: string, quantity: number): Promise<ApiResponse<CartItem>> {
    await delay(500); // Simulate API delay
    
    if (simulateFailure()) {
      return {
        data: null as any,
        success: false,
        message: 'Failed to add item to cart'
      };
    }

    // Find existing item
    const existingItemIndex = cartStorage.findIndex(
      item => item.product.productId.toString() === productId
    );

    let updatedItem: CartItem;

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      cartStorage[existingItemIndex].quantity += quantity;
      updatedItem = cartStorage[existingItemIndex];
    } else {
      // This is a simplified version - in real API, you'd fetch product details
      // For demo, we'll create a basic product object
      const newItem: CartItem = {
        id: generateId(),
        product: {
          productId: parseInt(productId),
          tenantId: 1,
          productName: `Product ${productId}`,
          productDescription: 'Product description',
          productCode: `PROD-${productId}`,
          fullDescription: 'Full product description',
          specification: 'Product specifications',
          story: 'Product story',
          packQuantity: 1,
          quantity: 100,
          total: 100,
          price: 29.99,
          categrory: 1,
          rating: 4.5,
          active: true,
          trending: 0,
          userBuyCount: 0,
          return: 30,
          created: new Date().toISOString(),
          modified: new Date().toISOString(),
          in_stock: true,
          best_seller: false,
          deleveryDate: 7,
          offer: '0%',
          orderBy: 1,
          userId: 1,
          overview: 'Product overview',
          long_description: 'Long product description',
          images: []
        },
        quantity
      };
      
      cartStorage.push(newItem);
      updatedItem = newItem;
    }

    return {
      data: updatedItem,
      success: true
    };
  }

  // Update cart item quantity on "server"
  async updateCartItem(productId: string, quantity: number): Promise<ApiResponse<CartItem>> {
    await delay(400); // Simulate API delay
    
    if (simulateFailure()) {
      return {
        data: null as any,
        success: false,
        message: 'Failed to update cart item'
      };
    }

    const itemIndex = cartStorage.findIndex(
      item => item.product.productId.toString() === productId
    );

    if (itemIndex === -1) {
      return {
        data: null as any,
        success: false,
        message: 'Item not found in cart'
      };
    }

    cartStorage[itemIndex].quantity = quantity;

    return {
      data: cartStorage[itemIndex],
      success: true
    };
  }

  // Remove item from cart on "server"
  async removeFromCart(productId: string): Promise<ApiResponse<void>> {
    await delay(300); // Simulate API delay
    
    if (simulateFailure()) {
      return {
        data: undefined as any,
        success: false,
        message: 'Failed to remove item from cart'
      };
    }

    const initialLength = cartStorage.length;
    cartStorage = cartStorage.filter(
      item => item.product.productId.toString() !== productId
    );

    if (cartStorage.length === initialLength) {
      return {
        data: undefined as any,
        success: false,
        message: 'Item not found in cart'
      };
    }

    return {
      data: undefined as any,
      success: true
    };
  }

  // Clear entire cart on "server"
  async clearCart(): Promise<ApiResponse<void>> {
    await delay(200); // Simulate API delay
    
    if (simulateFailure()) {
      return {
        data: undefined as any,
        success: false,
        message: 'Failed to clear cart'
      };
    }

    cartStorage = [];

    return {
      data: undefined as any,
      success: true
    };
  }

  // Helper method to add a real product to cart (for demo purposes)
  async addProductToCart(product: Product, quantity: number): Promise<ApiResponse<CartItem>> {
    await delay(500); // Simulate API delay
    
    if (simulateFailure()) {
      return {
        data: null as any,
        success: false,
        message: 'Failed to add item to cart'
      };
    }

    // Find existing item
    const existingItemIndex = cartStorage.findIndex(
      item => item.product.productId === product.productId
    );

    let updatedItem: CartItem;

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      cartStorage[existingItemIndex].quantity += quantity;
      updatedItem = cartStorage[existingItemIndex];
    } else {
      // Add new item
      const newItem: CartItem = {
        id: generateId(),
        product,
        quantity
      };
      
      cartStorage.push(newItem);
      updatedItem = newItem;
    }

    return {
      data: updatedItem,
      success: true
    };
  }

  // Get current cart size (for development/debugging)
  getCartSize(): number {
    return cartStorage.length;
  }

  // Reset cart storage (for testing)
  resetCart(): void {
    cartStorage = [];
  }
}

export const mockCartApi = new MockCartApi(); 