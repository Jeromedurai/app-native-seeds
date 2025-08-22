import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckoutOrder } from '../../types';
import { mockCheckoutApi } from '../../services/mockCheckoutApi';
import { formatPrice } from '../../utils';



const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  // const navigate = useNavigate(); // Reserved for future use
  
  const [order, setOrder] = useState<CheckoutOrder | null>(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState<string | null>(null);

  // Fetch order if not passed via state
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId || order) return;

      setLoading(true);
      try {
        const response = await mockCheckoutApi.getOrder(orderId);
        if (response.success && response.data) {
          setOrder(response.data);
        } else {
          setError('Order not found');
        }
      } catch (error) {
        console.error('Failed to fetch order:', error);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, order]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The order you are looking for could not be found.'}</p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Order Confirmed!</h1>
            <p className="text-lg text-gray-600 mt-2">
              Thank you for your order. We'll send you a confirmation email shortly.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
                <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm font-medium text-gray-500">Order Number</div>
                  <div className="text-base font-semibold text-gray-900">{order.orderNumber}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Order Date</div>
                  <div className="text-base text-gray-900">{formatDate(order.orderDate)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Estimated Delivery</div>
                  <div className="text-base text-gray-900">
                    {order.estimatedDelivery || 'To be determined'}
                  </div>
                </div>
              </div>

              {order.trackingNumber && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium text-blue-800">Tracking Number</div>
                      <div className="text-sm text-blue-600">{order.trackingNumber}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Items Ordered</h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <div key={item.productId} className="p-6 flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.productImage || `/api/placeholder/80/80`}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-medium text-gray-900 truncate">{item.productName}</h4>
                    <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
                    <p className="text-sm text-gray-500">Unit Price: {formatPrice(item.price)}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">
                      {formatPrice(item.total)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Shipping Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Shipping Information</h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-2">Shipping Address</div>
                  <div className="text-sm text-gray-900 space-y-1">
                    <div className="font-medium">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </div>
                    {order.shippingAddress.company && (
                      <div>{order.shippingAddress.company}</div>
                    )}
                    <div>{order.shippingAddress.address1}</div>
                    {order.shippingAddress.address2 && (
                      <div>{order.shippingAddress.address2}</div>
                    )}
                    <div>
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    </div>
                    <div>{order.shippingAddress.country}</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-500 mb-2">Shipping Method</div>
                  <div className="text-sm text-gray-900">
                    <div className="font-medium">{order.shippingMethod.name}</div>
                    <div className="text-gray-600">{order.shippingMethod.description}</div>
                    <div className="text-gray-600">{order.shippingMethod.estimatedDays}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-2">Payment Method</div>
                  <div className="text-sm text-gray-900 font-medium">{order.paymentMethod}</div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-500 mb-2">Billing Address</div>
                  <div className="text-sm text-gray-900 space-y-1">
                    <div className="font-medium">
                      {order.billingAddress.firstName} {order.billingAddress.lastName}
                    </div>
                    {order.billingAddress.company && (
                      <div>{order.billingAddress.company}</div>
                    )}
                    <div>{order.billingAddress.address1}</div>
                    {order.billingAddress.address2 && (
                      <div>{order.billingAddress.address2}</div>
                    )}
                    <div>
                      {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}
                    </div>
                    <div>{order.billingAddress.country}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Totals */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Order Totals</h3>
            </div>
            
            <div className="p-6">
              <div className="max-w-md ml-auto space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatPrice(order.totals.subtotal)}</span>
                </div>
                
                {order.totals.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="text-green-600">-{formatPrice(order.totals.discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">
                    {order.totals.shipping > 0 ? formatPrice(order.totals.shipping) : 'Free'}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">{formatPrice(order.totals.tax)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">{formatPrice(order.totals.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Notes */}
          {order.notes && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Order Notes</h3>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-700">{order.notes}</p>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">What happens next?</h3>
            <div className="space-y-3 text-sm text-blue-800">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>You'll receive an order confirmation email with all the details.</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span>We'll send you shipping updates and tracking information once your order ships.</span>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Have questions? Contact our customer support team anytime.</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </Link>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation; 