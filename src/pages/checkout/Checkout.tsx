import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { 
  CheckoutData, 
  CheckoutAddress, 
  PaymentMethod, 
  CreditCardInfo, 
  ShippingMethod, 
  OrderTotals, 
  CheckoutStep,
  CheckoutValidation,
  DiscountCode as DiscountCodeType,
  CartItem 
} from '../../types';
import { mockCheckoutApi } from '../../services/mockCheckoutApi';
import { formatPrice } from '../../utils';
import CheckoutStepper from '../../components/checkout/CheckoutStepper';
import AddressForm from '../../components/checkout/AddressForm';
import PaymentMethods from '../../components/checkout/PaymentMethods';
import OrderReview from '../../components/product/OrderReview';
import DiscountCode from '../../components/cart/DiscountCode';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useAppContext();
  
  // Minimum order value constant
  const MINIMUM_ORDER_VALUE = 500;
  
  // Calculate cart total for minimum order validation
  const cartTotal = cart.reduce((sum: number, item: CartItem) => sum + (item.product.price * item.quantity), 0);
  const meetsMinimumOrder = cartTotal >= MINIMUM_ORDER_VALUE;
  
  // Redirect if cart is empty or doesn't meet minimum order value
  useEffect(() => {
    if (cart.length === 0 || !meetsMinimumOrder) {
      // Add a small delay to avoid navigation conflicts
      const timer = setTimeout(() => {
        navigate('/cart');
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [cart.length, meetsMinimumOrder, navigate]);

  // Checkout steps configuration
  const steps: CheckoutStep[] = [
    {
      id: 0,
      name: 'address',
      title: 'Address',
      description: 'Shipping & billing information',
      completed: false,
      active: true
    },
    {
      id: 1,
      name: 'shipping',
      title: 'Shipping',
      description: 'Delivery method',
      completed: false,
      active: false
    },
    {
      id: 2,
      name: 'payment',
      title: 'Payment',
      description: 'Payment method',
      completed: false,
      active: false
    },
    {
      id: 3,
      name: 'review',
      title: 'Review',
      description: 'Confirm your order',
      completed: false,
      active: false
    }
  ];

  // State management
  const [currentStep, setCurrentStep] = useState(0);
  const [checkoutSteps, setCheckoutSteps] = useState(steps);
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    isGuest: true,
    customerInfo: undefined,
    shippingAddress: null,
    billingAddress: null, // Will be same as shipping
    sameBillingAddress: true,
    shippingMethod: null,
    paymentMethod: null,
    creditCardInfo: null,
    appliedDiscount: null,
    orderNotes: ''
  });

  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [totals, setTotals] = useState<OrderTotals | null>(null);
  // const [validationErrors, setValidationErrors] = useState<{ [step: number]: CheckoutValidation }>({}); // Reserved for future use
  const [stepValidation, setStepValidation] = useState<{ [step: number]: boolean }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate cart subtotal
  const subtotal = cart.reduce((sum: number, item: CartItem) => sum + (item.product.price * item.quantity), 0);

  // Load shipping methods when we have a valid shipping address
  useEffect(() => {
    const loadShippingMethods = async () => {
      if (!checkoutData.shippingAddress || !stepValidation[0]) return;

      setLoading(prev => ({ ...prev, shipping: true }));
      try {
        const response = await mockCheckoutApi.getShippingMethods(subtotal);
        if (response.success && response.data) {
          setShippingMethods(response.data);
          
          // Auto-select standard shipping if available
          if (!checkoutData.shippingMethod) {
            const standardShipping = response.data.find(method => method.id === 'standard');
            if (standardShipping) {
              setCheckoutData(prev => ({ ...prev, shippingMethod: standardShipping }));
            }
          }
        }
      } catch (error) {
        console.error('Failed to load shipping methods:', error);
      } finally {
        setLoading(prev => ({ ...prev, shipping: false }));
      }
    };

    loadShippingMethods();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutData.shippingAddress, stepValidation, subtotal]);

  // Calculate totals when shipping method or discount changes
  useEffect(() => {
    const calculateTotals = async () => {
      if (!checkoutData.shippingMethod) return;

      setLoading(prev => ({ ...prev, totals: true }));
      try {
        const discountAmount = checkoutData.appliedDiscount 
          ? (checkoutData.appliedDiscount.type === 'percentage' 
              ? subtotal * (checkoutData.appliedDiscount.value / 100) 
              : checkoutData.appliedDiscount.value)
          : 0;

        const response = await mockCheckoutApi.calculateTotals(
          subtotal, 
          checkoutData.shippingMethod, 
          discountAmount
        );
        
        if (response.success && response.data) {
          setTotals(response.data);
        }
      } catch (error) {
        console.error('Failed to calculate totals:', error);
      } finally {
        setLoading(prev => ({ ...prev, totals: false }));
      }
    };

    calculateTotals();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkoutData.shippingMethod, checkoutData.appliedDiscount, subtotal]);

  // Handle step validation
  const handleStepValidation = useCallback((step: number, isValid: boolean, errors: CheckoutValidation) => {
    setStepValidation(prev => ({ ...prev, [step]: isValid }));
    // setValidationErrors(prev => ({ ...prev, [step]: errors })); // Reserved for future use
    
    // Update step completion status
    setCheckoutSteps(prev => prev.map(s => 
      s.id === step ? { ...s, completed: isValid } : s
    ));
  }, []);

  // Navigate to specific step
  const goToStep = (stepIndex: number) => {
    // Don't allow going to future steps if current step is invalid
    if (stepIndex > currentStep && !stepValidation[currentStep]) {
      return;
    }
    
    setCurrentStep(stepIndex);
    setCheckoutSteps(prev => prev.map((step, index) => ({
      ...step,
      active: index === stepIndex
    })));
  };

  // Handle next step
  const handleNextStep = () => {
    if (currentStep < steps.length - 1 && stepValidation[currentStep]) {
      goToStep(currentStep + 1);
    }
  };

  // Handle previous step
  const handlePreviousStep = () => {
    if (currentStep > 0) {
      goToStep(currentStep - 1);
    }
  };

  // Handle address changes
  const handleShippingAddressChange = useCallback((address: CheckoutAddress) => {
    setCheckoutData(prev => ({ 
      ...prev, 
      shippingAddress: address,
      billingAddress: address // Always use shipping as billing
    }));
  }, []);

  // Handle shipping method change
  const handleShippingMethodChange = (method: ShippingMethod) => {
    setCheckoutData(prev => ({ ...prev, shippingMethod: method }));
    setStepValidation(prev => ({ ...prev, 1: true }));
  };

  // Handle payment method changes
  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setCheckoutData(prev => ({ ...prev, paymentMethod: method }));
  };

  const handleCreditCardChange = (cardInfo: CreditCardInfo) => {
    setCheckoutData(prev => ({ ...prev, creditCardInfo: cardInfo }));
  };

  // Sample discount codes for demo
  const sampleDiscounts: Record<string, DiscountCodeType> = {
    'SAVE10': {
      code: 'SAVE10',
      type: 'percentage',
      value: 10,
      minAmount: 25,
      active: true
    },
    'WELCOME5': {
      code: 'WELCOME5',
      type: 'fixed',
      value: 5,
      active: true
    },
    'FREESHIP': {
      code: 'FREESHIP',
      type: 'percentage',
      value: 100,
      active: true
    }
  };

  // Handle discount code
  const handleDiscountApply = async (code: string): Promise<DiscountCodeType | null> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const discount = sampleDiscounts[code];
    if (discount && discount.active) {
      setCheckoutData(prev => ({ ...prev, appliedDiscount: discount }));
      return discount;
    }
    return null;
  };

  const handleDiscountRemove = () => {
    setCheckoutData(prev => ({ ...prev, appliedDiscount: null }));
  };

  // Handle order submission
  const handleSubmitOrder = async () => {
    if (!totals || !checkoutData.paymentMethod || !checkoutData.shippingMethod) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Step 1: Process payment
      const paymentResponse = await mockCheckoutApi.processPayment(
        checkoutData.paymentMethod,
        totals.total,
        checkoutData.creditCardInfo
      );

      if (!paymentResponse.success || !paymentResponse.data) {
        throw new Error(paymentResponse.message || 'Payment failed');
      }

      // Step 2: Create order
      const orderResponse = await mockCheckoutApi.createOrder({
        items: cart,
        shippingAddress: checkoutData.shippingAddress!,
        billingAddress: checkoutData.shippingAddress!, // Use shipping as billing
        paymentMethod: checkoutData.paymentMethod,
        shippingMethod: checkoutData.shippingMethod,
        totals: totals,
        transactionId: paymentResponse.data.transactionId,
        notes: checkoutData.orderNotes
      });

      if (!orderResponse.success || !orderResponse.data) {
        throw new Error(orderResponse.message || 'Order creation failed');
      }

      // Step 3: Clear cart and redirect to confirmation
      await clearCart();
      navigate(`/order-confirmation/${orderResponse.data.orderId}`, {
        state: { order: orderResponse.data }
      });

    } catch (error) {
      console.error('Order submission failed:', error);
      alert(error instanceof Error ? error.message : 'Order submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Address Step
        return (
          <div className="space-y-8">
            {/* Guest Checkout Toggle */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  id="guestCheckout"
                  checked={checkoutData.isGuest}
                  onChange={(e) => setCheckoutData(prev => ({ ...prev, isGuest: e.target.checked }))}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                />
                <div className="flex-1">
                  <label htmlFor="guestCheckout" className="text-base font-semibold text-blue-800 cursor-pointer">
                    Continue as guest (no account required)
                  </label>
                  {checkoutData.isGuest && (
                    <p className="text-sm text-blue-600 mt-2 leading-relaxed">
                      You'll receive order updates via email. You can create an account after checkout.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <AddressForm
              address={checkoutData.shippingAddress}
              type="shipping"
              onAddressChange={handleShippingAddressChange}
              onValidationChange={(isValid, errors) => handleStepValidation(0, isValid, errors)}
              isSubmitting={isSubmitting}
            />

            {/* Note about billing */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-blue-800 mb-2">Billing Information</p>
                  <p className="text-sm text-blue-600 leading-relaxed">
                    Your billing address will be the same as your shipping address for this order.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 1: // Shipping Step
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Shipping Method</h3>
                <p className="text-sm text-gray-500">Choose how you'd like to receive your order</p>
              </div>
            </div>

            {loading.shipping ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse h-20 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {shippingMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`
                      border-2 rounded-xl p-4 cursor-pointer transition-all duration-200
                      ${checkoutData.shippingMethod?.id === method.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                      }
                    `}
                    onClick={() => handleShippingMethodChange(method)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`
                            w-5 h-5 rounded-full border-2 transition-colors
                            ${checkoutData.shippingMethod?.id === method.id
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                            }
                          `}
                        >
                          {checkoutData.shippingMethod?.id === method.id && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{method.name}</div>
                          <div className="text-sm text-gray-500">{method.description}</div>
                          <div className="text-sm text-gray-500">{method.estimatedDays}</div>
                          {method.carrier && (
                            <div className="text-sm text-gray-500">via {method.carrier}</div>
                          )}
                        </div>
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        {method.price > 0 ? formatPrice(method.price) : 'Free'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Free Shipping Notice */}
            {subtotal >= 50 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-green-800">
                    Congratulations! You qualify for free standard shipping.
                  </span>
                </div>
              </div>
            )}
          </div>
        );

      case 2: // Payment Step
        return (
          <div className="space-y-8">
            <PaymentMethods
              selectedPaymentMethod={checkoutData.paymentMethod}
              creditCardInfo={checkoutData.creditCardInfo}
              onPaymentMethodChange={handlePaymentMethodChange}
              onCreditCardChange={handleCreditCardChange}
              onValidationChange={(isValid, errors) => handleStepValidation(2, isValid, errors)}
              isSubmitting={isSubmitting}
            />

            {/* Discount Code */}
            <div className="border-t border-gray-200 pt-6">
              <DiscountCode
                appliedDiscount={checkoutData.appliedDiscount}
                onApplyDiscount={handleDiscountApply}
                onRemoveDiscount={handleDiscountRemove}
              />
            </div>

            {/* Order Notes */}
            <div>
              <label htmlFor="orderNotes" className="block text-sm font-medium text-gray-700 mb-2">
                Order Notes (Optional)
              </label>
              <textarea
                id="orderNotes"
                value={checkoutData.orderNotes}
                onChange={(e) => setCheckoutData(prev => ({ ...prev, orderNotes: e.target.value }))}
                disabled={isSubmitting}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                rows={3}
                placeholder="Any special instructions for your order..."
              />
            </div>
          </div>
        );

      case 3: // Review Step
        return (
          <OrderReview
            checkoutData={checkoutData}
            cartItems={cart}
            totals={totals}
            shippingMethod={checkoutData.shippingMethod}
            onEdit={goToStep}
            isSubmitting={isSubmitting}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <Link
              to="/cart"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Cart
            </Link>
          </div>
        </div>
      </div>

      {/* Progress Stepper */}
      <CheckoutStepper steps={checkoutSteps} currentStep={currentStep} />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-10">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="bg-gray-50 px-6 sm:px-8 lg:px-10 py-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <button
                onClick={handlePreviousStep}
                disabled={currentStep === 0 || isSubmitting}
                className="px-8 py-3.5 text-gray-700 bg-white border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              <div className="flex items-center gap-6">
                {/* Order Total */}
                {totals && (
                  <div className="text-right">
                    <div className="text-sm text-gray-500 font-medium">Order Total</div>
                    <div className="text-2xl font-bold text-gray-900">
                      ${totals.total.toFixed(2)}
                    </div>
                  </div>
                )}

                {/* Next/Submit Button */}
                {currentStep < steps.length - 1 ? (
                  <button
                    onClick={handleNextStep}
                    disabled={!stepValidation[currentStep] || isSubmitting}
                    className="px-8 py-3.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                  >
                    Continue
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitOrder}
                    disabled={
                      !stepValidation[currentStep] || 
                      !totals || 
                      !checkoutData.paymentMethod || 
                      !checkoutData.shippingMethod ||
                      isSubmitting
                    }
                    className="px-10 py-3.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Place Order
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 