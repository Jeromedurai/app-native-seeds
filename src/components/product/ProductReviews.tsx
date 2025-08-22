import React, { useState, useMemo } from 'react';
import { ProductReview, ReviewStats } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { formatDate } from '../../utils';


interface ProductReviewsProps {
  productId: number;
  reviews: ProductReview[];
  reviewStats: ReviewStats;
  className?: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ 
  productId, 
  reviews, 
  reviewStats, 
  className = '' 
}) => {
  const { user } = useAppContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'>('newest');
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 0,
    title: '',
    comment: '',
  });

  const reviewsPerPage = 5;

  // Filter and sort reviews
  const filteredAndSortedReviews = useMemo(() => {
    let filtered = reviews;
    
    // Filter by rating
    if (filterRating !== null) {
      filtered = filtered.filter(review => review.rating === filterRating);
    }
    
    // Sort reviews
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'helpful':
          return b.helpful - a.helpful;
        default:
          return 0;
      }
    });
    
    return sorted;
  }, [reviews, filterRating, sortBy]);

  // Paginate reviews
  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * reviewsPerPage;
    return filteredAndSortedReviews.slice(startIndex, startIndex + reviewsPerPage);
  }, [filteredAndSortedReviews, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedReviews.length / reviewsPerPage);

  // Render stars
  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClass = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-base';
    
    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }, (_, index) => (
          <span
            key={index}
            className={`${sizeClass} ${
              index < rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  // Render interactive stars for new review
  const renderInteractiveStars = (rating: number, onRatingChange: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: 5 }, (_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => onRatingChange(index + 1)}
            className={`text-2xl transition-colors ${
              index < rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
            }`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  // Handle review submission
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Please login to write a review');
      return;
    }
    
    if (newReview.rating === 0 || !newReview.title.trim() || !newReview.comment.trim()) {
      alert('Please fill in all fields');
      return;
    }

    // Here you would typically submit to your API
    console.log('Submitting review:', {
      productId,
      userId: user.id,
      ...newReview,
    });

    // Reset form
    setNewReview({ rating: 0, title: '', comment: '' });
    setIsWritingReview(false);
    
    // You might want to refresh the reviews here
    alert('Review submitted successfully!');
  };

  // Handle helpful vote
  const handleHelpfulVote = async (reviewId: number) => {
    // Here you would typically call your API
    console.log('Voting helpful for review:', reviewId);
  };

  return (
    <div className={`${className} space-y-6`}>
      {/* Review Statistics */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Customer Reviews</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overall Rating */}
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600">
                {reviewStats.averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(reviewStats.averageRating), 'lg')}
              </div>
              <div className="text-sm text-gray-500">
                Based on {reviewStats.totalReviews} reviews
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviewStats.ratingDistribution[rating] || 0;
              const percentage = reviewStats.totalReviews > 0 
                ? (count / reviewStats.totalReviews) * 100 
                : 0;
              
              return (
                <div key={rating} className="flex items-center space-x-2">
                  <button
                    onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                    className={`flex items-center space-x-1 text-sm hover:text-green-600 transition-colors ${
                      filterRating === rating ? 'text-green-600 font-medium' : 'text-gray-600'
                    }`}
                  >
                    <span>{rating}</span>
                    <span className="text-yellow-400">★</span>
                  </button>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-8">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Write Review Button */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
          
          {filterRating && (
            <button
              onClick={() => setFilterRating(null)}
              className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
            >
              Clear Filter
            </button>
          )}
        </div>
        
        <button
          onClick={() => setIsWritingReview(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Write Review
        </button>
      </div>

      {/* Write Review Form */}
      {isWritingReview && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h4>
          
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              {renderInteractiveStars(newReview.rating, (rating) => 
                setNewReview(prev => ({ ...prev, rating }))
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Title
              </label>
              <input
                type="text"
                value={newReview.title}
                onChange={(e) => setNewReview(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Summarize your experience"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Tell others about your experience with this product"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsWritingReview(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Submit Review
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {paginatedReviews.length > 0 ? (
          paginatedReviews.map((review) => (
            <div key={review.reviewId} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold">
                      {review.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{review.userName}</span>
                      {review.verified && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      {renderStars(review.rating, 'sm')}
                      <span className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
              <p className="text-gray-700 mb-4">{review.comment}</p>
              
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleHelpfulVote(review.reviewId)}
                  className="flex items-center space-x-1 text-sm text-gray-500 hover:text-green-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  <span>Helpful ({review.helpful})</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            {filterRating ? 
              `No reviews with ${filterRating} stars found.` : 
              'No reviews yet. Be the first to review this product!'
            }
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 border rounded-lg text-sm ${
                page === currentPage
                  ? 'bg-green-600 text-white border-green-600'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductReviews; 