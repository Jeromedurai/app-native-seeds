import React from 'react';
import { CartItem, DiscountCode, CartTotals } from '../../types';
import { formatPrice, calculateCartTotal } from '../../utils';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_COST } from '../../services/mockData';

interface CartSummaryProps {
  items: CartItem[];
  appliedDiscount?: DiscountCode | null;
  showShipping?: boolean;
  showTax?: boolean;
  compact?: boolean;
  className?: string;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  items,
  appliedDiscount,
  showShipping = true,
  showTax = true,
  compact = false,
  className = ''
}) => {
  // Calculate totals
  const calculateTotals = (): CartTotals => {
    const subtotal = calculateCartTotal(items);
    
    // Calculate discount
    let discount = 0;
    if (appliedDiscount && subtotal > 0) {
      if (appliedDiscount.minAmount && subtotal < appliedDiscount.minAmount) {
        // Don't apply discount if minimum amount not met
        discount = 0;
      } else if (appliedDiscount.type === 'percentage') {
        discount = subtotal * (appliedDiscount.value / 100);
      } else {
        discount = appliedDiscount.value;
      }
      // Cap discount at subtotal
      discount = Math.min(discount, subtotal);
    }

    // Calculate tax (8.5% for demo)
    const taxableAmount = subtotal - discount;
    const tax = showTax ? taxableAmount * 0.085 : 0;

    // Calculate shipping
    const shipping = showShipping 
      ? (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST)
      : 0;

    const total = subtotal - discount + tax + shipping;

    return {
      subtotal,
      discount,
      tax,
      shipping,
      total: Math.max(0, total)
    };
  };

  const totals = calculateTotals();
  const hasItems = items.length > 0;
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - totals.subtotal);
  
  // Minimum order value constants
  const MINIMUM_ORDER_VALUE = 500;
  const minimumOrderRemaining = Math.max(0, MINIMUM_ORDER_VALUE - totals.subtotal);
  const meetsMinimumOrder = totals.subtotal >= MINIMUM_ORDER_VALUE;

  return (
    <div className={`bg-gray-50 rounded-lg ${compact ? 'p-4' : 'p-6'} ${className}`}>
      {/* Minimum Order Value Progress */}
      {hasItems && !meetsMinimumOrder && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-sm font-medium text-yellow-800">
              Add {formatPrice(minimumOrderRemaining)} more to meet minimum order value (₹{MINIMUM_ORDER_VALUE})
            </span>
          </div>
          <div className="w-full bg-yellow-200 rounded-full h-2">
            <div 
              className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (totals.subtotal / MINIMUM_ORDER_VALUE) * 100)}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Free Shipping Progress */}
      {showShipping && hasItems && freeShippingRemaining > 0 && meetsMinimumOrder && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="text-sm font-medium text-blue-800">
              Add {formatPrice(freeShippingRemaining)} more for free shipping!
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (totals.subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Order Summary Title */}
      <h3 className={`font-semibold text-gray-900 mb-4 ${compact ? 'text-base' : 'text-lg'}`}>
        Order Summary
      </h3>

      {hasItems ? (
        <div className="space-y-3">
          {/* Subtotal */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">
              Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)
            </span>
            <span className="font-medium text-gray-900">
              {formatPrice(totals.subtotal)}
            </span>
          </div>

          {/* Discount */}
          {totals.discount > 0 && (
            <div className="flex justify-between items-center text-green-600">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Discount ({appliedDiscount?.code})
              </span>
              <span className="font-medium">
                -{formatPrice(totals.discount)}
              </span>
            </div>
          )}

          {/* Minimum amount warning for discount */}
          {appliedDiscount && appliedDiscount.minAmount && totals.subtotal < appliedDiscount.minAmount && (
            <div className="flex items-center gap-2 p-2 bg-orange-50 border border-orange-200 rounded">
              <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs text-orange-700">
                Add {formatPrice(appliedDiscount.minAmount - totals.subtotal)} more to use this discount
              </span>
            </div>
          )}

          {/* Shipping */}
          {showShipping && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Shipping</span>
              <span className={`font-medium ${totals.shipping === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                {totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}
              </span>
            </div>
          )}

          {/* Tax */}
          {showTax && totals.tax > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tax</span>
              <span className="font-medium text-gray-900">
                {formatPrice(totals.tax)}
              </span>
            </div>
          )}

          {/* Divider */}
          <hr className="border-gray-200" />

          {/* Total */}
          <div className="flex justify-between items-center">
            <span className={`font-semibold text-gray-900 ${compact ? 'text-base' : 'text-lg'}`}>
              Total
            </span>
            <span className={`font-bold text-green-600 ${compact ? 'text-lg' : 'text-xl'}`}>
              {formatPrice(totals.total)}
            </span>
          </div>

          {/* Savings Summary */}
          {totals.discount > 0 && (
            <div className="text-center p-2 bg-green-50 border border-green-200 rounded">
              <span className="text-sm text-green-700">
                🎉 You saved {formatPrice(totals.discount)}!
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a1 1 0 01-1 1H9a1 1 0 01-1-1v-6m8 0V9a1 1 0 00-1-1H9a1 1 0 00-1 1v4.01" />
          </svg>
          <p className="text-gray-500 text-sm">Your cart is empty</p>
        </div>
      )}

      {/* Secure Checkout Badge */}
      {hasItems && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Secure checkout with SSL encryption</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartSummary; 