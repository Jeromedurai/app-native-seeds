import React, { useState, useRef, useEffect } from 'react';

export interface SortOption {
  value: string;
  label: string;
  order: 'asc' | 'desc';
}

interface SortingDropdownProps {
  onSortChange: (sortBy: string, order: 'asc' | 'desc') => void;
  className?: string;
  currentSort?: string;
}

const SortingDropdown: React.FC<SortingDropdownProps> = ({ 
  onSortChange, 
  className = '',
  currentSort = 'default'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState(currentSort);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sortOptions: SortOption[] = [
    { value: 'default', label: 'Default', order: 'asc' },
    { value: 'name-asc', label: 'Name: A to Z', order: 'asc' },
    { value: 'name-desc', label: 'Name: Z to A', order: 'desc' },
    { value: 'price-asc', label: 'Price: Low to High', order: 'asc' },
    { value: 'price-desc', label: 'Price: High to Low', order: 'desc' },
    { value: 'rating-desc', label: 'Rating: High to Low', order: 'desc' },
    { value: 'rating-asc', label: 'Rating: Low to High', order: 'asc' },
    { value: 'popularity-desc', label: 'Most Popular', order: 'desc' },
    { value: 'newest', label: 'Newest First', order: 'desc' },
    { value: 'best-seller', label: 'Best Sellers', order: 'desc' },
  ];

  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === selectedSort);
    return option ? option.label : 'Default';
  };

  const handleSortSelect = (option: SortOption) => {
    setSelectedSort(option.value);
    setIsOpen(false);
    
    // Extract sort field from option value
    let sortBy = 'default';
    if (option.value !== 'default') {
      if (option.value.includes('name')) {
        sortBy = 'productName';
      } else if (option.value.includes('price')) {
        sortBy = 'price';
      } else if (option.value.includes('rating')) {
        sortBy = 'rating';
      } else if (option.value.includes('popularity')) {
        sortBy = 'userBuyCount';
      } else if (option.value === 'newest') {
        sortBy = 'created';
      } else if (option.value === 'best-seller') {
        sortBy = 'best_seller';
      }
    }
    
    onSortChange(sortBy, option.order);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="flex items-center justify-between w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 min-w-0"
      >
        <span className="flex items-center min-w-0 flex-1">
          <svg className="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7zm0 0V5a2 2 0 012-2h6l2 2h6a2 2 0 012 2v2M7 13h10M7 17h4" />
          </svg>
          <span className="truncate">Sort by: {getCurrentSortLabel()}</span>
        </span>
        <svg
          className={`w-4 h-4 ml-2 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto left-0">
          <div className="py-1">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortSelect(option)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100 ${
                  selectedSort === option.value
                    ? 'bg-green-50 text-green-700 font-medium'
                    : 'text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option.label}</span>
                  {selectedSort === option.value && (
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortingDropdown; 