import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Product } from '../../types';
import { formatPrice } from '../../utils';
import { getProductsOnDemand, getProductsByCategoryOnDemand } from '../../services/mockData';
import SearchBar from '../../components/filter/SearchBar';
import FilterSidebar from '../../components/filter/FilterSidebar';
import SortingDropdown from '../../components/product/SortingDropdown';


interface ProductListingProps {
  categoryId?: number;
  categoryName?: string;
}

const ProductListing: React.FC<ProductListingProps> = ({ categoryId, categoryName }) => {
  const { addToCart, menuItems, user } = useAppContext();
  const { menuName, categorySlug } = useParams<{ menuName: string; categorySlug?: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Local state for products and loading
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Initialize state from URL parameters
  const getInitialSearchQuery = () => searchParams.get('q') || '';
  const getInitialFilters = () => {
    const urlFilters = searchParams.get('filters');
    if (urlFilters) {
      try {
        return JSON.parse(urlFilters);
      } catch (error) {
        console.error('Error parsing filters from URL:', error);
      }
    }
    return {
      priceRange: { min: 0, max: 1000 },
      categories: [] as number[],
      ratings: [] as number[],
      inStock: false,
      bestSeller: false,
      hasOffer: false,
    };
  };

  // Category and filters state
  const [currentCategoryId, setCurrentCategoryId] = useState<number | null>(categoryId || null);
  const [currentCategoryName, setCategoryName] = useState<string>(categoryName || '');
  const [searchQuery, setSearchQuery] = useState<string>(getInitialSearchQuery());
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sortBy') || 'default');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>((searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc');
  const [filters, setFilters] = useState(getInitialFilters());

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Track if this is the initial load
  const isInitialLoadRef = useRef(true);

  // Fetch products on-demand with current filters
  const fetchProducts = async (page: number = 1, append: boolean = false) => {
    // Show appropriate loading state
    if (page === 1 && isInitialLoadRef.current) {
      // Initial page load - show full loading
      setIsLoading(true);
      isInitialLoadRef.current = false;
    } else if (page === 1) {
      // Filter/search changes - show filter loading
      setIsFilterLoading(true);
    } else if (page > 1) {
      // Load more - show load more loading
      setIsLoadingMore(true);
    }
    setError(null);

    try {
      const filterParams = {
        search: searchQuery,
        priceRange: filters.priceRange,
        categories: filters.categories.length > 0 ? filters.categories : (currentCategoryId ? [currentCategoryId] : undefined),
        ratings: filters.ratings,
        inStock: filters.inStock,
        bestSeller: filters.bestSeller,
        hasOffer: filters.hasOffer,
        sortBy,
        sortOrder,
      };

      let result: {
        products: Product[];
        total: number;
        hasNext: boolean;
        page: number;
      };
      
      if (currentCategoryId && !filters.categories.length) {
        result = await getProductsByCategoryOnDemand(currentCategoryId, page, 12, filterParams);
      } else {
        result = await getProductsOnDemand(page, 12, filterParams);
      }

      if (append) {
        setProducts(prev => [...prev, ...result.products]);
      } else {
        setProducts(result.products);
      }
      
      setTotalProducts(result.total);
      setHasNext(result.hasNext);
      setCurrentPage(result.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setIsLoading(false);
      setIsFilterLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Find the menu item and category based on URL params
  useEffect(() => {
    if (menuName && menuItems.length > 0) {
      const menu = menuItems.find(item => 
        item.menuName.toLowerCase().replace(/\s+/g, '-') === menuName
      );
      
      if (menu && menu.category && categorySlug) {
        const category = menu.category.find(cat => 
          cat.category.toLowerCase().replace(/\s+/g, '-') === categorySlug
        );
        
        if (category) {
          setCurrentCategoryId(category.categoryId);
          setCategoryName(category.category);
        }
      } else if (menu && !categorySlug) {
        setCategoryName(menu.menuName);
        setCurrentCategoryId(null);
      }
    }
  }, [menuName, categorySlug, menuItems]);

  // Fetch products when filters change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchProducts(1, false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, filters, currentCategoryId, sortBy, sortOrder]);

  // Load more products
  const loadMoreProducts = () => {
    if (hasNext && !isLoadingMore) {
      fetchProducts(currentPage + 1, true);
    }
  };

  const handleAddToCart = (product: Product) => {
    // Check if user is authenticated
    if (!user) {
      // Save current location to return after login
      const currentLocation = window.location.pathname + window.location.search;
      const returnUrl = encodeURIComponent(currentLocation);
      
      // Redirect to login page with return URL
      navigate(`/login?returnUrl=${returnUrl}`);
      return;
    }
    
    // User is authenticated, proceed with adding to cart
    addToCart(product, 1);
  };

  const handleProductClick = (productId: number) => {
    // Preserve search state in URL when navigating to product detail
    const currentSearch = searchParams.toString();
    const returnUrl = currentSearch ? `?${currentSearch}` : '';
    navigate(`/product/${productId}?returnUrl=${encodeURIComponent(window.location.pathname + returnUrl)}`);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    
    // Clear all filters and categories when searching
    // This allows users to see all products matching the search term
    const defaultFilters = {
      priceRange: { min: 0, max: 1000 },
      categories: [],
      ratings: [],
      inStock: false,
      bestSeller: false,
      hasOffer: false,
    };
    setFilters(defaultFilters);
    
    // Also clear current category so search shows results from all categories
    setCurrentCategoryId(null);
    
    // Update the page title based on search query
    if (query.trim()) {
      setCategoryName(`Search results for "${query}"`);
    } else {
      setCategoryName('All Products');
    }

    // Persist search state to URL
    const newSearchParams = new URLSearchParams();
    if (query.trim()) {
      newSearchParams.set('q', query);
    }
    newSearchParams.set('filters', JSON.stringify(defaultFilters));
    newSearchParams.set('sortBy', sortBy);
    newSearchParams.set('sortOrder', sortOrder);
    setSearchParams(newSearchParams);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    
    // Persist filter state to URL
    const newSearchParams = new URLSearchParams();
    if (searchQuery.trim()) {
      newSearchParams.set('q', searchQuery);
    }
    newSearchParams.set('filters', JSON.stringify(newFilters));
    newSearchParams.set('sortBy', sortBy);
    newSearchParams.set('sortOrder', sortOrder);
    setSearchParams(newSearchParams);
  };

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(1);
    
    // Persist sort state to URL
    const newSearchParams = new URLSearchParams();
    if (searchQuery.trim()) {
      newSearchParams.set('q', searchQuery);
    }
    newSearchParams.set('filters', JSON.stringify(filters));
    newSearchParams.set('sortBy', newSortBy);
    newSearchParams.set('sortOrder', newSortOrder);
    setSearchParams(newSearchParams);
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

  const getMainImage = (product: Product) => {
    const mainImage = product.images.find(img => img.main && img.active);
    return mainImage ? mainImage.poster : product.images[0]?.poster || '/placeholder-image.jpg';
  };

  if (isLoading && currentPage === 1) {
    return (
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg border border-gray-200 flex flex-col justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg border border-red-200 text-center py-16">
          <div className="max-w-md mx-auto">
            <svg className="mx-auto h-16 w-16 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-red-600 mb-6">Error: {error}</p>
          <button
            onClick={() => fetchProducts(1, false)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
              Try Again
          </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Header */}
      <div className="mb-6">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
              {currentCategoryName || 'All Products'}
            </h1>
        </div>

        {/* Consolidated Controls Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
            {/* Left Side - Product Count */}
            <div className="flex items-center gap-3 lg:min-w-fit lg:flex-shrink-0">
              <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
              {products.length} {products.length === 1 ? 'product' : 'products'} found
              </span>
              {totalProducts > products.length && (
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  ({totalProducts} total)
                </span>
              )}
              {products.length > 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 whitespace-nowrap">
                  {Math.round((products.length / totalProducts) * 100)}% loaded
                </span>
              )}
          </div>

            {/* Center - Search Bar (Expanded) */}
            <div className="flex-1 lg:flex-grow lg:mx-4">
            <SearchBar onSearch={handleSearch} currentQuery={searchQuery} />
            </div>

            {/* Right Side - Sort Controls */}
            <div className="flex items-center gap-3 lg:min-w-fit lg:flex-shrink-0">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Sort by:
              </label>
              <div className="w-48">
                <SortingDropdown onSortChange={handleSortChange} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <FilterSidebar onFilterChange={handleFilterChange} currentFilters={filters} />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">

          {/* Products Grid */}
          <div className="relative">
            {/* Filter Loading Overlay */}
            {isFilterLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-lg">
                <div className="flex items-center space-x-3 bg-white px-6 py-4 rounded-lg shadow-lg border border-gray-200">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                  <span className="text-gray-700 font-medium">Updating products...</span>
                </div>
              </div>
            )}
            
            {products.length === 0 && !isFilterLoading ? (
              <div className="bg-white rounded-lg border border-gray-200 text-center py-16">
                <div className="max-w-md mx-auto">
                  <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4H9v1m4 0V4h1v1"/>
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria to find what you're looking for.</p>
                <button
                  onClick={() => navigate('/')}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Browse All Products
                </button>
                </div>
              </div>
            ) : (
              <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <div key={product.productId} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    {/* Product Image */}
                    <div className="relative">
                      <img
                        src={getMainImage(product)}
                        alt={product.productName}
                        className="w-full h-48 object-cover cursor-pointer"
                        onClick={() => handleProductClick(product.productId)}
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.best_seller && (
                          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            Best Seller
                          </span>
                        )}
                        {product.offer && (
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                            {product.offer} OFF
                          </span>
                        )}
                      </div>

                      {/* Stock Status */}
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          product.in_stock 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.in_stock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-4">
                      <h3 
                        className="text-lg font-semibold text-gray-900 mb-2 cursor-pointer hover:text-green-600 transition-colors"
                        onClick={() => handleProductClick(product.productId)}
                      >
                        {product.productName}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.overview}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center mb-3">
                        <div className="flex items-center mr-2">
                          {renderStars(product.rating)}
                        </div>
                        <span className="text-sm text-gray-500">
                          ({product.userBuyCount} reviews)
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-green-600">
                            {formatPrice(product.price)}
                          </span>
                          {product.offer && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(product.price / (1 - parseInt(product.offer) / 100))}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="text-xs text-gray-500 mb-3">
                        <div>Code: {product.productCode}</div>
                        <div>Pack: {product.packQuantity} units</div>
                        <div>Delivery: {product.deleveryDate} days</div>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={!product.in_stock}
                        className={`w-full py-2 px-4 rounded font-semibold transition-colors ${
                          !product.in_stock
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : !user
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                        title={!user && product.in_stock ? 'Login required to add to cart' : ''}
                      >
                        {!product.in_stock 
                          ? 'Out of Stock' 
                          : !user 
                            ? 'Login to Add to Cart' 
                            : 'Add to Cart'
                        }
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {hasNext && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={loadMoreProducts}
                    disabled={isLoadingMore}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {isLoadingMore ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Loading...
                      </div>
                    ) : (
                      'Load More Products'
                    )}
                  </button>
                </div>
              )}

              {/* End of Products Message */}
              {!hasNext && products.length > 0 && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center gap-2 text-gray-500 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  You've reached the end of the product list
                  </div>
                </div>
              )}
            </>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListing; 