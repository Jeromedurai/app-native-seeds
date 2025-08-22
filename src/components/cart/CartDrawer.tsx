import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { DiscountCode as DiscountCodeType } from '../../types';
import { formatPrice, calculateCartTotal } from '../../utils';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import DiscountCode from './DiscountCode';
import ConfirmationModal from '../common/ConfirmationModal';
import { FREE_SHIPPING_THRESHOLD } from '../../services/mockData';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { cart, clearCart } = useAppContext();
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCodeType | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

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

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
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

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`
          fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-xl
          transform transition-transform duration-300 ease-in-out
          ${isOpen && !isClosing ? 'translate-x-0' : 'translate-x-full'}
        `}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
            <h2 id="cart-drawer-title" className="text-xl font-semibold text-gray-900">
              Shopping Cart ({validCartItems.length})
            </h2>
            <div className="flex items-center gap-2">
              {validCartItems.length > 0 && (
                <button
                  onClick={handleClearCart}
                  className="text-sm text-gray-500 hover:text-red-600 transition-colors px-2 py-1 rounded"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close cart"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {validCartItems.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a1 1 0 01-1 1H9a1 1 0 01-1-1v-6m8 0V9a1 1 0 00-1-1H9a1 1 0 00-1 1v4.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500 mb-6">Add some items to get started!</p>
                <button
                  onClick={handleClose}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="p-4 space-y-6">
                {/* Cart Items */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Items in your cart</h3>
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {validCartItems.map((item) => (
                      <div key={item.id} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                        <CartItem item={item} showRemove={true} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Discount Code */}
                <DiscountCode
                  onApplyDiscount={handleApplyDiscount}
                  appliedDiscount={appliedDiscount}
                  onRemoveDiscount={handleRemoveDiscount}
                />

                {/* Cart Summary */}
                <CartSummary
                  items={validCartItems}
                  appliedDiscount={appliedDiscount}
                  showShipping={true}
                  showTax={true}
                />
              </div>
            )}
          </div>

          {/* Footer - Checkout Button */}
          {validCartItems.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-white sticky bottom-0">
              <div className="space-y-3">
                {/* Minimum Order Value Message */}
                {!meetsMinimumOrder && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
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
                  onClick={() => {
                    onClose();
                    navigate('/checkout');
                  }}
                  disabled={!meetsMinimumOrder}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    meetsMinimumOrder
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Proceed to Checkout
                </button>
                
                <button
                  onClick={handleClose}
                  className="w-full text-gray-600 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </button>

                {/* Trust Indicators */}
                <div className="flex items-center justify-center gap-4 pt-2 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>30-day returns</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span>Free shipping over ₹2000</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
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
    </>
  );
};

export default CartDrawer; 