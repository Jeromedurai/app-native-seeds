import { 
  CheckoutAddress, 
  PaymentMethod, 
  ShippingMethod, 
  CheckoutOrder, 
  OrderTotals, 
  CheckoutApiResponse,
  CheckoutValidation,
  OrderStatus
} from '../types';

class MockCheckoutApiService {
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  private simulateError = () => Math.random() < 0.05; // 5% error rate

  // Available payment methods
  private paymentMethods: PaymentMethod[] = [
    {
      id: 'credit_card',
      type: 'credit_card',
      name: 'Credit Card',
      icon: '💳',
      description: 'Visa, Mastercard, American Express',
      enabled: true
    },
    {
      id: 'paypal',
      type: 'paypal',
      name: 'PayPal',
      icon: '🅿️',
      description: 'Pay with your PayPal account',
      enabled: true
    },
    {
      id: 'apple_pay',
      type: 'apple_pay',
      name: 'Apple Pay',
      icon: '🍎',
      description: 'Pay with Touch ID or Face ID',
      enabled: true
    },
    {
      id: 'google_pay',
      type: 'google_pay',
      name: 'Google Pay',
      icon: '🇬',
      description: 'Pay with Google Pay',
      enabled: true
    }
  ];

  // Available shipping methods
  private shippingMethods: ShippingMethod[] = [
    {
      id: 'free',
      name: 'Free Shipping',
      description: 'Free shipping on orders over ₹2000',
      price: 0,
      estimatedDays: '5-7'
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: 'Faster delivery',
      price: 299,
      estimatedDays: '2-3 business days',
      carrier: 'FedEx'
    },
    {
      id: 'overnight',
      name: 'Overnight Shipping',
      description: 'Next business day delivery',
      price: 799,
      estimatedDays: '1 business day',
      carrier: 'FedEx'
    }
  ];

  // Get available payment methods
  async getPaymentMethods(): Promise<CheckoutApiResponse<PaymentMethod[]>> {
    await this.delay(300);
    
    if (this.simulateError()) {
      return {
        success: false,
        message: 'Failed to load payment methods'
      };
    }

    console.log('🔄 MockCheckoutApi: Fetched payment methods');
    return {
      success: true,
      data: this.paymentMethods
    };
  }

  // Get available shipping methods
  async getShippingMethods(subtotal: number): Promise<CheckoutApiResponse<ShippingMethod[]>> {
    await this.delay(400);
    
    if (this.simulateError()) {
      return {
        success: false,
        message: 'Failed to load shipping methods'
      };
    }

    // Apply free shipping logic
    const methods = this.shippingMethods.map(method => ({
      ...method,
      price: method.id === 'standard' && subtotal >= 2000 ? 0 : method.price
    }));

    console.log('🔄 MockCheckoutApi: Fetched shipping methods for subtotal:', subtotal);
    return {
      success: true,
      data: methods
    };
  }

  // Validate address
  async validateAddress(address: CheckoutAddress): Promise<CheckoutApiResponse<CheckoutAddress>> {
    await this.delay(500);
    
    const errors: CheckoutValidation = {};

    // Simulate address validation
    if (!address.firstName?.trim()) errors.firstName = 'First name is required';
    if (!address.lastName?.trim()) errors.lastName = 'Last name is required';
    if (!address.email?.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(address.email)) errors.email = 'Email is invalid';
    if (!address.phone?.trim()) errors.phone = 'Phone number is required';
    if (!address.address1?.trim()) errors.address1 = 'Address is required';
    if (!address.city?.trim()) errors.city = 'City is required';
    if (!address.state?.trim()) errors.state = 'State is required';
    if (!address.zipCode?.trim()) errors.zipCode = 'PIN code is required';
    else if (!/^\d{6}$/.test(address.zipCode)) errors.zipCode = 'Invalid PIN code format (should be 6 digits)';
    if (!address.country?.trim()) errors.country = 'Country is required';

    // Simulate some addresses that fail validation
    if (address.zipCode === '99999') {
      errors.zipCode = 'We cannot deliver to this area';
    }

    if (Object.keys(errors).length > 0) {
      console.log('❌ MockCheckoutApi: Address validation failed:', errors);
      return {
        success: false,
        message: 'Address validation failed',
        errors
      };
    }

    // Simulate address normalization
    const normalizedAddress: CheckoutAddress = {
      ...address,
      firstName: address.firstName.trim(),
      lastName: address.lastName.trim(),
      email: address.email.toLowerCase().trim(),
      address1: address.address1.trim(),
      city: address.city.trim(),
      state: address.state.toUpperCase().trim(),
      zipCode: address.zipCode.replace(/\D/g, '').slice(0, 6),
      country: address.country.toUpperCase().trim()
    };

    console.log('✅ MockCheckoutApi: Address validated and normalized');
    return {
      success: true,
      data: normalizedAddress
    };
  }

  // Calculate order totals
  async calculateTotals(
    subtotal: number, 
    shippingMethod: ShippingMethod | null,
    discountAmount: number = 0
  ): Promise<CheckoutApiResponse<OrderTotals>> {
    await this.delay(300);
    
    if (this.simulateError()) {
      return {
        success: false,
        message: 'Failed to calculate totals'
      };
    }

    const shipping = shippingMethod?.price || 0;
    const discountedSubtotal = Math.max(0, subtotal - discountAmount);
    const tax = Math.round(discountedSubtotal * 0.085 * 100) / 100; // 8.5% tax
    const total = discountedSubtotal + shipping + tax;

    const totals: OrderTotals = {
      subtotal: subtotal,
      shipping: shipping,
      tax: tax,
      discount: discountAmount,
      total: total
    };

    console.log('🔄 MockCheckoutApi: Calculated totals:', totals);
    return {
      success: true,
      data: totals
    };
  }

  // Process payment
  async processPayment(
    paymentMethod: PaymentMethod,
    amount: number,
    cardInfo?: any
  ): Promise<CheckoutApiResponse<{ transactionId: string }>> {
    await this.delay(2000); // Longer delay for payment processing
    
    // Simulate payment failures
    if (this.simulateError() || amount <= 0) {
      console.log('❌ MockCheckoutApi: Payment processing failed');
      return {
        success: false,
        message: 'Payment processing failed. Please try again.'
      };
    }

    // Simulate specific card errors
    if (cardInfo?.cardNumber === '4000000000000002') {
      return {
        success: false,
        message: 'Your card was declined. Please try a different payment method.'
      };
    }

    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('✅ MockCheckoutApi: Payment processed successfully:', transactionId);
    return {
      success: true,
      data: { transactionId }
    };
  }

  // Create order
  async createOrder(
    orderData: {
      items: any[];
      shippingAddress: CheckoutAddress;
      billingAddress: CheckoutAddress;
      paymentMethod: PaymentMethod;
      shippingMethod: ShippingMethod;
      totals: OrderTotals;
      transactionId: string;
      notes?: string;
    }
  ): Promise<CheckoutApiResponse<CheckoutOrder>> {
    await this.delay(1000);
    
    if (this.simulateError()) {
      console.log('❌ MockCheckoutApi: Order creation failed');
      return {
        success: false,
        message: 'Failed to create order. Please try again.'
      };
    }

    const orderId = `ord_${Date.now()}`;
    const orderNumber = `HIM-${Date.now().toString().slice(-6)}`;
    
    const order: CheckoutOrder = {
      orderId,
      orderNumber,
      status: OrderStatus.PENDING,
      items: orderData.items.map(item => ({
        productId: item.productId.toString(),
        productName: item.productName,
        productImage: item.productImage,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity
      })),
      totals: orderData.totals,
      shippingAddress: orderData.shippingAddress,
      billingAddress: orderData.billingAddress,
      paymentMethod: orderData.paymentMethod.name,
      shippingMethod: orderData.shippingMethod,
      orderDate: new Date().toISOString(),
      estimatedDelivery: this.calculateEstimatedDelivery(orderData.shippingMethod),
      notes: orderData.notes
    };

    console.log('✅ MockCheckoutApi: Order created successfully:', orderNumber);
    return {
      success: true,
      data: order
    };
  }

  // Get order by ID
  async getOrder(orderId: string): Promise<CheckoutApiResponse<CheckoutOrder>> {
    await this.delay(400);
    
    if (this.simulateError()) {
      return {
        success: false,
        message: 'Failed to fetch order'
      };
    }

    // This would normally fetch from a database
    // For demo, we'll return a mock order
    console.log('🔄 MockCheckoutApi: Fetched order:', orderId);
    return {
      success: false,
      message: 'Order not found'
    };
  }

  private calculateEstimatedDelivery(shippingMethod: ShippingMethod): string {
    const today = new Date();
    let deliveryDate = new Date(today);
    
    switch (shippingMethod.id) {
      case 'overnight':
        deliveryDate.setDate(today.getDate() + 1);
        break;
      case 'express':
        deliveryDate.setDate(today.getDate() + 3);
        break;
      default:
        deliveryDate.setDate(today.getDate() + 7);
    }
    
    return deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

// Export singleton instance
export const mockCheckoutApi = new MockCheckoutApiService(); 