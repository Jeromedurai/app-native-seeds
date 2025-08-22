import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { formatPrice } from '../../utils';
import { getRelatedProductsOnDemand } from '../../services/mockData';

interface RelatedProductsProps {
  currentProductId: number;
  categoryId?: number;
  className?: string;
  title?: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ 
  currentProductId, 
  categoryId, 
  className = '',
  title = 'Related Products'
}) => {
  const navigate = useNavigate();
  const { addToCart } = useAppContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch related products on-demand
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      setIsLoading(true);
      try {
        const products = await getRelatedProductsOnDemand(currentProductId, categoryId, 12);
        setRelatedProducts(products);
      } catch (error) {
        console.error('Failed to fetch related products:', error);
        setRelatedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProductId, categoryId]);

  const itemWidth = 280; // Width of each product card
  const gap = 16; // Gap between items
  const itemsPerView = 4; // Number of items visible at once

  // Check scroll buttons state
  const checkScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Scroll to specific index
  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const scrollLeft = index * (itemWidth + gap);
      carouselRef.current.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
      setCurrentIndex(index);
    }
  };

  // Scroll left
  const scrollLeft = () => {
    const newIndex = Math.max(0, currentIndex - 1);
    scrollToIndex(newIndex);
  };

  // Scroll right
  const scrollRight = () => {
    const maxIndex = Math.max(0, relatedProducts.length - itemsPerView);
    const newIndex = Math.min(maxIndex, currentIndex + 1);
    scrollToIndex(newIndex);
  };

  // Handle product click
  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  // Handle add to cart
  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  // Update scroll buttons on scroll
  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', checkScrollButtons);
      checkScrollButtons(); // Initial check
      
      return () => {
        carousel.removeEventListener('scroll', checkScrollButtons);
      };
    }
  }, []);

  // Update scroll buttons when products change
  useEffect(() => {
    setTimeout(checkScrollButtons, 100);
  }, [relatedProducts]);

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

  if (isLoading) {
    return (
      <div className={`${className} bg-white border border-gray-200 rounded-lg p-6`}>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">{title}</h3>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className={`${className} bg-white border border-gray-200 rounded-lg p-6`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
        
        {/* Navigation Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`p-2 rounded-full border transition-colors ${
              canScrollLeft
                ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                : 'border-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            aria-label="Previous products"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`p-2 rounded-full border transition-colors ${
              canScrollRight
                ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                : 'border-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            aria-label="Next products"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative">
                  <div
            ref={carouselRef}
            className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
          {relatedProducts.map((product) => (
            <div
              key={product.productId}
              className="flex-shrink-0 w-64 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => handleProductClick(product.productId)}
              style={{ width: itemWidth }}
            >
              {/* Product Image */}
              <div className="relative aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                <img
                  src={product.images[0]?.poster || '/placeholder-image.jpg'}
                  alt={product.productName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Badges */}
                <div className="absolute top-2 left-2 space-y-1">
                  {product.best_seller && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                      Best Seller
                    </span>
                  )}
                  {product.offer && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                      {product.offer} OFF
                    </span>
                  )}
                </div>

                {/* Quick Add Button */}
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition-colors shadow-lg"
                    aria-label={`Add ${product.productName} to cart`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 3H19M7 13v6a2 2 0 002 2h2a2 2 0 002-2v-6M7 13H5.4M13 13v6a2 2 0 002 2h2a2 2 0 002-2v-6" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-2">
                {/* Product Name */}
                <h4 className="font-semibold text-gray-900 line-clamp-2 text-sm">
                  {product.productName}
                </h4>

                {/* Rating */}
                <div className="flex items-center space-x-1">
                  {renderStars(product.rating)}
                  <span className="text-xs text-gray-500">
                    ({product.userBuyCount})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-green-600">
                    {formatPrice(product.price)}
                  </span>
                  {product.offer && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(product.price / (1 - parseInt(product.offer) / 100))}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded ${
                    product.in_stock 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.in_stock ? 'In Stock' : 'Out of Stock'}
                  </span>
                  
                  {product.quantity <= 5 && product.in_stock && (
                    <span className="text-xs text-orange-600">
                      Only {product.quantity} left
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress Indicators */}
        {relatedProducts.length > itemsPerView && (
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: Math.ceil(relatedProducts.length / itemsPerView) }, (_, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  Math.floor(currentIndex / itemsPerView) === i
                    ? 'bg-green-600'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to page ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mobile Touch Hint */}
      <div className="md:hidden text-center mt-2">
        <p className="text-xs text-gray-500">
          Swipe left or right to see more products
        </p>
      </div>
    </div>
  );
};

export default RelatedProducts; 