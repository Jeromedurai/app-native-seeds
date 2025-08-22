import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Folder, FolderOpen } from 'lucide-react';
import Modal from '../../components/common/Modal';

interface Category {
  id: string;
  name: string;
  description: string;
  type: 'main' | 'sub';
  parentId?: string;
  parentName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  productCount: number;
}

interface CategoryFormData {
  name: string;
  description: string;
  type: 'main' | 'sub';
  parentId?: string;
  isActive: boolean;
}

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMultipleSubModal, setShowMultipleSubModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [selectedParentCategory, setSelectedParentCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    type: 'main',
    isActive: true
  });
  const [multipleSubcategories, setMultipleSubcategories] = useState<Array<{
    name: string;
    description: string;
    isActive: boolean;
  }>>([{ name: '', description: '', isActive: true }]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'main' | 'sub'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockCategories: Category[] = [
        {
          id: '1',
          name: 'Seeds',
          description: 'High-quality organic seeds for various plants',
          type: 'main',
          isActive: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z',
          productCount: 45
        },
        {
          id: '2',
          name: 'Vegetable Seeds',
          description: 'Fresh vegetable seeds for home gardening',
          type: 'sub',
          parentId: '1',
          parentName: 'Seeds',
          isActive: true,
          createdAt: '2024-01-16T09:15:00Z',
          updatedAt: '2024-01-16T09:15:00Z',
          productCount: 25
        },
        {
          id: '3',
          name: 'Herb Seeds',
          description: 'Aromatic herb seeds for culinary use',
          type: 'sub',
          parentId: '1',
          parentName: 'Seeds',
          isActive: true,
          createdAt: '2024-01-17T14:20:00Z',
          updatedAt: '2024-01-17T14:20:00Z',
          productCount: 20
        },
        {
          id: '4',
          name: 'Garden Tools',
          description: 'Essential tools for gardening and plant care',
          type: 'main',
          isActive: true,
          createdAt: '2024-01-18T11:45:00Z',
          updatedAt: '2024-01-18T11:45:00Z',
          productCount: 32
        },
        {
          id: '5',
          name: 'Planters & Pots',
          description: 'Various containers for planting and growing',
          type: 'sub',
          parentId: '4',
          parentName: 'Garden Tools',
          isActive: true,
          createdAt: '2024-01-19T16:30:00Z',
          updatedAt: '2024-01-19T16:30:00Z',
          productCount: 18
        },
        {
          id: '6',
          name: 'Fertilizers',
          description: 'Organic fertilizers for plant nutrition',
          type: 'main',
          isActive: false,
          createdAt: '2024-01-20T13:10:00Z',
          updatedAt: '2024-01-20T13:10:00Z',
          productCount: 0
        }
      ];
      
      setCategories(mockCategories);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and search logic
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (category.parentName && category.parentName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = filterType === 'all' || category.type === filterType;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && category.isActive) ||
                         (filterStatus === 'inactive' && !category.isActive);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Get main categories for subcategory parent selection
  const mainCategories = categories.filter(cat => cat.type === 'main');

  const handleAddCategory = () => {
    setFormData({
      name: '',
      description: '',
      type: 'main',
      isActive: true
    });
    setShowAddModal(true);
  };

  const handleAddSubcategory = (parentCategory: Category) => {
    setFormData({
      name: '',
      description: '',
      type: 'sub',
      parentId: parentCategory.id,
      isActive: true
    });
    setShowAddModal(true);
  };

  const handleAddMultipleSubcategories = (parentCategory: Category) => {
    setSelectedParentCategory(parentCategory);
    setMultipleSubcategories([{ name: '', description: '', isActive: true }]);
    setShowMultipleSubModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      type: category.type,
      parentId: category.parentId,
      isActive: category.isActive
    });
    setShowEditModal(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setCategories(prev => prev.filter(cat => cat.id !== categoryId));
        console.log('Category deleted successfully');
      } catch (error) {
        console.error('Failed to delete category:', error);
        alert('Failed to delete category. Please try again.');
      }
    }
  };

  const handleSubmit = async (isEdit: boolean = false) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (isEdit && editingCategory) {
        // Update existing category
        setCategories(prev => prev.map(cat => 
          cat.id === editingCategory.id 
            ? {
                ...cat,
                name: formData.name,
                description: formData.description,
                type: formData.type,
                parentId: formData.parentId,
                parentName: formData.parentId ? mainCategories.find(mc => mc.id === formData.parentId)?.name : undefined,
                isActive: formData.isActive,
                updatedAt: new Date().toISOString()
              }
            : cat
        ));
        setShowEditModal(false);
        setEditingCategory(null);
      } else {
        // Add new category
        const newCategory: Category = {
          id: Date.now().toString(),
          name: formData.name,
          description: formData.description,
          type: formData.type,
          parentId: formData.parentId,
          parentName: formData.parentId ? mainCategories.find(mc => mc.id === formData.parentId)?.name : undefined,
          isActive: formData.isActive,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          productCount: 0
        };
        
        setCategories(prev => [...prev, newCategory]);
        setShowAddModal(false);
      }
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        type: 'main',
        isActive: true
      });
    } catch (error) {
      console.error('Failed to save category:', error);
      alert('Failed to save category. Please try again.');
    }
  };

  const handleSubmitMultipleSubcategories = async () => {
    try {
      // Validate that at least one subcategory has a name
      const validSubcategories = multipleSubcategories.filter(sub => sub.name.trim());
      if (validSubcategories.length === 0) {
        alert('Please add at least one subcategory with a name.');
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add all valid subcategories
      const newSubcategories: Category[] = validSubcategories.map((sub, index) => ({
        id: `sub-${Date.now()}-${index}`,
        name: sub.name.trim(),
        description: sub.description.trim(),
        type: 'sub' as const,
        parentId: selectedParentCategory!.id,
        parentName: selectedParentCategory!.name,
        isActive: sub.isActive,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        productCount: 0
      }));
      
      setCategories(prev => [...prev, ...newSubcategories]);
      setShowMultipleSubModal(false);
      setSelectedParentCategory(null);
      setMultipleSubcategories([{ name: '', description: '', isActive: true }]);
      
      console.log(`Successfully added ${newSubcategories.length} subcategories`);
    } catch (error) {
      console.error('Failed to add subcategories:', error);
      alert('Failed to add subcategories. Please try again.');
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  // const getTypeColor = (type: string) => {
  //   return type === 'main' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
  // }; // Reserved for future use

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
              <p className="text-gray-600 mt-1">Manage product categories and subcategories</p>
            </div>
            <button
              onClick={handleAddCategory}
              className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          </div>
        </div>

        {/* Filters and Stats */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Categories</label>
              <input
                type="text"
                placeholder="Search by name, description, or parent category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'main' | 'sub')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="main">Main Categories</option>
                <option value="sub">Subcategories</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-end justify-between">
              <div className="text-sm text-gray-600">
                <span className="font-medium">{filteredCategories.length}</span> of {categories.length} categories
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-blue-600">
                  {categories.filter(cat => cat.type === 'main').length}
                </div>
                <div className="text-xs text-gray-500">Main Categories</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-purple-600">
                  {categories.filter(cat => cat.type === 'sub').length}
                </div>
                <div className="text-xs text-gray-500">Subcategories</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-green-600">
                  {categories.filter(cat => cat.isActive).length}
                </div>
                <div className="text-xs text-gray-500">Active</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-600">
                  {categories.reduce((sum, cat) => sum + cat.productCount, 0)}
                </div>
                <div className="text-xs text-gray-500">Total Products</div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="space-y-6">
          {/* Group categories by main categories */}
          {(() => {
            const mainCategories = filteredCategories.filter(cat => cat.type === 'main');
            const subCategories = filteredCategories.filter(cat => cat.type === 'sub');
            
            return mainCategories.map((mainCategory) => {
              const categorySubCategories = subCategories.filter(sub => sub.parentId === mainCategory.id);
              const hasSubCategories = categorySubCategories.length > 0;
              
              return (
                <div key={mainCategory.id} className="space-y-4">
                  {/* Main Category Card */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Folder className="w-6 h-6 text-blue-600" />
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{mainCategory.name}</h3>
                          {hasSubCategories && (
                            <p className="text-sm text-gray-500 mt-1">
                              {categorySubCategories.length} subcategor{categorySubCategories.length === 1 ? 'y' : 'ies'}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Add Subcategory Button */}
                        <button
                          onClick={() => handleAddSubcategory(mainCategory)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
                          title="Add subcategory"
                        >
                          <Plus className="w-3 h-3" />
                          Add Sub
                        </button>
                        
                        {/* Add Multiple Subcategories Button */}
                        <button
                          onClick={() => handleAddMultipleSubcategories(mainCategory)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                          title="Add multiple subcategories"
                        >
                          <Plus className="w-3 h-3" />
                          Add Multiple
                        </button>
                        <button
                          onClick={() => handleEditCategory(mainCategory)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded"
                          title="Edit category"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(mainCategory.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded"
                          title="Delete category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4">{mainCategory.description}</p>

                    {/* Stats Row */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Main Category
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(mainCategory.isActive)}`}>
                          {mainCategory.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 font-medium">
                        {mainCategory.productCount} products
                      </span>
                    </div>

                    {/* Dates */}
                    <div className="text-xs text-gray-400 space-y-1">
                      <div>Created: {formatDate(mainCategory.createdAt)}</div>
                      <div>Updated: {formatDate(mainCategory.updatedAt)}</div>
                    </div>
                  </div>

                  {/* Subcategories Grid */}
                  {hasSubCategories && (
                    <div className="ml-8 space-y-3">
                      <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <FolderOpen className="w-4 h-4 text-purple-600" />
                        Subcategories
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {categorySubCategories.map((subCategory) => (
                          <div key={subCategory.id} className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:bg-gray-100 transition-colors">
                            {/* Subcategory Header */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <FolderOpen className="w-4 h-4 text-purple-600" />
                                <h5 className="font-medium text-gray-900 text-sm">{subCategory.name}</h5>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleEditCategory(subCategory)}
                                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                  title="Edit subcategory"
                                >
                                  <Edit className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCategory(subCategory.id)}
                                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                  title="Delete subcategory"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {/* Subcategory Description */}
                            <p className="text-gray-600 text-xs mb-3 line-clamp-2">{subCategory.description}</p>

                            {/* Subcategory Stats */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  Sub
                                </span>
                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(subCategory.isActive)}`}>
                                  {subCategory.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                              <span className="text-xs text-gray-500">
                                {subCategory.productCount} products
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            });
          })()}

          {/* Standalone Subcategories (orphaned) */}
          {(() => {
            const orphanedSubCategories = filteredCategories.filter(
              cat => cat.type === 'sub' && !filteredCategories.some(main => main.id === cat.parentId)
            );
            
            if (orphanedSubCategories.length > 0) {
              return (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-orange-600" />
                    Orphaned Subcategories
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {orphanedSubCategories.map((subCategory) => (
                      <div key={subCategory.id} className="bg-orange-50 rounded-lg border border-orange-200 p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <FolderOpen className="w-4 h-4 text-orange-600" />
                            <h5 className="font-medium text-gray-900 text-sm">{subCategory.name}</h5>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEditCategory(subCategory)}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              title="Edit subcategory"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(subCategory.id)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="Delete subcategory"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-600 text-xs mb-3">{subCategory.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            Orphaned
                          </span>
                          <span className="text-xs text-gray-500">{subCategory.productCount} products</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }
            return null;
          })()}
        </div>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filterType !== 'all' || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first category'
              }
            </p>
            {!searchQuery && filterType === 'all' && filterStatus === 'all' && (
              <button
                onClick={handleAddCategory}
                className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={formData.type === 'sub' ? 'Add New Subcategory' : 'Add New Category'}
        size="sm"
      >
        <CategoryForm
          formData={formData}
          setFormData={setFormData}
          mainCategories={mainCategories}
          onSubmit={() => handleSubmit(false)}
          onCancel={() => setShowAddModal(false)}
          isEdit={false}
        />
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingCategory(null);
        }}
        title="Edit Category"
        size="sm"
      >
        <CategoryForm
          formData={formData}
          setFormData={setFormData}
          mainCategories={mainCategories}
          onSubmit={() => handleSubmit(true)}
          onCancel={() => {
            setShowEditModal(false);
            setEditingCategory(null);
          }}
          isEdit={true}
        />
      </Modal>

      {/* Add Multiple Subcategories Modal */}
      <Modal
        isOpen={showMultipleSubModal}
        onClose={() => {
          setShowMultipleSubModal(false);
          setSelectedParentCategory(null);
        }}
        title={`Add Multiple Subcategories to "${selectedParentCategory?.name}"`}
        size="xl"
      >
        <MultipleSubcategoriesForm
          subcategories={multipleSubcategories}
          setSubcategories={setMultipleSubcategories}
          onSubmit={handleSubmitMultipleSubcategories}
          onCancel={() => {
            setShowMultipleSubModal(false);
            setSelectedParentCategory(null);
          }}
        />
      </Modal>
    </div>
  );
};

// Category Form Component
interface CategoryFormProps {
  formData: CategoryFormData;
  setFormData: React.Dispatch<React.SetStateAction<CategoryFormData>>;
  mainCategories: Category[];
  onSubmit: () => void;
  onCancel: () => void;
  isEdit: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  formData,
  setFormData,
  mainCategories,
  onSubmit,
  onCancel,
  isEdit
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Category name is required');
      return;
    }
    
    if (formData.type === 'sub' && !formData.parentId) {
      alert('Please select a parent category for subcategories');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      {/* Category Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Enter category name"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Enter category description"
        />
      </div>

      {/* Category Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category Type *
        </label>
        <select
          value={formData.type}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            type: e.target.value as 'main' | 'sub',
            parentId: e.target.value === 'main' ? undefined : prev.parentId
          }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="main">Main Category</option>
          <option value="sub">Subcategory</option>
        </select>
      </div>

      {/* Parent Category (for subcategories) */}
      {formData.type === 'sub' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Parent Category *
          </label>
          {formData.parentId && mainCategories.find(cat => cat.id === formData.parentId) ? (
            <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg">
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">
                  {mainCategories.find(cat => cat.id === formData.parentId)?.name}
                </span>
              </div>
            </div>
          ) : (
            <select
              value={formData.parentId || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, parentId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            >
              <option value="">Select parent category</option>
              {mainCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Active Status */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
          Active
        </label>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 -mx-4 px-4 pb-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : (isEdit ? 'Update Category' : 'Create Category')}
        </button>
      </div>
    </form>
  );
};

// Multiple Subcategories Form Component
interface MultipleSubcategoriesFormProps {
  subcategories: Array<{
    name: string;
    description: string;
    isActive: boolean;
  }>;
  setSubcategories: React.Dispatch<React.SetStateAction<Array<{
    name: string;
    description: string;
    isActive: boolean;
  }>>>;
  onSubmit: () => void;
  onCancel: () => void;
}

const MultipleSubcategoriesForm: React.FC<MultipleSubcategoriesFormProps> = ({
  subcategories,
  setSubcategories,
  onSubmit,
  onCancel
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addSubcategory = () => {
    setSubcategories(prev => [...prev, { name: '', description: '', isActive: true }]);
  };

  const removeSubcategory = (index: number) => {
    if (subcategories.length > 1) {
      setSubcategories(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateSubcategory = (index: number, field: 'name' | 'description' | 'isActive', value: string | boolean) => {
    setSubcategories(prev => prev.map((sub, i) => 
      i === index ? { ...sub, [field]: value } : sub
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validSubcategories = subcategories.filter(sub => sub.name.trim());
    if (validSubcategories.length === 0) {
      alert('Please add at least one subcategory with a name.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Add multiple subcategories at once. You can add or remove rows as needed.
        </p>
      </div>

      {/* Subcategories List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {subcategories.map((subcategory, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-900">Subcategory {index + 1}</h4>
              {subcategories.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSubcategory(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {/* Name */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={subcategory.name}
                  onChange={(e) => updateSubcategory(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  placeholder="Enter subcategory name"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={subcategory.description}
                  onChange={(e) => updateSubcategory(index, 'description', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  placeholder="Enter subcategory description"
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`active-${index}`}
                  checked={subcategory.isActive}
                  onChange={(e) => updateSubcategory(index, 'isActive', e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor={`active-${index}`} className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add More Button */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={addSubcategory}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-600 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Another Subcategory
        </button>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 -mx-4 px-4 pb-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Adding...' : `Add ${subcategories.filter(sub => sub.name.trim()).length} Subcategor${subcategories.filter(sub => sub.name.trim()).length === 1 ? 'y' : 'ies'}`}
        </button>
      </div>
    </form>
  );
};

export default CategoryManagement; 