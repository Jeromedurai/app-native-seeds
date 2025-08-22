import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { DiscountCode as DiscountCodeType } from '../../types';
import { formatPrice, calculateCartTotal } from '../../utils';
import CartItem from '../../components/cart/CartItem';
import CartSummary from '../../components/cart/CartSummary';
import DiscountCode from '../../components/cart/DiscountCode';
import ConfirmationModal from '../../components/common/ConfirmationModal';



const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, clearCart, fetchCart } = useAppContext();
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCodeType | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Minimum order value constant
  const MINIMUM_ORDER_VALUE = 500;

  // Filter valid cart items to avoid phantom items
  const validCartItems = cart.filter(item => 
    item && 
    item.product && 
    item.product.productId && 
    item.product.productName && 
    item.quantity > 0
  );

  // Calculate cart total for minimum order validation
  const cartTotal = calculateCartTotal(validCartItems);
  const meetsMinimumOrder = cartTotal >= MINIMUM_ORDER_VALUE;

  // Debug: Track phantom items (can be removed in production)
  if (cart.length !== validCartItems.length) {
    console.warn('Phantom items detected in cart:', {
      rawCount: cart.length,
      validCount: validCartItems.length,
      phantomItems: cart.filter(item => !validCartItems.includes(item))
    });
  }

  // Refresh cart data when component mounts to ensure sync
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Auto-cleanup phantom items when detected
  useEffect(() => {
    if (cart.length > 0 && validCartItems.length !== cart.length) {
      console.log('Phantom items detected, cleaning up cart...');
      // Force a cart refresh to clean up phantom items
      setTimeout(() => fetchCart(), 100);
    }
  }, [cart.length, validCartItems.length, fetchCart]);

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
      value: 100, // This would be handled differently in real app
      minAmount: 30,
      active: true
    }
  };

  // Handle discount application
  const handleApplyDiscount = async (code: string): Promise<DiscountCodeType | null> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const discount = sampleDiscounts[code];
    if (discount && discount.active) {
      setAppliedDiscount(discount);
      return discount;
    }
    return null;
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
  };

  const handleClearCart = () => {
    setShowClearModal(true);
  };

  const confirmClearCart = async () => {
    setIsClearing(true);
    try {
      await clearCart();
      setAppliedDiscount(null);
      setShowClearModal(false);
    } catch (error) {
      console.error('Failed to clear cart:', error);
      // Keep modal open to show error state
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                {validCartItems.length === 0 
                  ? 'Your cart is empty' 
                  : `${validCartItems.length} item${validCartItems.length !== 1 ? 's' : ''} in your cart`
                }
              </p>
            </div>
            {validCartItems.length > 0 && (
              <div className="flex gap-3">
                <button
                  onClick={() => fetchCart()}
                  className="text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium self-start sm:self-auto"
                >
                  Refresh Cart
                </button>
                <button
                  onClick={handleClearCart}
                  className="text-red-600 hover:text-red-800 transition-colors text-sm font-medium self-start sm:self-auto"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </div>
        </div>

        {validCartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-16">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a1 1 0 01-1 1H9a1 1 0 01-1-1v-6m8 0V9a1 1 0 00-1-1H9a1 1 0 00-1 1v4.01" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Continue Shopping
            </Link>
          </div>
        ) : (
          /* Cart Content */
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items - Left Side */}
            <div className="lg:col-span-2 order-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 sm:p-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Cart Items</h2>
                  <div className="space-y-4 sm:space-y-6">
                    {validCartItems.map((item) => (
                      <div key={item.id} className="border-b border-gray-200 pb-4 sm:pb-6 last:border-b-0 last:pb-0">
                        <CartItem item={item} showRemove={true} compact={false} />
                      </div>
                    ))}
                    {validCartItems.length === 0 && cart.length > 0 && (
                      <div className="text-center py-4 text-gray-500">
                        <p>Found invalid items in cart. <button onClick={() => fetchCart()} className="text-blue-600 hover:underline">Refresh cart</button> to clean up.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Continue Shopping */}
              <div className="mt-4 sm:mt-6 pb-2">
                <Link
                  to="/"
                  className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors font-medium text-sm sm:text-base"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Cart Summary - Right Side */}
            <div className="lg:col-span-1 order-2 lg:order-2">
              <div className="lg:sticky lg:top-4 space-y-4 sm:space-y-6">
                {/* Cart Summary */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <CartSummary
                    items={validCartItems}
                    appliedDiscount={appliedDiscount}
                    showShipping={true}
                    showTax={true}
                    className="!bg-white !p-4 sm:!p-6"
                  />
                </div>

                {/* Discount Code */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Discount Code</h3>
                  <DiscountCode
                    onApplyDiscount={handleApplyDiscount}
                    appliedDiscount={appliedDiscount}
                    onRemoveDiscount={handleRemoveDiscount}
                  />
                </div>

                {/* Checkout Button */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                  {/* Minimum Order Value Message */}
                  {!meetsMinimumOrder && validCartItems.length > 0 && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span className="text-sm font-medium text-yellow-800">
                          Minimum order value is ₹{MINIMUM_ORDER_VALUE}. Add {formatPrice(MINIMUM_ORDER_VALUE - cartTotal)} more to proceed.
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => navigate('/checkout')}
                    disabled={!meetsMinimumOrder || validCartItems.length === 0}
                    className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-semibold text-base sm:text-lg transition-colors flex items-center justify-center gap-2 sm:gap-3 ${
                      meetsMinimumOrder && validCartItems.length > 0
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    {validCartItems.length === 0 ? 'Cart is Empty' : 'Proceed to Checkout'}
                  </button>

                  {/* Security Badges */}
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="text-gray-700 text-xs">Secure Checkout</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700 text-xs">30-day Returns</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <span className="text-xs text-gray-700">Free Shipping over ₹2000</span>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">We Accept</h3>
                  <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
                    <div className="w-10 h-6 sm:w-12 sm:h-8 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">VISA</span>
                    </div>
                    <div className="w-10 h-6 sm:w-12 sm:h-8 bg-red-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">MC</span>
                    </div>
                    <div className="w-10 h-6 sm:w-12 sm:h-8 bg-blue-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">AMEX</span>
                    </div>
                    <div className="w-10 h-6 sm:w-12 sm:h-8 bg-blue-700 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">PP</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Clear Cart Confirmation Modal */}
      <ConfirmationModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={confirmClearCart}
        title="Clear Cart"
        message="Are you sure you want to remove all items from your cart? This action cannot be undone."
        confirmText="Clear Cart"
        cancelText="Keep Items"
        loading={isClearing}
        type="danger"
      />
    </div>
  );
};

export default Cart; 