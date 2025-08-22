import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { Product, ProductReview, ReviewStats } from '../../types';
import { formatPrice } from '../../utils';
import { getProductByIdOnDemand, getReviewsByProductId, getReviewStatsByProductId } from '../../services/mockData';
import ProductImageGallery from '../../components/product/ProductImageGallery';
import ProductReviews from '../../components/product/ProductReviews';
import RelatedProducts from '../../components/product/RelatedProducts';


const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToCart, updateCartQuantity, cart, loading, user } = useAppContext();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  // const [selectedImage, setSelectedImage] = useState<string>(''); // Reserved for future use
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats>({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });
  const [quantityChanged, setQuantityChanged] = useState(false);

  // Find current cart item for this product
  const cartItem = cart.find(item => item.product.productId === product?.productId);
  const currentCartQuantity = cartItem?.quantity || 0;

  // Use cart quantity if product is in cart, otherwise use local quantity state
  const displayQuantity = cartItem ? currentCartQuantity : quantity;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const productData = await getProductByIdOnDemand(parseInt(productId));
        if (productData) {
          setProduct(productData);
          
          // Set the first main image as selected - Reserved for future use
          // const mainImage = productData.images.find((img: any) => img.main && img.active);
          // setSelectedImage(mainImage?.poster || productData.images[0]?.poster || '');
          
          // Load reviews data
          const productReviews = getReviewsByProductId(productData.productId);
          const productReviewStats = getReviewStatsByProductId(productData.productId);
          setReviews(productReviews);
          setReviewStats(productReviewStats);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // Reset quantity change visual feedback
  useEffect(() => {
    if (quantityChanged) {
      const timer = setTimeout(() => {
        setQuantityChanged(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [quantityChanged]);

  const handleAddToCart = () => {
    if (!product) return;
    
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
      addToCart(product, quantity);
      // Show success message or redirect
  };

  const handleQuantityChange = async (newQuantity: number) => {
    if (!product) {
      return;
    }
    
    // If trying to update cart quantity but user is not authenticated, redirect to login
    if (cartItem && !user) {
      const currentLocation = window.location.pathname + window.location.search;
      const returnUrl = encodeURIComponent(currentLocation);
      navigate(`/login?returnUrl=${returnUrl}`);
      return;
    }
    
    if (newQuantity >= 0 && newQuantity <= product.quantity) {
      if (cartItem) {
        // Product is already in cart, update cart quantity directly
        await updateCartQuantity(product.productId.toString(), newQuantity);
      } else {
        // Product not in cart, update local quantity for adding later
        if (newQuantity >= 1) {
      setQuantity(newQuantity);
        }
      }
      setQuantityChanged(true);
    }
  };

  const handleQuantityIncrease = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (cartItem) {
      // Increase cart quantity
      await handleQuantityChange(currentCartQuantity + 1);
    } else {
      // Increase local quantity
    handleQuantityChange(quantity + 1);
    }
  };

  const handleQuantityDecrease = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (cartItem) {
      // Decrease cart quantity
      await handleQuantityChange(currentCartQuantity - 1);
    } else {
      // Decrease local quantity
    handleQuantityChange(quantity - 1);
    }
  };

  const handleBackNavigation = () => {
    const returnUrl = searchParams.get('returnUrl');
    if (returnUrl) {
      navigate(decodeURIComponent(returnUrl));
    } else {
      navigate(-1);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-lg ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-600 mb-4">Error: {error || 'Product not found'}</div>
          <button
            onClick={handleBackNavigation}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-600">
        <button onClick={() => navigate('/')} className="hover:text-green-600">
          Home
        </button>
        <span className="mx-2">›</span>
        <button onClick={handleBackNavigation} className="hover:text-green-600">
          Products
        </button>
        <span className="mx-2">›</span>
        <span className="text-gray-900">{product.productName}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <ProductImageGallery
            images={product.images}
            productName={product.productName}
          />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Product Title and Code */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.productName}
            </h1>
            <p className="text-gray-600">Product Code: {product.productCode}</p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            {product.best_seller && (
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Best Seller
              </span>
            )}
            {product.offer && (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {product.offer} OFF
              </span>
            )}
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              product.in_stock 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {product.in_stock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {renderStars(product.rating)}
            </div>
            <span className="text-gray-600">
              ({product.userBuyCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-bold text-green-600">
              {formatPrice(product.price)}
            </span>
            {product.offer && (
              <span className="text-xl text-gray-500 line-through">
                {formatPrice(product.price / (1 - parseInt(product.offer) / 100))}
              </span>
            )}
          </div>

          {/* Product Overview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Overview</h3>
            <p className="text-gray-600">{product.overview}</p>
          </div>

          {/* Product Information */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <span className="text-sm text-gray-500">Pack Quantity:</span>
              <div className="font-semibold">{product.packQuantity} units</div>
            </div>
            <div>
              <span className="text-sm text-gray-500">Delivery:</span>
              <div className="font-semibold">{product.deleveryDate} days</div>
            </div>
            <div>
              <span className="text-sm text-gray-500">Available:</span>
              <div className="font-semibold">{product.quantity} units</div>
            </div>
            <div>
              <span className="text-sm text-gray-500">Return Policy:</span>
              <div className="font-semibold">{product.return} days</div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">
              Quantity:
            </label>
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <button
                type="button"
                onClick={handleQuantityDecrease}
                disabled={cartItem ? displayQuantity <= 0 : displayQuantity <= 1}
                className="px-4 py-2 border-r border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors duration-200 bg-white text-gray-700 font-medium"
              >
                −
              </button>
              <span className={`px-4 py-2 min-w-[60px] text-center bg-white font-medium transition-all duration-300 ${quantityChanged ? 'bg-green-100 text-green-700' : ''}`}>
                {displayQuantity}
              </span>
              <button
                type="button"
                onClick={handleQuantityIncrease}
                disabled={displayQuantity >= product.quantity}
                className="px-4 py-2 border-l border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition-colors duration-200 bg-white text-gray-700 font-medium"
              >
                +
              </button>
            </div>
            <span className="text-sm text-gray-500">
              {cartItem 
                ? `(${displayQuantity} in cart, ${product.quantity} available)` 
                : !user 
                  ? `(${product.quantity} available - Login to add to cart)`
                  : `(${product.quantity} available)`
              }
            </span>
          </div>

          {/* Authentication Notice */}
          {!user && !cartItem && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-blue-800">
                <span className="font-medium">Login required</span> to add items to cart and manage quantities.
              </p>
            </div>
          )}

          {/* Add to Cart Button */}
          {cartItem ? (
            <div className="w-full py-3 px-6 rounded-lg font-semibold bg-green-100 text-green-700 border border-green-300 text-center">
              ✓ In Cart ({currentCartQuantity} {currentCartQuantity === 1 ? 'item' : 'items'})
            </div>
          ) : (
          <button
            onClick={handleAddToCart}
            disabled={!product.in_stock || loading.isLoading}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                !product.in_stock || loading.isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : !user
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
              }`}
              title={!user && product.in_stock ? 'Login required to add to cart' : ''}
          >
              {loading.isLoading 
                ? 'Adding...' 
                : !product.in_stock 
                  ? 'Out of Stock' 
                  : !user 
                    ? 'Login to Add to Cart' 
                    : 'Add to Cart'
              }
          </button>
          )}
        </div>
      </div>

      {/* Product Description */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
        <div className="prose max-w-none">
          <p className="text-gray-600 leading-relaxed">
            {product.long_description}
          </p>
        </div>
      </div>

      {/* Specifications */}
      {product.specification && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Specifications</h2>
          <div className="prose max-w-none">
            <p className="text-gray-600 leading-relaxed">
              {product.specification}
            </p>
          </div>
        </div>
      )}

      {/* Product Story */}
      {product.story && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Story</h2>
          <div className="prose max-w-none">
            <p className="text-gray-600 leading-relaxed">
              {product.story}
            </p>
          </div>
        </div>
      )}

      {/* Product Reviews */}
      <div className="mt-12">
        <ProductReviews
          productId={product.productId}
          reviews={reviews}
          reviewStats={reviewStats}
        />
      </div>

      {/* Related Products */}
      <div className="mt-12">
        <RelatedProducts
          currentProductId={product.productId}
          categoryId={product.categrory}
        />
      </div>
    </div>
  );
};

export default ProductDetail; 