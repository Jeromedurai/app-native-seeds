import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Upload, X, Image as ImageIcon, Trash2, Star, Package,
  Grid, List, Search, RefreshCw, Eye, AlertTriangle, Plus
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ProductDropdown from '../../components/product/ProductDropdown';
import { Product, ProductImageData, ProductImageUpload } from '../../types';

interface ProductImageManagementProps {}

const ProductImageManagement: React.FC<ProductImageManagementProps> = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productImages, setProductImages] = useState<ProductImageData[]>([]);
  const [uploadedImages, setUploadedImages] = useState<ProductImageUpload[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImageIds, setSelectedImageIds] = useState<number[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<ProductImageData | null>(null);

  // Mock products for dropdown - replace with actual API call
  const mockProducts = useMemo((): Product[] => [
    {
      productId: 1001,
      tenantId: 10,
      productName: "Fresh Apples",
      productDescription: "Crisp and sweet red apples",
      productCode: "AP001",
      fullDescription: "Premium quality red apples",
      specification: "Size: Medium",
      story: "Grown sustainably",
      packQuantity: 6,
      quantity: 100,
      total: 100,
      price: 4.99,
      categrory: 1,
      rating: 4.5,
      active: true,
      trending: 1,
      userBuyCount: 50,
      return: 2,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      in_stock: true,
      best_seller: true,
      deleveryDate: 2,
      offer: "Buy 2 Get 1 Free",
      orderBy: 1,
      userId: 1,
      overview: "Fresh and crispy apples",
      long_description: "Premium apples carefully selected",
      images: [],
      reviews: []
    },
    {
      productId: 1002,
      tenantId: 10,
      productName: "Organic Bananas",
      productDescription: "Fresh organic bananas",
      productCode: "BN001",
      fullDescription: "Organic bananas from certified farms",
      specification: "Organic, Medium size",
      story: "Sustainably grown",
      packQuantity: 6,
      quantity: 80,
      total: 80,
      price: 3.99,
      categrory: 1,
      rating: 4.2,
      active: true,
      trending: 0,
      userBuyCount: 30,
      return: 1,
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      in_stock: true,
      best_seller: false,
      deleveryDate: 2,
      offer: "",
      orderBy: 2,
      userId: 1,
      overview: "Fresh organic bananas",
      long_description: "Premium organic bananas",
      images: [],
      reviews: []
    }
  ], []);

  // Mock product images - replace with actual API call
  const mockProductImages = useMemo((): ProductImageData[] => [
    {
      imageId: 1,
      productId: 1001,
      poster: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400",
      main: true,
      active: true,
      orderBy: 1,
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    },
    {
      imageId: 2,
      productId: 1001,
      poster: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400",
      main: false,
      active: true,
      orderBy: 2,
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    }
  ], []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.getProducts();
      setTimeout(() => {
        setProducts(mockProducts);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setLoading(false);
    }
  }, [mockProducts]);

  const fetchProductImages = useCallback(async (productId: number) => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.getProductImages(productId);
      setTimeout(() => {
        const filteredImages = mockProductImages.filter(img => img.productId === productId);
        setProductImages(filteredImages);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Failed to fetch product images:', error);
      setLoading(false);
    }
  }, [mockProductImages]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (selectedProduct) {
      fetchProductImages(selectedProduct.productId);
    }
  }, [selectedProduct, fetchProductImages]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages: ProductImageUpload[] = acceptedFiles.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      file,
      preview: URL.createObjectURL(file),
      main: uploadedImages.length === 0 && index === 0, // First image is main by default
      orderBy: uploadedImages.length + index + 1
    }));
    
    setUploadedImages(prev => [...prev, ...newImages]);
  }, [uploadedImages.length]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif']
    },
    maxFiles: 10,
    maxSize: 5 * 1024 * 1024 // 5MB
  });

  const removeUploadedImage = (imageId: string) => {
    setUploadedImages(prev => {
      const filtered = prev.filter(img => img.id !== imageId);
      // Clean up preview URL
      const imageToRemove = prev.find(img => img.id === imageId);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return filtered;
    });
  };

  const setMainImage = (imageId: string) => {
    setUploadedImages(prev => 
      prev.map(img => ({
        ...img,
        main: img.id === imageId
      }))
    );
  };

  const setMainExistingImage = async (imageId: number) => {
    try {
      // TODO: Replace with actual API call
      // await api.setMainImage(imageId);
      setProductImages(prev => 
        prev.map(img => ({
          ...img,
          main: img.imageId === imageId
        }))
      );
    } catch (error) {
      console.error('Failed to set main image:', error);
    }
  };

  const handleUploadImages = async () => {
    if (!selectedProduct || uploadedImages.length === 0) return;

    setUploadLoading(true);
    try {
      // TODO: Replace with actual API calls
      // const uploadPromises = uploadedImages.map(img => 
      //   api.uploadProductImage(selectedProduct.productId, img.file, img.main, img.orderBy)
      // );
      // await Promise.all(uploadPromises);

      // Mock successful upload
      const newImages: ProductImageData[] = uploadedImages.map((img, index) => ({
        imageId: Date.now() + index,
        productId: selectedProduct.productId,
        poster: img.preview,
        main: img.main,
        active: true,
        orderBy: productImages.length + img.orderBy,
        created: new Date().toISOString(),
        modified: new Date().toISOString()
      }));

      setProductImages(prev => [...prev, ...newImages]);
      setUploadedImages([]);
      setShowUploadModal(false);
    } catch (error) {
      console.error('Failed to upload images:', error);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteImage = (image: ProductImageData) => {
    setImageToDelete(image);
    setShowDeleteModal(true);
  };

  const confirmDeleteImage = useCallback(async () => {
    if (!imageToDelete) return;

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // await api.deleteProductImage(imageToDelete.imageId);
      setProductImages(prev => prev.filter(img => img.imageId !== imageToDelete.imageId));
      setShowDeleteModal(false);
      setImageToDelete(null);
    } catch (error) {
      console.error('Failed to delete image:', error);
    } finally {
      setLoading(false);
    }
  }, [imageToDelete]);

  const toggleImageSelection = (imageId: number) => {
    setSelectedImageIds(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const deleteSelectedImages = useCallback(async () => {
    if (selectedImageIds.length === 0) return;

    setLoading(true);
    try {
      // TODO: Replace with actual API calls
      // await Promise.all(selectedImageIds.map(id => api.deleteProductImage(id)));
      setProductImages(prev => prev.filter(img => !selectedImageIds.includes(img.imageId)));
      setSelectedImageIds([]);
    } catch (error) {
      console.error('Failed to delete selected images:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedImageIds]);

  const filteredImages = productImages.filter(image => 
    image.poster.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Image Management</h1>
              <p className="mt-2 text-gray-600">Manage product images and gallery</p>
            </div>
            <div className="mt-4 sm:mt-0 flex gap-3">
              <button
                onClick={() => setShowUploadModal(true)}
                disabled={!selectedProduct}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Upload className="w-5 h-5" />
                Upload Images
              </button>
            </div>
          </div>
        </div>

        {/* Product Selection */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Product
              </label>
              <ProductDropdown
                value={selectedProduct}
                onChange={(product) => {
                  setSelectedProduct(product);
                  setSelectedImageIds([]);
                }}
                placeholder="Choose a product..."
                products={products}
                onRefresh={fetchProducts}
                className="w-full"
              />
            </div>
            
            {selectedProduct && (
              <div className="flex items-end">
                <div className="bg-blue-50 rounded-lg p-4 w-full">
                  <h3 className="font-medium text-blue-900">{selectedProduct.productName}</h3>
                  <p className="text-sm text-blue-700">{selectedProduct.productCode}</p>
                  <p className="text-sm text-blue-600 mt-1">
                    {productImages.length} image{productImages.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {selectedProduct && (
          <>
            {/* Controls */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search images..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  {selectedImageIds.length > 0 && (
                    <button
                      onClick={deleteSelectedImages}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Selected ({selectedImageIds.length})
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fetchProductImages(selectedProduct.productId)}
                    disabled={loading}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                  </button>
                  
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Images Display */}
            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : filteredImages.length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
                    {filteredImages.map((image) => (
                      <div key={image.imageId} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={image.poster}
                            alt={`Product ${image.imageId}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          
                          {/* Overlay */}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                              <button
                                onClick={() => window.open(image.poster, '_blank')}
                                className="bg-white text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteImage(image)}
                                className="bg-white text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Selection Checkbox */}
                          <div className="absolute top-2 left-2">
                            <input
                              type="checkbox"
                              checked={selectedImageIds.includes(image.imageId)}
                              onChange={() => toggleImageSelection(image.imageId)}
                              className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                            />
                          </div>

                          {/* Main Image Badge */}
                          {image.main && (
                            <div className="absolute top-2 right-2">
                              <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                <Star className="w-3 h-3 fill-current" />
                                Main
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Image Info */}
                        <div className="mt-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Order: {image.orderBy}
                            </span>
                            {!image.main && (
                              <button
                                onClick={() => setMainExistingImage(image.imageId)}
                                className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                              >
                                Set as Main
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredImages.map((image) => (
                      <div key={image.imageId} className="p-6 flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={selectedImageIds.includes(image.imageId)}
                          onChange={() => toggleImageSelection(image.imageId)}
                          className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                        />
                        
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={image.poster}
                            alt={`Product ${image.imageId}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">Image {image.imageId}</span>
                            {image.main && (
                              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                <Star className="w-3 h-3 fill-current" />
                                Main Image
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">Order: {image.orderBy}</p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {!image.main && (
                            <button
                              onClick={() => setMainExistingImage(image.imageId)}
                              className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition-colors"
                            >
                              Set as Main
                            </button>
                          )}
                          <button
                            onClick={() => window.open(image.poster, '_blank')}
                            className="text-gray-400 hover:text-gray-600 p-1"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteImage(image)}
                            className="text-gray-400 hover:text-red-600 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No images found</h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery 
                    ? "No images match your search criteria" 
                    : "This product doesn't have any images yet"}
                </p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Add Images
                </button>
              </div>
            )}
          </>
        )}

        {!selectedProduct && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Product</h3>
            <p className="text-gray-500">Choose a product from the dropdown to manage its images</p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Upload Product Images</h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadedImages([]);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Dropzone */}
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                {isDragActive ? (
                  <p className="text-blue-600 text-lg font-medium">Drop the images here...</p>
                ) : (
                  <div>
                    <p className="text-gray-600 text-lg font-medium mb-2">
                      Drag & drop images here, or click to select
                    </p>
                    <p className="text-gray-500 text-sm">
                      Supports PNG, JPG, JPEG, WebP, GIF up to 5MB each
                    </p>
                  </div>
                )}
              </div>

              {/* Preview Images */}
              {uploadedImages.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Preview ({uploadedImages.length} image{uploadedImages.length !== 1 ? 's' : ''})
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {uploadedImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={image.preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Remove Button */}
                          <button
                            onClick={() => removeUploadedImage(image.id!)}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>

                          {/* Main Image Badge */}
                          {image.main && (
                            <div className="absolute top-2 left-2">
                              <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                <Star className="w-3 h-3 fill-current" />
                                Main
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-2">
                          {!image.main && (
                            <button
                              onClick={() => setMainImage(image.id!)}
                              className="w-full text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                            >
                              Set as Main
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setUploadedImages([]);
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadImages}
                disabled={uploadedImages.length === 0 || uploadLoading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
              >
                {uploadLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload {uploadedImages.length} Image{uploadedImages.length !== 1 ? 's' : ''}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && imageToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Delete Image</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone.</p>
                </div>
              </div>
              
              <div className="mb-6">
                <img
                  src={imageToDelete.poster}
                  alt="Selected product"
                  className="w-20 h-20 object-cover rounded-lg mx-auto"
                />
              </div>
              
              <p className="text-gray-700 mb-6 text-center">
                Are you sure you want to delete this image?
              </p>
              
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteImage}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageManagement;