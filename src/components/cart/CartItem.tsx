import React, { useState } from 'react';
import { CartItem as CartItemType } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { formatPrice, getMainProductImage } from '../../utils';
import ConfirmationModal from '../common/ConfirmationModal';

interface CartItemProps {
  item: CartItemType;
  showRemove?: boolean;
  compact?: boolean;
}

const CartItem: React.FC<CartItemProps> = ({ 
  item, 
  showRemove = true, 
  compact = false 
}) => {
  const { updateCartQuantity, removeFromCart } = useAppContext();
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 0) return;
    
    setIsUpdating(true);
    try {
      if (newQuantity === 0) {
        await handleRemove();
      } else {
        await updateCartQuantity(item.product.productId.toString(), newQuantity);
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      // Remove from cart immediately to update state
      await removeFromCart(item.product.productId.toString());
    } catch (error) {
      console.error('Failed to remove item:', error);
      // Reset the removing state if there's an error
      setIsRemoving(false);
    }
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteConfirm(false);
    handleRemove();
  };

  const itemTotal = item.product.price * item.quantity;
  const productImage = getMainProductImage(item.product);

  return (
    <>
      <div 
        className={`
          transition-all duration-300 ease-in-out relative
          ${isRemoving ? 'opacity-0 transform translate-x-4 scale-95' : 'opacity-100 transform translate-x-0 scale-100'}
          ${compact ? 'py-2' : 'py-3 sm:py-4'}
        `}
      >
        <div className={`flex gap-3 sm:gap-4 ${compact ? 'items-center' : 'items-start sm:items-center'}`}>
          {/* Product Image */}
          <div className={`flex-shrink-0 ${compact ? 'w-12 h-12' : 'w-14 h-14 sm:w-16 sm:h-16'}`}>
            <img
              src={productImage}
              alt={item.product.productName}
              className="w-full h-full object-cover rounded-lg border border-gray-200"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-image.jpg';
              }}
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0 pr-2">
            <h4 className={`font-medium text-gray-900 ${compact ? 'text-sm' : 'text-sm sm:text-base'} truncate`}>
              {item.product.productName}
            </h4>
            {!compact && (
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1 line-clamp-1 sm:line-clamp-2">
                {item.product.productDescription}
              </p>
            )}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3 mt-1 sm:mt-2">
              <span className={`font-semibold text-green-600 ${compact ? 'text-sm' : 'text-sm sm:text-base'}`}>
                {formatPrice(item.product.price)}
              </span>
              {!compact && (
                <span className="text-xs sm:text-sm text-gray-500">
                  Total: {formatPrice(itemTotal)}
                </span>
              )}
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div className={`flex items-center gap-1 sm:gap-2 ${compact ? 'scale-90' : ''}`}>
              {/* Quantity Selector */}
              <div className="flex items-center border border-gray-300 rounded-md sm:rounded-lg bg-white">
                <button
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={isUpdating || item.quantity <= 1}
                  className="p-1 sm:p-1.5 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-l-md sm:rounded-l-lg"
                  aria-label="Decrease quantity"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                
                <span className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium text-gray-900 min-w-[2.5rem] sm:min-w-[3rem] text-center">
                  {item.quantity}
                </span>
                
                <button
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  disabled={isUpdating || item.quantity >= item.product.quantity}
                  className="p-1 sm:p-1.5 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-r-md sm:rounded-l-lg"
                  aria-label="Increase quantity"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>

              {/* Remove Button */}
              {showRemove && (
                <button
                  onClick={confirmDelete}
                  disabled={isRemoving}
                  className="p-1 sm:p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                  aria-label="Remove item"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>

            {/* Stock Warning */}
            {item.quantity >= item.product.quantity && (
              <p className="text-xs text-orange-500 text-right">
                Max: {item.product.quantity}
              </p>
            )}
          </div>
        </div>

        {/* Loading Overlay */}
        {isUpdating && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Remove Item"
        message={`Are you sure you want to remove "${item.product.productName}" from your cart?`}
        confirmText="Yes, Remove"
        cancelText="Cancel"
        type="danger"
        loading={isRemoving}
      />
    </>
  );
};

export default CartItem; 