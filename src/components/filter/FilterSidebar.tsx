import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';

interface FilterOptions {
  priceRange: {
    min: number;
    max: number;
  };
  categories: number[];
  ratings: number[];
  inStock: boolean;
  bestSeller: boolean;
  hasOffer: boolean;
}

interface FilterSidebarProps {
  onFilterChange: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
  className?: string;
}

// Add a type for the price range that can handle both string and number values
interface PriceRange {
  min: string | number;
  max: string | number;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
  onFilterChange, 
  currentFilters,
  className = '' 
}) => {
  const { menuItems } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  
  // Local state for price range inputs to prevent constant API calls
  const [localPriceRange, setLocalPriceRange] = useState<PriceRange>(currentFilters.priceRange);
  const priceDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Default price range (can be made configurable)
  const defaultPriceRange = { min: 0, max: 1000 };

  // Update local price range when currentFilters changes
  useEffect(() => {
    setLocalPriceRange(currentFilters.priceRange);
  }, [currentFilters.priceRange]);

  // Debounced price range update
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (priceDebounceRef.current) {
      clearTimeout(priceDebounceRef.current);
    }
    
    priceDebounceRef.current = setTimeout(() => {
      // Only update if the local price range is different from current filters
      if (localPriceRange.min !== currentFilters.priceRange.min || 
          localPriceRange.max !== currentFilters.priceRange.max) {
        handleFilterChange('priceRange', localPriceRange);
      }
    }, 800); // 800ms debounce

    return () => {
      if (priceDebounceRef.current) {
        clearTimeout(priceDebounceRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localPriceRange, currentFilters.priceRange]);

  // Get available categories from menu items
  const availableCategories = React.useMemo(() => {
    const categoryMap = new Map<number, string>();
    
    menuItems.forEach(item => {
      if (item.category) {
        item.category.forEach(cat => {
          if (cat.active) {
            categoryMap.set(cat.categoryId, cat.category);
          }
        });
      }
    });
    
    return Array.from(categoryMap.entries()).map(([id, name]) => ({
      id,
      name,
    }));
  }, [menuItems]);

  // Predefined rating options
  const ratingOptions = [
    { rating: 5, label: '5 Stars & up' },
    { rating: 4, label: '4 Stars & up' },
    { rating: 3, label: '3 Stars & up' },
    { rating: 2, label: '2 Stars & up' },
    { rating: 1, label: '1 Star & up' },
  ];

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    if (key === 'priceRange') {
      // Ensure price range values are numbers when sending to parent
      const priceRange = {
        min: typeof value.min === 'string' ? Number(value.min) || defaultPriceRange.min : value.min,
        max: typeof value.max === 'string' ? Number(value.max) || defaultPriceRange.max : value.max
      };
      const newFilters = { ...currentFilters, [key]: priceRange };
      onFilterChange(newFilters);
    } else {
      const newFilters = { ...currentFilters, [key]: value };
      onFilterChange(newFilters);
    }
  };

  // Handle price range change (local state only, debounced update)
  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    // If the input is empty, use an empty string to allow user to type
    // If it's a number, use that number, otherwise keep the previous value
    const numValue = value === '' ? value : parseInt(value);
    setLocalPriceRange(prev => ({ 
      ...prev, 
      [type]: numValue === '' ? '' : (isNaN(numValue) ? prev[type] : numValue)
    }));
  };

  // Handle price range blur - immediate update on focus out
  const handlePriceBlur = () => {
    if (priceDebounceRef.current) {
      clearTimeout(priceDebounceRef.current);
    }
    
    // On blur, convert any empty strings to default values
    const finalPriceRange = {
      min: localPriceRange.min === '' ? defaultPriceRange.min : Number(localPriceRange.min),
      max: localPriceRange.max === '' ? defaultPriceRange.max : Number(localPriceRange.max)
    };

    // Only update if the values have actually changed
    if (finalPriceRange.min !== currentFilters.priceRange.min || 
        finalPriceRange.max !== currentFilters.priceRange.max) {
      handleFilterChange('priceRange', finalPriceRange);
    }
  };

  // Handle category toggle
  const handleCategoryToggle = (categoryId: number) => {
    const newCategories = currentFilters.categories.includes(categoryId)
      ? currentFilters.categories.filter((id: number) => id !== categoryId)
      : [...currentFilters.categories, categoryId];
    handleFilterChange('categories', newCategories);
  };

  // Handle rating toggle
  const handleRatingToggle = (rating: number) => {
    const newRatings = currentFilters.ratings.includes(rating)
      ? currentFilters.ratings.filter((r: number) => r !== rating)
      : [...currentFilters.ratings, rating];
    handleFilterChange('ratings', newRatings);
  };

  // Clear all filters
  const clearFilters = () => {
    const defaultFilters: FilterOptions = {
      priceRange: { min: defaultPriceRange.min, max: defaultPriceRange.max },
      categories: [],
      ratings: [],
      inStock: false,
      bestSeller: false,
      hasOffer: false,
    };
    setLocalPriceRange(defaultFilters.priceRange);
    onFilterChange(defaultFilters);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-sm ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <span>Filters</span>
          <svg
            className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Filter Sidebar */}
      <div className={`${className} ${isOpen ? 'block' : 'hidden'} lg:block`}>
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
          {/* Filter Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-green-600 hover:text-green-700 font-medium"
            >
              Clear All
            </button>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">Price Range</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  value={localPriceRange.min}
                  onChange={(e) => handlePriceChange('min', e.target.value)}
                  onBlur={handlePriceBlur}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  min="0"
                  placeholder="Min"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  value={localPriceRange.max}
                  onChange={(e) => handlePriceChange('max', e.target.value)}
                  onBlur={handlePriceBlur}
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  min="0"
                  placeholder="Max"
                />
              </div>
              <div className="text-xs text-gray-500">
                Default range: ₹{defaultPriceRange.min} - ₹{defaultPriceRange.max}
              </div>
            </div>
          </div>

          {/* Category Filter */}
          {availableCategories.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900">Categories</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {availableCategories.map(category => (
                  <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentFilters.categories.includes(category.id)}
                      onChange={() => handleCategoryToggle(category.id)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700 flex-1">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Rating Filter */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">Rating</h4>
            <div className="space-y-2">
              {ratingOptions.map(({ rating, label }) => (
                <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentFilters.ratings.includes(rating)}
                    onChange={() => handleRatingToggle(rating)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <div className="flex items-center space-x-1">
                    {renderStars(rating)}
                    <span className="text-sm text-gray-700">{label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Stock & Special Offers */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">Availability</h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentFilters.inStock}
                  onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">In Stock Only</span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentFilters.bestSeller}
                  onChange={(e) => handleFilterChange('bestSeller', e.target.checked)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Best Sellers</span>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={currentFilters.hasOffer}
                  onChange={(e) => handleFilterChange('hasOffer', e.target.checked)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">On Sale</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar; 