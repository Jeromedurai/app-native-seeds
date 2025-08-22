import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ProductImage } from '../../types';



interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
  className?: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ 
  images, 
  productName, 
  className = '' 
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingStates, setLoadingStates] = useState<{ [key: number]: boolean }>({});
  const [errorStates, setErrorStates] = useState<{ [key: number]: boolean }>({});

  // Memoize filtered and sorted images to prevent unnecessary re-renders
  const activeImages = useMemo(() => {
    return images
    .filter(img => img.active)
    .sort((a, b) => a.orderBy - b.orderBy);
  }, [images]);

  const currentImage = activeImages[selectedImageIndex];

  // Fallback image for when external images fail
  const fallbackImage = useMemo(() => {
    // Ultra-fast loading minimal SVG
    const simpleImage = `data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='400' height='400' fill='%2322c55e'/%3E%3Ctext x='200' y='200' text-anchor='middle' fill='white' font-size='60'%3E🌱%3C/text%3E%3C/svg%3E`;
    return simpleImage;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productName]);

  // Handle image loading - use useCallback to prevent re-renders
  const handleImageLoad = useCallback((index: number) => {
    setLoadingStates(prev => ({ ...prev, [index]: false }));
    setErrorStates(prev => ({ ...prev, [index]: false }));
  }, []);

  const handleImageError = useCallback((index: number) => {
    setLoadingStates(prev => ({ ...prev, [index]: false }));
    setErrorStates(prev => ({ ...prev, [index]: true }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeImages]);

  // Initialize loading states only when activeImages changes
  useEffect(() => {
    if (activeImages.length > 0) {
      const initialLoadingStates: { [key: number]: boolean } = {};
      const initialErrorStates: { [key: number]: boolean } = {};
      activeImages.forEach((_, index) => {
        initialLoadingStates[index] = true;
        initialErrorStates[index] = false;
      });
      setLoadingStates(initialLoadingStates);
      setErrorStates(initialErrorStates);
      
      // Reset selected index if it's out of bounds
      if (selectedImageIndex >= activeImages.length) {
        setSelectedImageIndex(0);
      }

      // Add loading timeout - if image doesn't load in 3 seconds, mark as error
      const timeouts = activeImages.map((_, index) => {
        return setTimeout(() => {
          setLoadingStates(prev => {
            if (prev[index]) { // Still loading
              setErrorStates(prevErrors => ({ ...prevErrors, [index]: true }));
              return { ...prev, [index]: false };
            }
            return prev;
          });
        }, 2000); // 2 second timeout for faster fallback
      });

      // Cleanup timeouts on unmount or when dependencies change
      return () => {
        timeouts.forEach(timeout => clearTimeout(timeout));
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeImages.length]); // Only depend on length to prevent infinite loops

  // Handle thumbnail click
  const handleThumbnailClick = useCallback((index: number) => {
    setSelectedImageIndex(index);
  }, []);

  // Navigate to previous image
  const goToPrevious = useCallback(() => {
    setSelectedImageIndex(prev => 
      prev > 0 ? prev - 1 : activeImages.length - 1
    );
  }, [activeImages.length]);

  // Navigate to next image
  const goToNext = useCallback(() => {
    setSelectedImageIndex(prev => 
      prev < activeImages.length - 1 ? prev + 1 : 0
    );
  }, [activeImages.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isModalOpen) {
        if (e.key === 'ArrowLeft') goToPrevious();
        if (e.key === 'ArrowRight') goToNext();
        if (e.key === 'Escape') setIsModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, goToPrevious, goToNext]);

  // Helper function to get image source with fallback
  const getImageSrc = useCallback((image: ProductImage, index: number) => {
    if (errorStates[index]) {
      return fallbackImage;
    }
    return image.poster;
  }, [errorStates, fallbackImage]);

  if (!activeImages.length) {
    return (
      <div className={`${className} aspect-square bg-gray-100 rounded-lg flex items-center justify-center`}>
        <div className="text-center text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p>No images available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} space-y-4`}>
      {/* Main Image Slider */}
      <div className="relative">
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
          {/* Loading indicator */}
          {loadingStates[selectedImageIndex] && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Loading image...</p>
              </div>
            </div>
          )}
          
          {/* Main Image */}
          <img
            src={getImageSrc(currentImage, selectedImageIndex)}
            alt={`${productName} ${selectedImageIndex + 1}`}
            className="w-full h-full object-cover cursor-pointer transition-opacity duration-300"
            onClick={() => setIsModalOpen(true)}
            onLoad={() => handleImageLoad(selectedImageIndex)}
            onError={() => handleImageError(selectedImageIndex)}
            style={{
              opacity: loadingStates[selectedImageIndex] ? 0 : 1
            }}
          />

          {/* Error state indicator */}
          {errorStates[selectedImageIndex] && !loadingStates[selectedImageIndex] && (
            <div className="absolute top-2 left-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
              📷 Using placeholder
            </div>
          )}

          {/* Navigation Arrows - Only show if multiple images */}
          {activeImages.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label="Previous image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label="Next image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Image Counter */}
          {activeImages.length > 1 && (
            <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white text-sm px-2 py-1 rounded">
              {selectedImageIndex + 1} / {activeImages.length}
            </div>
          )}

          {/* Fullscreen icon */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute top-4 left-4 bg-black bg-opacity-60 text-white p-2 rounded-lg hover:bg-opacity-80 transition-opacity"
            aria-label="View fullscreen"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Thumbnails Slider */}
      {activeImages.length > 1 && (
        <div className="relative">
          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
          {activeImages.map((image, index) => (
            <button
              key={`${image.imageId}-${index}`}
              onClick={() => handleThumbnailClick(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 relative ${
                index === selectedImageIndex
                    ? 'border-green-600 ring-2 ring-green-200'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
                {/* Thumbnail loading */}
                {loadingStates[index] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                  </div>
                )}
              <img
                  src={getImageSrc(image, index)}
                alt={`${productName} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                  onLoad={() => handleImageLoad(index)}
                  onError={() => handleImageError(index)}
                  style={{
                    opacity: loadingStates[index] ? 0 : 1
                  }}
              />
            </button>
          ))}
          </div>
        </div>
      )}

      {/* Dot Navigation */}
      {activeImages.length > 1 && (
        <div className="flex justify-center space-x-2">
          {activeImages.map((_, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === selectedImageIndex
                  ? 'bg-green-600 w-6'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4">
          <div className="relative max-w-5xl max-h-full">
            <img
              src={getImageSrc(currentImage, selectedImageIndex)}
              alt={`${productName} - Fullscreen`}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-60 p-3 rounded-lg hover:bg-opacity-80 transition-opacity"
              aria-label="Close fullscreen"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation buttons in modal */}
            {activeImages.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-60 p-3 rounded-lg hover:bg-opacity-80 transition-opacity"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-60 p-3 rounded-lg hover:bg-opacity-80 transition-opacity"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Image counter in modal */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-60 px-4 py-2 rounded-lg">
              {selectedImageIndex + 1} / {activeImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery; 