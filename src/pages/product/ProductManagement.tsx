import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  Plus, Edit, Trash2, Search, RefreshCw, X,
  Package, Warehouse, Star, MoreVertical, Save, AlertCircle
} from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Product, ProductFormData, ProductCategory } from '../../types';
import { formatPrice } from '../../utils';

// Validation Schema
const productValidationSchema = Yup.object().shape({
  productName: Yup.string()
    .min(2, 'Product name must be at least 2 characters')
    .max(100, 'Product name cannot exceed 100 characters')
    .required('Product name is required'),
  productDescription: Yup.string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description cannot exceed 500 characters')
    .required('Product description is required'),
  productCode: Yup.string()
    .min(3, 'Product code must be at least 3 characters')
    .max(20, 'Product code cannot exceed 20 characters')
    .required('Product code is required'),
  price: Yup.number()
    .min(0.01, 'Price must be greater than 0')
    .max(999999, 'Price cannot exceed 999,999')
    .required('Price is required'),
  quantity: Yup.number()
    .min(0, 'Quantity cannot be negative')
    .integer('Quantity must be a whole number')
    .required('Quantity is required'),
  packQuantity: Yup.number()
    .min(1, 'Pack quantity must be at least 1')
    .integer('Pack quantity must be a whole number')
    .required('Pack quantity is required'),
  categrory: Yup.number()
    .min(1, 'Please select a category')
    .required('Category is required'),
  deleveryDate: Yup.number()
    .min(1, 'Delivery days must be at least 1')
    .max(365, 'Delivery days cannot exceed 365')
    .required('Delivery date is required'),
  offer: Yup.string()
    .max(50, 'Offer text cannot exceed 50 characters'),
});

interface ProductManagementProps {}

const ProductManagement: React.FC<ProductManagementProps> = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState('productName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Mock data for demonstration - replace with actual API calls
  const mockCategories = useMemo((): ProductCategory[] => [
    { id: 1, name: 'Fruits & Vegetables', active: true },
    { id: 2, name: 'Dairy & Eggs', active: true },
    { id: 3, name: 'Meat & Seafood', active: true },
    { id: 4, name: 'Beverages', active: true },
    { id: 5, name: 'Bakery', active: true },
    { id: 6, name: 'Pantry', active: true },
  ], []);

  const mockProducts = useMemo((): Product[] => [
    {
      productId: 1001,
      tenantId: 10,
      productName: "Fresh Apples",
      productDescription: "Crisp and sweet red apples",
      productCode: "AP001",
      fullDescription: "Premium quality red apples sourced from local orchards",
      specification: "Size: Medium, Weight: 150-200g per piece",
      story: "Grown in the fertile valleys with sustainable farming practices",
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
      long_description: "These premium apples are carefully selected for their taste and quality",
      images: [],
      reviews: [],
      reviewStats: {
        totalReviews: 25,
        averageRating: 4.5,
        ratingDistribution: {
          5: 15,
          4: 8,
          3: 2,
          2: 0,
          1: 0
        }
      }
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
      }, 1000);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setLoading(false);
    }
  }, [mockProducts]);

  const fetchCategories = useCallback(async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.getCategories();
      setCategories(mockCategories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, [mockCategories]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const handleAddProduct = () => {
    setSelectedProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const confirmDeleteProduct = useCallback(async () => {
    if (!productToDelete) return;
    
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // await api.deleteProduct(productToDelete.productId);
      setProducts(prevProducts => prevProducts.filter(p => p.productId !== productToDelete.productId));
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Failed to delete product:', error);
    } finally {
      setLoading(false);
    }
  }, [productToDelete]);

  const handleSubmitProduct = useCallback(async (values: ProductFormData, { setSubmitting, resetForm }: any) => {
    try {
      if (selectedProduct) {
        // Update existing product
        // TODO: Replace with actual API call
        // await api.updateProduct(selectedProduct.productId, values);
        const updatedProduct = { ...selectedProduct, ...values };
        setProducts(prevProducts => prevProducts.map(p => 
          p.productId === selectedProduct.productId ? updatedProduct : p
        ));
      } else {
        // Add new product
        // TODO: Replace with actual API call
        // const response = await api.createProduct(values);
        const newProduct: Product = {
          ...values,
          productId: Date.now(), // Mock ID
          created: new Date().toISOString(),
          modified: new Date().toISOString(),
          overview: values.productDescription,
          long_description: values.fullDescription,
          images: [],
          reviews: [],
          reviewStats: {
            totalReviews: 0,
            averageRating: 0,
            ratingDistribution: {}
          }
        };
        setProducts(prevProducts => [...prevProducts, newProduct]);
      }

      setShowModal(false);
      resetForm();
      // Refresh product list to get updated dropdown options
      await fetchProducts();
    } catch (error) {
      console.error('Failed to save product:', error);
    } finally {
      setSubmitting(false);
    }
  }, [selectedProduct, fetchProducts]);

  const getInitialValues = (): ProductFormData => {
    if (selectedProduct) {
      return {
        productName: selectedProduct.productName,
        productDescription: selectedProduct.productDescription,
        productCode: selectedProduct.productCode,
        fullDescription: selectedProduct.fullDescription,
        specification: selectedProduct.specification,
        story: selectedProduct.story,
        packQuantity: selectedProduct.packQuantity,
        quantity: selectedProduct.quantity,
        total: selectedProduct.total,
        price: selectedProduct.price,
        categrory: selectedProduct.categrory,
        rating: selectedProduct.rating,
        active: selectedProduct.active,
        trending: selectedProduct.trending,
        userBuyCount: selectedProduct.userBuyCount,
        return: selectedProduct.return,
        in_stock: selectedProduct.in_stock,
        best_seller: selectedProduct.best_seller,
        deleveryDate: selectedProduct.deleveryDate,
        offer: selectedProduct.offer,
        orderBy: selectedProduct.orderBy,
        userId: selectedProduct.userId,
        tenantId: selectedProduct.tenantId,
      };
    }

    return {
      tenantId: 10, // Default tenant ID
      productName: '',
      productDescription: '',
      productCode: '',
      fullDescription: '',
      specification: '',
      story: '',
      packQuantity: 1,
      quantity: 0,
      total: 0,
      price: 0,
      categrory: 0,
      rating: 0,
      active: true,
      trending: 0,
      userBuyCount: 0,
      return: 0,
      in_stock: true,
      best_seller: false,
      deleveryDate: 3,
      offer: '',
      orderBy: 1,
      userId: 1, // Default user ID
    };
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.productCode.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === null || product.categrory === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort products
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy as keyof Product];
      let bValue: any = b[sortBy as keyof Product];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [products, searchQuery, selectedCategory, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const paginatedProducts = filteredAndSortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading && products.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
              <p className="mt-2 text-gray-600">Manage your product catalog</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={handleAddProduct}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Product
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Products</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.active).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.quantity <= 10).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Best Sellers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products.filter(p => p.best_seller).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); // Reset to first page when searching
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={selectedCategory || ''}
              onChange={(e) => {
                setSelectedCategory(e.target.value ? Number(e.target.value) : null);
                setCurrentPage(1); // Reset to first page when filtering
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order as 'asc' | 'desc');
                setCurrentPage(1); // Reset to first page when sorting
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="productName-asc">Name A-Z</option>
              <option value="productName-desc">Name Z-A</option>
              <option value="price-asc">Price Low-High</option>
              <option value="price-desc">Price High-Low</option>
              <option value="quantity-asc">Stock Low-High</option>
              <option value="quantity-desc">Stock High-Low</option>
              <option value="productCode-asc">SKU A-Z</option>
              <option value="productCode-desc">SKU Z-A</option>
            </select>
            <button
              onClick={fetchProducts}
              disabled={loading}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU / Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedProducts.map((product) => {
                  const categoryName = categories.find(cat => cat.id === product.categrory)?.name || 'Unknown';
                  const stockStatus = product.quantity <= 10 ? 'low' : product.quantity <= 50 ? 'medium' : 'high';
                  const stockColor = stockStatus === 'low' ? 'text-red-600' : stockStatus === 'medium' ? 'text-yellow-600' : 'text-green-600';
                  
                  return (
                    <tr key={product.productId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            {product.images && product.images.length > 0 ? (
                              <img 
                                className="h-12 w-12 rounded-lg object-cover" 
                                src={product.images[0].poster} 
                                alt={product.productName} 
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                                <Package className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                              {product.productName}
                            </div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">
                              {product.productDescription}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <Star className="w-3 h-3 text-yellow-400 mr-1 fill-current" />
                              {product.rating}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {product.productCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {categoryName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <span className="font-semibold">{formatPrice(product.price)}</span>
                          {product.offer && (
                            <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                              {product.offer}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          <Warehouse className="w-4 h-4 text-gray-400 mr-2" />
                          <span className={`font-medium ${stockColor}`}>
                            {product.quantity}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Pack: {product.packQuantity}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <div className="flex gap-1">
                            {product.active && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                Active
                              </span>
                            )}
                            {!product.active && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                Inactive
                              </span>
                            )}
                          </div>
                          <div className="flex gap-1">
                            {product.best_seller && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                                Best Seller
                              </span>
                            )}
                            {!product.in_stock && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                Out of Stock
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => handleEditProduct(product)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4 mt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredAndSortedProducts.length)} of{' '}
                {filteredAndSortedProducts.length} products
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded text-sm ${
                      page === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {filteredAndSortedProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || selectedCategory 
                ? "Try adjusting your search filters" 
                : "Get started by adding your first product"}
            </p>
            {!searchQuery && !selectedCategory && (
              <button
                onClick={handleAddProduct}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Add Your First Product
              </button>
            )}
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
              <Formik
                initialValues={getInitialValues()}
                validationSchema={productValidationSchema}
                onSubmit={handleSubmitProduct}
                enableReinitialize
              >
                {({ isSubmitting, values, setFieldValue }) => (
                  <Form className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Name *
                          </label>
                          <Field
                            name="productName"
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter product name"
                          />
                          <ErrorMessage name="productName" component="div" className="text-red-600 text-sm mt-1" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Code *
                          </label>
                          <Field
                            name="productCode"
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter product code"
                          />
                          <ErrorMessage name="productCode" component="div" className="text-red-600 text-sm mt-1" />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Description *
                          </label>
                          <Field
                            as="textarea"
                            name="productDescription"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter product description"
                          />
                          <ErrorMessage name="productDescription" component="div" className="text-red-600 text-sm mt-1" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category *
                          </label>
                          <Field
                            as="select"
                            name="categrory"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value={0}>Select Category</option>
                            {categories.map(category => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage name="categrory" component="div" className="text-red-600 text-sm mt-1" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price *
                          </label>
                          <Field
                            name="price"
                            type="number"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0.00"
                          />
                          <ErrorMessage name="price" component="div" className="text-red-600 text-sm mt-1" />
                        </div>
                      </div>
                    </div>

                    {/* Inventory */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Inventory</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity *
                          </label>
                          <Field
                            name="quantity"
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const quantity = Number(e.target.value);
                              setFieldValue('quantity', quantity);
                              setFieldValue('total', quantity);
                            }}
                          />
                          <ErrorMessage name="quantity" component="div" className="text-red-600 text-sm mt-1" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pack Quantity *
                          </label>
                          <Field
                            name="packQuantity"
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="1"
                          />
                          <ErrorMessage name="packQuantity" component="div" className="text-red-600 text-sm mt-1" />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Delivery Days *
                          </label>
                          <Field
                            name="deleveryDate"
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="3"
                          />
                          <ErrorMessage name="deleveryDate" component="div" className="text-red-600 text-sm mt-1" />
                        </div>
                      </div>
                    </div>

                    {/* Status & Settings */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Status & Settings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <label className="flex items-center gap-3">
                            <Field
                              name="active"
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Active</span>
                          </label>

                          <label className="flex items-center gap-3">
                            <Field
                              name="in_stock"
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">In Stock</span>
                          </label>

                          <label className="flex items-center gap-3">
                            <Field
                              name="best_seller"
                              type="checkbox"
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Best Seller</span>
                          </label>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Offer
                          </label>
                          <Field
                            name="offer"
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., 50% off, Buy 2 Get 1 Free"
                          />
                          <ErrorMessage name="offer" component="div" className="text-red-600 text-sm mt-1" />
                        </div>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Details</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Description
                          </label>
                          <Field
                            as="textarea"
                            name="fullDescription"
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter detailed description"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Specification
                          </label>
                          <Field
                            as="textarea"
                            name="specification"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter product specifications"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Story
                          </label>
                          <Field
                            as="textarea"
                            name="story"
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Tell the story behind this product"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            {selectedProduct ? 'Update Product' : 'Create Product'}
                          </>
                        )}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Delete Product</h3>
                  <p className="text-sm text-gray-500">This action cannot be undone.</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete <strong>{productToDelete.productName}</strong>?
              </p>
              
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteProduct}
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

export default ProductManagement;