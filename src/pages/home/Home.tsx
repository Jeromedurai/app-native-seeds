import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { generateRoutePath } from '../../services/mockData';
import { formatPrice } from '../../utils';

const Home: React.FC = () => {
  const { products, loading, menuItems } = useAppContext();
  
  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Carousel slides data - Fashion focused like the reference
  const slides = [
    {
      id: 1,
      title: "MID-SEASON",
      subtitle: "SALE",
      discount: "30%",
      off: "OFF",
      brand: "CHARLES & KEITH",
      description: "Discover the latest fashion trends",
      buttonText: "Shop Now",
      background: "from-gray-900 to-gray-800",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop&q=80"
    },
    {
      id: 2,
      title: "NEW COLLECTION",
      subtitle: "2024",
      description: "Elegant styles for every occasion",
      buttonText: "Explore Now",
      background: "from-purple-600 to-pink-600",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&h=600&fit=crop&q=80"
    },
    {
      id: 3,
      title: "SUMMER ESSENTIALS",
      subtitle: "TRENDING",
      description: "Light and comfortable fashion",
      buttonText: "Discover More",
      background: "from-blue-600 to-indigo-600",
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=600&fit=crop&q=80"
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Get featured products (first 4 products)
  const featuredProducts = products.slice(0, 4);

  // Get seed and plant menu items for category sections
  const seedMenu = menuItems.find(item => item.menuName.toLowerCase() === 'seed');
  const plantMenu = menuItems.find(item => item.menuName.toLowerCase() === 'plants');

  if (loading.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in {
            animation: fadeIn 1s ease-out forwards;
          }
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            line-height: 1.5;
            max-height: 3em; /* 2 lines * 1.5 line-height */
          }
          .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            line-height: 1.5;
            max-height: 4.5em; /* 3 lines * 1.5 line-height */
          }
          .featured-product-card {
            height: 100%;
            display: flex;
            flex-direction: column;
          }
          .featured-product-content {
            display: flex;
            flex-direction: column;
            flex: 1;
          }
          .featured-product-description {
            flex: 1;
            margin-bottom: 1.5rem;
          }
        `}
      </style>
      <div className="space-y-8">
        {/* Hero Carousel Section */}
        <section className="pt-4 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden rounded-2xl shadow-2xl">
        <div className="relative w-full h-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
                index === currentSlide ? 'translate-x-0' : 
                index < currentSlide ? '-translate-x-full' : 'translate-x-full'
              }`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                      <div className={`absolute inset-0 bg-gradient-to-r ${slide.background} opacity-75`}></div>
              </div>
              
              {/* Content */}
                    <div className="relative z-10 flex items-center justify-center h-full text-white px-6">
                      <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold mb-2 md:mb-3 animate-fade-in tracking-wide">
                    {slide.title}
                  </h1>
                        <p className="text-lg md:text-2xl lg:text-3xl mb-1 md:mb-2 max-w-2xl mx-auto animate-fade-in font-semibold">
                    {slide.subtitle}
                  </p>
                        {slide.discount && (
                          <div className="text-3xl md:text-5xl lg:text-7xl font-bold mb-2 animate-fade-in">
                            {slide.discount}
                          </div>
                        )}
                        {slide.off && (
                          <p className="text-lg md:text-2xl lg:text-3xl mb-2 animate-fade-in font-semibold">
                            {slide.off}
                          </p>
                        )}
                        {slide.brand && (
                          <p className="text-xs md:text-sm lg:text-base mb-4 max-w-xl mx-auto opacity-90 animate-fade-in tracking-widest">
                            {slide.brand}
                          </p>
                        )}
                        <p className="text-xs md:text-sm lg:text-base mb-4 max-w-xl mx-auto opacity-90 animate-fade-in">
                    {slide.description}
                  </p>
                        <div className="flex justify-center animate-fade-in">
                    <Link
                      to="/products"
                            className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
                    >
                      {slide.buttonText}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
                className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-1.5 md:p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
        >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={nextSlide}
                className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-1.5 md:p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
        >
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dot Indicators */}
              <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
                    className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
            />
          ))}
        </div>
            </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Products
          </h2>
          <p className="text-lg text-gray-600">
            Discover our premium selection of seeds and plants
          </p>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {featuredProducts.map((product) => {
              // Get main image or first available image
              const mainImage = product.images.find(img => img.main && img.active);
              const productImage = mainImage?.poster || product.images[0]?.poster || '/placeholder-image.jpg';
              
              return (
                <div
                  key={product.productId}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow featured-product-card"
                  style={{ minHeight: '520px' }}
                >
                  <div className="relative bg-gray-200 flex-shrink-0">
                    <img
                      src={productImage}
                      alt={product.productName}
                      className="w-full h-48 object-cover"
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
                  </div>
                  <div className="p-6 featured-product-content">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2" style={{ minHeight: '3em' }}>
                      {product.productName}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 featured-product-description" style={{ minHeight: '4.5em' }}>
                      {product.overview.length > 100 ? `${product.overview.substring(0, 100)}...` : product.overview}
                    </p>
                    <div className="mt-auto pt-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xl md:text-2xl font-bold text-green-600">
                        {formatPrice(product.price)}
                      </span>
                      <Link
                        to={`/product/${product.productId}`}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium whitespace-nowrap"
                      >
                        View Details
                      </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No featured products available at the moment.
            </p>
          </div>
        )}
      </section>

      {/* Product Categories */}
      <section className="bg-gray-50 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-lg text-gray-600">
              Find the perfect seeds and plants for your garden
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Seeds Category */}
            {seedMenu && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Premium Seeds</h3>
                  <p className="text-gray-600 mb-4">
                    High-quality seeds for vegetables, fruits, and herbs. Start your garden journey here.
                  </p>
                  <div className="space-y-2">
                    {seedMenu.category
                      ?.filter(cat => cat.active)
                      .slice(0, 4) // Show first 4 categories
                      .map(category => (
                        <Link 
                          key={category.categoryId}
                          to={generateRoutePath(seedMenu.menuName, category.category)} 
                          className="block text-green-600 hover:text-green-700 font-medium"
                        >
                          → {category.category}
                        </Link>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* Plants Category */}
            {plantMenu && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                  <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Healthy Plants</h3>
                  <p className="text-gray-600 mb-4">
                    Ready-to-plant healthy saplings and mature plants for your garden and home.
                  </p>
                  <div className="space-y-2">
                    {plantMenu.category
                      ?.filter(cat => cat.active)
                      .slice(0, 4) // Show first 4 categories
                      .map(category => (
                        <Link 
                          key={category.categoryId}
                          to={generateRoutePath(plantMenu.menuName, category.category)} 
                          className="block text-green-600 hover:text-green-700 font-medium"
                        >
                          → {category.category}
                        </Link>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Himalaya?
          </h2>
          <p className="text-lg text-gray-600">
            Your trusted partner for quality seeds and plants
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-600 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Premium Quality
            </h3>
            <p className="text-gray-600">
              We carefully select and test all our seeds and plants to ensure the highest quality and germination rates.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-600 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Fast Delivery
            </h3>
            <p className="text-gray-600">
              Quick and safe delivery of your seeds and plants with proper packaging to ensure freshness.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-600 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Expert Support
            </h3>
            <p className="text-gray-600">
              Our gardening experts are always ready to help you with planting tips and care instructions.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 text-white mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Garden?
            </h2>
            <p className="text-xl mb-8">
              Join thousands of happy gardeners who trust Himalaya for their seeds and plants.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={seedMenu ? generateRoutePath(seedMenu.menuName) : "/seed/all-seed"}
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                Browse Seeds
              </Link>
              <Link
                to={plantMenu ? generateRoutePath(plantMenu.menuName) : "/plants/all-plants"}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors inline-block"
              >
                Browse Plants
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default Home; 