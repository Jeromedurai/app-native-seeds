import React, { useState, useEffect } from 'react';
import { ChevronDown, Package, Search, X } from 'lucide-react';
import { Product } from '../../types';

interface ProductDropdownProps {
  value?: Product | null;
  onChange: (product: Product | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  allowClear?: boolean;
  products?: Product[];
  onRefresh?: () => void;
}

const ProductDropdown: React.FC<ProductDropdownProps> = ({
  value,
  onChange,
  placeholder = "Select a product...",
  disabled = false,
  className = "",
  allowClear = true,
  products = [],
  onRefresh
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredProducts = products.filter(product =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.productCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (product: Product) => {
    onChange(product);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  const handleRefresh = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRefresh) {
      setLoading(true);
      await onRefresh();
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.product-dropdown')) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative product-dropdown ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg
          focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          hover:border-gray-400 transition-colors
          flex items-center justify-between
        `}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Package className="w-5 h-5 text-gray-400 flex-shrink-0" />
          {value ? (
            <div className="min-w-0 flex-1">
              <div className="font-medium text-gray-900 truncate">
                {value.productName}
              </div>
              <div className="text-sm text-gray-500 truncate">
                {value.productCode} • ${value.price}
              </div>
            </div>
          ) : (
            <span className="text-gray-500 truncate">{placeholder}</span>
          )}
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          {value && allowClear && (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <ChevronDown 
            className={`w-5 h-5 text-gray-400 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </div>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-hidden">
          {/* Search Header */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>
            
            {onRefresh && (
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={loading}
                  className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50 flex items-center gap-1"
                >
                  <div className={`w-3 h-3 border border-current border-t-transparent rounded-full ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            )}
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <button
                  key={product.productId}
                  type="button"
                  onClick={() => handleSelect(product)}
                  className={`
                    w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50
                    border-b border-gray-100 last:border-b-0 transition-colors
                    ${value?.productId === product.productId ? 'bg-blue-50' : ''}
                  `}
                >
                  <div className="flex items-center gap-3">
                    {/* Product Image or Icon */}
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0].poster}
                          alt={product.productName}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="w-5 h-5 text-gray-400" />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {product.productName}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {product.productCode} • ${product.price}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Stock: {product.quantity} • 
                        {product.in_stock ? (
                          <span className="text-green-600 ml-1">In Stock</span>
                        ) : (
                          <span className="text-red-600 ml-1">Out of Stock</span>
                        )}
                      </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      {product.active && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Active
                        </span>
                      )}
                      {product.best_seller && (
                        <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                          Best Seller
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                {searchQuery ? (
                  <div>
                    <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p>No products found matching "{searchQuery}"</p>
                  </div>
                ) : (
                  <div>
                    <Package className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p>No products available</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDropdown;