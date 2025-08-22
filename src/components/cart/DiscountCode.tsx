import React, { useState } from 'react';
import { DiscountCode as DiscountCodeType } from '../../types';

interface DiscountCodeProps {
  onApplyDiscount: (code: string) => Promise<DiscountCodeType | null>;
  appliedDiscount?: DiscountCodeType | null;
  onRemoveDiscount: () => void;
  disabled?: boolean;
}

const DiscountCode: React.FC<DiscountCodeProps> = ({
  onApplyDiscount,
  appliedDiscount,
  onRemoveDiscount,
  disabled = false
}) => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || isLoading || disabled) return;

    setIsLoading(true);
    setError(null);

    try {
      const discount = await onApplyDiscount(code.trim().toUpperCase());
      if (discount) {
        setCode('');
        setIsExpanded(false);
      } else {
        setError('Invalid or expired discount code');
      }
    } catch (err) {
      setError('Failed to apply discount code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = () => {
    onRemoveDiscount();
    setError(null);
  };

  const handleInputChange = (value: string) => {
    setCode(value);
    if (error) setError(null);
  };

  // If discount is applied, show the applied state
  if (appliedDiscount) {
    return (
      <div className="border border-green-200 bg-green-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">
                Discount Applied: {appliedDiscount.code}
              </p>
              <p className="text-xs text-green-600">
                {appliedDiscount.type === 'percentage' 
                  ? `${appliedDiscount.value}% off`
                  : `$${appliedDiscount.value} off`
                }
              </p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            disabled={disabled}
            className="text-green-600 hover:text-green-800 transition-colors disabled:opacity-50 p-1"
            aria-label="Remove discount"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        disabled={disabled}
        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span className="text-sm font-medium text-gray-700">
            Have a discount code?
          </span>
        </div>
        <svg 
          className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Discount Input Form */}
      <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-4 border-t border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder="Enter discount code"
                    disabled={isLoading || disabled}
                    className={`
                      w-full px-3 py-2 border rounded-md text-sm transition-colors
                      ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-green-500 focus:ring-green-500'}
                      disabled:opacity-50 disabled:cursor-not-allowed
                      focus:outline-none focus:ring-1
                    `}
                    maxLength={20}
                  />
                  {isLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={!code.trim() || isLoading || disabled}
                  className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                >
                  Apply
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-1 mt-2">
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              )}
            </div>

            {/* Sample Codes for Demo */}
            <div className="text-xs text-gray-500">
              <p className="mb-1">Try these sample codes:</p>
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleInputChange('SAVE10')}
                  disabled={isLoading || disabled}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition-colors disabled:opacity-50"
                >
                  SAVE10
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('WELCOME5')}
                  disabled={isLoading || disabled}
                  className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 transition-colors disabled:opacity-50"
                >
                  WELCOME5
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DiscountCode; 