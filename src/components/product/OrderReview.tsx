import React from 'react';
import { CheckoutData, OrderTotals, ShippingMethod, CartItem } from '../../types';
import { formatPrice } from '../../utils';

interface OrderReviewProps {
  checkoutData: CheckoutData;
  cartItems: CartItem[];
  totals: OrderTotals | null;
  shippingMethod: ShippingMethod | null;
  onEdit: (step: number) => void;
  isSubmitting?: boolean;
}

const OrderReview: React.FC<OrderReviewProps> = ({
  checkoutData,
  cartItems,
  totals,
  shippingMethod,
  onEdit,
  isSubmitting = false
}) => {
  const formatCardNumber = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    return `**** **** **** ${cleaned.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-100 rounded-lg">
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Review Your Order</h3>
          <p className="text-sm text-gray-500">Please review your order details before completing your purchase</p>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-gray-900">Order Items</h4>
            <span className="text-sm text-gray-500">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {cartItems.map((item) => (
            <div key={item.id} className="p-6 flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={item.product.images?.[0]?.poster || `/api/placeholder/80/80`}
                  alt={item.product.productName}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h5 className="text-base font-medium text-gray-900 truncate">{item.product.productName}</h5>
                <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
                <p className="text-sm text-gray-500">Unit Price: {formatPrice(item.product.price)}</p>
              </div>
              
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">
                  {formatPrice(item.product.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-gray-900">Shipping Address</h4>
              <button
                onClick={() => onEdit(0)}
                disabled={isSubmitting}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
              >
                Edit
              </button>
            </div>
          </div>
          
          {checkoutData.shippingAddress ? (
            <div className="p-6">
              <div className="text-sm text-gray-900 space-y-1">
                <div className="font-medium">
                  {checkoutData.shippingAddress.firstName} {checkoutData.shippingAddress.lastName}
                </div>
                {checkoutData.shippingAddress.company && (
                  <div>{checkoutData.shippingAddress.company}</div>
                )}
                <div>{checkoutData.shippingAddress.address1}</div>
                {checkoutData.shippingAddress.address2 && (
                  <div>{checkoutData.shippingAddress.address2}</div>
                )}
                <div>
                  {checkoutData.shippingAddress.city}, {checkoutData.shippingAddress.state} {checkoutData.shippingAddress.zipCode}
                </div>
                <div>{checkoutData.shippingAddress.country}</div>
                <div className="pt-2 text-gray-600">
                  {checkoutData.shippingAddress.email}
                </div>
                <div className="text-gray-600">
                  {checkoutData.shippingAddress.phone}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-gray-500">No shipping address provided</div>
          )}
        </div>

        {/* Billing Address */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-gray-900">Billing Address</h4>
              <button
                onClick={() => onEdit(0)}
                disabled={isSubmitting}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
              >
                Edit
              </button>
            </div>
          </div>
          
          {checkoutData.sameBillingAddress && checkoutData.shippingAddress ? (
            <div className="p-6">
              <div className="text-sm text-gray-600 italic">Same as shipping address</div>
            </div>
          ) : checkoutData.billingAddress ? (
            <div className="p-6">
              <div className="text-sm text-gray-900 space-y-1">
                <div className="font-medium">
                  {checkoutData.billingAddress.firstName} {checkoutData.billingAddress.lastName}
                </div>
                {checkoutData.billingAddress.company && (
                  <div>{checkoutData.billingAddress.company}</div>
                )}
                <div>{checkoutData.billingAddress.address1}</div>
                {checkoutData.billingAddress.address2 && (
                  <div>{checkoutData.billingAddress.address2}</div>
                )}
                <div>
                  {checkoutData.billingAddress.city}, {checkoutData.billingAddress.state} {checkoutData.billingAddress.zipCode}
                </div>
                <div>{checkoutData.billingAddress.country}</div>
                <div className="pt-2 text-gray-600">
                  {checkoutData.billingAddress.email}
                </div>
                <div className="text-gray-600">
                  {checkoutData.billingAddress.phone}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-gray-500">No billing address provided</div>
          )}
        </div>

        {/* Shipping Method */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-gray-900">Shipping Method</h4>
              <button
                onClick={() => onEdit(1)}
                disabled={isSubmitting}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
              >
                Edit
              </button>
            </div>
          </div>
          
          {shippingMethod ? (
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{shippingMethod.name}</div>
                  <div className="text-sm text-gray-500">{shippingMethod.description}</div>
                  <div className="text-sm text-gray-500">{shippingMethod.estimatedDays}</div>
                  {shippingMethod.carrier && (
                    <div className="text-sm text-gray-500">via {shippingMethod.carrier}</div>
                  )}
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {shippingMethod.price > 0 ? formatPrice(shippingMethod.price) : 'Free'}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-gray-500">No shipping method selected</div>
          )}
        </div>

        {/* Payment Method */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-gray-900">Payment Method</h4>
              <button
                onClick={() => onEdit(2)}
                disabled={isSubmitting}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
              >
                Edit
              </button>
            </div>
          </div>
          
          {checkoutData.paymentMethod ? (
            <div className="p-6">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{checkoutData.paymentMethod.icon}</div>
                <div>
                  <div className="font-medium text-gray-900">{checkoutData.paymentMethod.name}</div>
                  {checkoutData.paymentMethod.type === 'credit_card' && checkoutData.creditCardInfo && (
                    <div className="text-sm text-gray-500">
                      {formatCardNumber(checkoutData.creditCardInfo.cardNumber)}
                    </div>
                  )}
                  {checkoutData.paymentMethod.description && (
                    <div className="text-sm text-gray-500">{checkoutData.paymentMethod.description}</div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-gray-500">No payment method selected</div>
          )}
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-medium text-gray-900">Order Summary</h4>
        </div>
        
        {totals ? (
          <div className="p-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">{formatPrice(totals.subtotal)}</span>
            </div>
            
            {totals.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Discount {checkoutData.appliedDiscount && `(${checkoutData.appliedDiscount.code})`}
                </span>
                <span className="text-green-600">-{formatPrice(totals.discount)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="text-gray-900">
                {totals.shipping > 0 ? formatPrice(totals.shipping) : 'Free'}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax</span>
              <span className="text-gray-900">{formatPrice(totals.tax)}</span>
            </div>
            
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">{formatPrice(totals.total)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-gray-500">Order totals not available</div>
        )}
      </div>

      {/* Guest Checkout Info */}
      {checkoutData.isGuest && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h5 className="text-sm font-medium text-blue-800">Guest Checkout</h5>
              <p className="text-sm text-blue-600 mt-1">
                You're checking out as a guest. You'll receive order updates via email.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Order Notes */}
      {checkoutData.orderNotes && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h4 className="text-lg font-medium text-gray-900">Order Notes</h4>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-700">{checkoutData.orderNotes}</p>
          </div>
        </div>
      )}

      {/* Terms and Policies */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="text-sm text-gray-600 space-y-2">
          <p>
            By placing this order, you agree to our{' '}
            <a href="/terms" className="text-blue-600 hover:text-blue-700 underline">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="text-blue-600 hover:text-blue-700 underline">Privacy Policy</a>.
          </p>
          <p>
            Your personal data will be used to process your order and improve your experience.
          </p>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="flex flex-wrap items-center justify-center gap-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>SSL Secured</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>Money Back Guarantee</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span>Free Returns</span>
        </div>
      </div>
    </div>
  );
};

export default OrderReview; 