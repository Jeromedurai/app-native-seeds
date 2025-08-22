import { ApiResponse, Product, ProductMaster, User, CartItem, Order, MenuMaster } from '../types';
import endpoints from '../endpoint';

class ApiService {
  private async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return {
        data,
        success: true,
      };
    } catch (error) {
      return {
        data: null as T,
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Products
  async getProducts(page: number = 1, limit: number = 10): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>(`${endpoints.products.list}?page=${page}&limit=${limit}`);
  }

  async getProductMaster(): Promise<ApiResponse<ProductMaster>> {
    return this.request<ProductMaster>(endpoints.products.master);
  }

  async getProduct(id: number): Promise<ApiResponse<Product>> {
    return this.request<Product>(endpoints.products.detail(id.toString()));
  }

  async getProductsByCategory(categoryId: number, page: number = 1, limit: number = 10): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>(`${endpoints.products.byCategory(categoryId.toString())}?page=${page}&limit=${limit}`);
  }

  async searchProducts(query: string): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>(endpoints.products.search(query));
  }

  // Menu
  async getMenuMaster(): Promise<ApiResponse<MenuMaster>> {
    return this.request<MenuMaster>(endpoints.menu.master);
  }

  // Authentication
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request<{ user: User; token: string }>(endpoints.auth.login, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: { email: string; password: string; name: string }): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request<{ user: User; token: string }>(endpoints.auth.register, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.request<void>(endpoints.auth.logout, {
      method: 'POST',
    });
  }

  async getProfile(): Promise<ApiResponse<User>> {
    return this.request<User>(endpoints.auth.profile);
  }

  // Cart
  async getCart(): Promise<ApiResponse<CartItem[]>> {
    return this.request<CartItem[]>(endpoints.cart.get);
  }

  async addToCart(productId: string, quantity: number): Promise<ApiResponse<CartItem>> {
    return this.request<CartItem>(endpoints.cart.add, {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async updateCartItem(productId: string, quantity: number): Promise<ApiResponse<CartItem>> {
    return this.request<CartItem>(endpoints.cart.update, {
      method: 'PUT',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async removeFromCart(productId: string): Promise<ApiResponse<void>> {
    return this.request<void>(endpoints.cart.remove, {
      method: 'DELETE',
      body: JSON.stringify({ productId }),
    });
  }

  async clearCart(): Promise<ApiResponse<void>> {
    return this.request<void>(endpoints.cart.clear, {
      method: 'DELETE',
    });
  }

  // Orders
  async createOrder(orderData: any): Promise<ApiResponse<Order>> {
    return this.request<Order>(endpoints.orders.create, {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders(): Promise<ApiResponse<Order[]>> {
    return this.request<Order[]>(endpoints.orders.list);
  }

  async getOrder(id: string): Promise<ApiResponse<Order>> {
    return this.request<Order>(endpoints.orders.detail(id));
  }

  async cancelOrder(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(endpoints.orders.cancel(id), {
      method: 'PUT',
    });
  }
}

export const apiService = new ApiService();
export default apiService; 