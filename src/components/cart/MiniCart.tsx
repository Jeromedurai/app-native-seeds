import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { calculateCartItemCount, calculateCartTotal, formatPrice, getMainProductImage } from '../../utils';
import { FREE_SHIPPING_THRESHOLD } from '../../services/mockData';

interface MiniCartProps {
  className?: string;
}

const MiniCart: React.FC<MiniCartProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const { cart } = useAppContext();
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter valid cart items to avoid phantom items
  const validCartItems = cart.filter(item => 
    item && 
    item.product && 
    item.product.productId && 
    item.product.productName && 
    item.quantity > 0
  );

  const cartItemCount = calculateCartItemCount(validCartItems);
  const cartTotal = calculateCartTotal(validCartItems);

  // Handle mouse enter with delay
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Show preview after a short delay
    timeoutRef.current = setTimeout(() => {
      if (validCartItems.length > 0) {
        setShowPreview(true);
      }
    }, 300);
  };

  // Handle mouse leave with delay
  const handleMouseLeave = () => {
    setIsHovered(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Hide preview after a short delay
    timeoutRef.current = setTimeout(() => {
      setShowPreview(false);
    }, 300);
  };

  // Close preview when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowPreview(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      className={`relative ${className}`}
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Cart Button */}
      <button
        onClick={() => navigate('/cart')}
        className={`
          relative p-2 text-gray-700 hover:text-green-600 transition-all duration-200
          ${isHovered ? 'transform scale-105' : ''}
        `}
        aria-label={`Shopping cart with ${cartItemCount} items`}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a1 1 0 01-1 1H9a1 1 0 01-1-1v-6m8 0V9a1 1 0 00-1-1H9a1 1 0 00-1 1v4.01"
          />
        </svg>
        
        {/* Item Count Badge */}
        {cartItemCount > 0 && (
          <span 
            className={`
              absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full 
              w-5 h-5 flex items-center justify-center font-medium
              transform transition-all duration-200
              ${isHovered ? 'scale-110' : ''}
            `}
          >
            {cartItemCount > 99 ? '99+' : cartItemCount}
          </span>
        )}
      </button>

      {/* Cart Preview Dropdown */}
      {showPreview && validCartItems.length > 0 && (
        <div
          className={`
            absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg 
            border border-gray-200 z-50 transform transition-all duration-200
            ${showPreview ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
          `}
          onMouseEnter={() => setShowPreview(true)}
          onMouseLeave={handleMouseLeave}
        >
          {/* Arrow */}
          <div className="absolute -top-2 right-6">
            <div className="w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"></div>
          </div>

          <div className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Cart Preview</h3>
              <span className="text-sm text-gray-500">
                {cartItemCount} item{cartItemCount !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Cart Items Preview */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {validCartItems.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 flex-shrink-0">
                    <img
                      src={getMainProductImage(item.product)}
                      alt={item.product.productName}
                      className="w-full h-full object-cover rounded border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.product.productName}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Show more indicator */}
              {validCartItems.length > 3 && (
                <div className="text-center py-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    +{validCartItems.length - 3} more item{validCartItems.length - 3 !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>

            {/* Total and Actions */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-gray-900">Subtotal:</span>
                <span className="font-bold text-green-600">
                  {formatPrice(cartTotal)}
                </span>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => navigate('/cart')}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors text-sm"
                >
                  View Cart
                </button>
                <button
                  onClick={() => {
                    setShowPreview(false);
                    // Handle checkout logic here
                    alert('Quick checkout functionality would be implemented here!');
                  }}
                  className="w-full border border-green-600 text-green-600 py-2 px-4 rounded-lg font-medium hover:bg-green-50 transition-colors text-sm"
                >
                  Quick Checkout
                </button>
              </div>

              {/* Free Shipping Message */}
              {cartTotal < FREE_SHIPPING_THRESHOLD && (
                <div className="text-sm text-gray-600 text-center mt-2">
                  Add {formatPrice(FREE_SHIPPING_THRESHOLD - cartTotal)} for free shipping
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Empty Cart Hover Message */}
      {isHovered && validCartItems.length === 0 && (
        <div className="absolute top-full right-0 mt-2 p-3 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap z-50">
          Your cart is empty
          <div className="absolute -top-1 right-4">
            <div className="w-2 h-2 bg-gray-900 transform rotate-45"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniCart; 