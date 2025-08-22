import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { calculateCartItemCount } from '../../utils';
import { generateRoutePath } from '../../services/mockData';


interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, cart, logout, menuItems } = useAppContext();
  const location = useLocation();
  const cartItemCount = calculateCartItemCount(cart);
  
  // Dropdown state management
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredDropdown, setHoveredDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        setHoveredDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleDropdown = (dropdown: string) => {
    if (activeDropdown === dropdown) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdown);
    }
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
    setHoveredDropdown(null);
  };

  const handleDropdownHover = (dropdown: string) => {
    // Clear any existing timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setHoveredDropdown(dropdown);
    setActiveDropdown(dropdown);
  };

  const handleDropdownLeave = () => {
    // Add a delay before closing to allow moving mouse to dropdown content
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredDropdown(null);
      setActiveDropdown(null);
    }, 150); // 150ms delay
  };

  const handleDropdownContentHover = () => {
    // Clear timeout when hovering over dropdown content
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleDropdownContentLeave = () => {
    // Add delay when leaving dropdown content
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredDropdown(null);
      setActiveDropdown(null);
    }, 100); // 100ms delay
  };

  const handleIconHover = (dropdown: string) => {
    // Clear any existing timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    // Immediate dropdown show
    setHoveredDropdown(dropdown);
    setActiveDropdown(dropdown);
  };

  const handleTextHover = (dropdown: string) => {
    // Clear any existing timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    // Immediate dropdown show
    setHoveredDropdown(dropdown);
    setActiveDropdown(dropdown);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  // Generate route path for menu items
  const getMenuRoute = (menuName: string, categoryName?: string) => {
    if (menuName.toLowerCase() === 'home') {
      return '/';
    }
    if (menuName.toLowerCase() === 'contact us') {
      return '/contact';
    }
    return generateRoutePath(menuName, categoryName);
  };

  // Check if current path matches menu/category
  const isMenuActive = (menuName: string, categoryName?: string) => {
    const route = getMenuRoute(menuName, categoryName);
    return isActive(route);
  };

  // Check if any submenu item is active
  const isSubmenuActive = (menuName: string, categories?: any[]) => {
    if (!categories) return false;
    return categories.some(category => 
      category.active && isMenuActive(menuName, category.category)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50" ref={dropdownRef}>
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-xl sm:text-2xl font-bold text-green-600 leading-none">
                Himalaya Seeds
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {menuItems.map((menuItem) => {
                if (!menuItem.active) return null;
                
                const menuRoute = getMenuRoute(menuItem.menuName);
                const hasActiveSubmenu = isSubmenuActive(menuItem.menuName, menuItem.category);

                if (menuItem.subMenu && menuItem.category && menuItem.category.length > 0) {
                  // Dropdown menu
                  return (
                    <div key={menuItem.menuId} className="relative">
                      <button
                        onClick={() => toggleDropdown(`menu-${menuItem.menuId}`)}
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          hasActiveSubmenu
                            ? 'text-green-600 bg-green-50' 
                            : 'text-gray-700 hover:text-green-600'
                        }`}
                      >
                        {menuItem.menuName}
                        <svg
                          className={`ml-1 h-4 w-4 transition-transform ${
                            activeDropdown === `menu-${menuItem.menuId}` ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {activeDropdown === `menu-${menuItem.menuId}` && (
                        <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                          <div className="py-1">
                            {menuItem.category
                              .filter(category => category.active)
                              .map((category) => {
                                const categoryRoute = getMenuRoute(menuItem.menuName, category.category);
                                return (
                                  <Link
                                    key={category.categoryId}
                                    to={categoryRoute}
                                    onClick={closeDropdown}
                                    className={`block px-4 py-2 text-sm transition-colors ${
                                      isActive(categoryRoute)
                                        ? 'text-green-600 bg-green-50'
                                        : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                                    }`}
                                  >
                                    {category.category}
                                  </Link>
                                );
                              })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                } else {
                  // Regular menu item
                  return (
                    <Link
                      key={menuItem.menuId}
                      to={menuRoute}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive(menuRoute) 
                          ? 'text-green-600 bg-green-50' 
                          : 'text-gray-700 hover:text-green-600'
                      }`}
                    >
                      {menuItem.menuName}
                    </Link>
                  );
                }
              })}
            </nav>

            {/* Right side - Profile, Wishlist, and Bag Icons */}
            <div className="flex items-center space-x-3 md:space-x-6">
              {/* Mobile only - Cart Icon */}
              <div className="md:hidden flex items-center nav-icon">
                <Link
                  to="/cart"
                  className="relative p-2 text-gray-700 hover:text-green-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              </div>

              {/* Desktop Icons */}
              <div className="hidden md:flex items-center space-x-6">
                {/* Profile Icon */}
                <div className="flex flex-col items-center relative nav-icon">
                  {user ? (
                    <>
                      <button
                        onClick={() => toggleDropdown('user-menu')}
                        onMouseEnter={() => handleIconHover('user-menu')}
                        onMouseLeave={handleDropdownLeave}
                        className="flex items-center justify-center w-7 h-7 text-gray-900 transition-colors relative dropdown-trigger"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </button>
                      <span 
                        className="text-xs text-gray-900 mt-0.5 dropdown-label"
                        onMouseEnter={() => handleTextHover('user-menu')}
                        onMouseLeave={handleDropdownLeave}
                      >
                        Profile
                      </span>
                      
                      {/* User Dropdown Menu */}
                      <div 
                        className={`absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 dropdown-menu ${activeDropdown === 'user-menu' ? 'show' : ''}`}
                        onMouseEnter={handleDropdownContentHover}
                        onMouseLeave={handleDropdownContentLeave}
                      >
                        <div className="py-1">
                          {/* Profile Link */}
                          <Link
                            to="/profile"
                            onClick={closeDropdown}
                            className={`flex items-center px-4 py-2 text-sm transition-colors dropdown-menu-item ${
                              isActive('/profile')
                                ? 'text-green-600 bg-green-50'
                                : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                            }`}
                          >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Profile
                          </Link>
                          
                          {/* My Orders Link */}
                          <Link
                            to="/my-orders"
                            onClick={closeDropdown}
                            className={`flex items-center px-4 py-2 text-sm transition-colors dropdown-menu-item ${
                              isActive('/my-orders')
                                ? 'text-green-600 bg-green-50'
                                : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                            }`}
                          >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            My Orders
                          </Link>
                          
                          {/* Logout */}
                          <button
                            onClick={() => {
                              logout();
                              closeDropdown();
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors dropdown-menu-item"
                          >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      onClick={closeDropdown}
                      className="flex items-center justify-center w-7 h-7 text-gray-900 hover:text-gray-600 transition-colors relative"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </Link>
                  )}
                  {!user && <span className="text-xs text-gray-900 mt-0.5">Login</span>}
                </div>

                {/* Wishlist Icon */}
                <div className="flex flex-col items-center nav-icon">
                  <Link
                    to="/wishlist"
                    onClick={closeDropdown}
                    className="flex items-center justify-center w-7 h-7 text-gray-900 transition-colors relative dropdown-trigger"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {/* Wishlist badge - you can add wishlist count here */}
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      2
                    </span>
                  </Link>
                  <span className="text-xs text-gray-900 mt-0.5 dropdown-label">Wishlist</span>
                </div>

                {/* Bag Icon */}
                <div className="flex flex-col items-center nav-icon">
                  <Link
                    to="/cart"
                    onClick={closeDropdown}
                    className="flex items-center justify-center w-7 h-7 text-gray-900 transition-colors relative dropdown-trigger"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                  <span className="text-xs text-gray-900 mt-0.5 dropdown-label">Bag</span>
                </div>

                {/* Admin Menu (only for admin users) */}
                {user && (user.role === 'admin' || user.role === 'executive') && (
                  <div className="flex flex-col items-center relative nav-icon">
                    <button
                      onClick={() => toggleDropdown('admin-menu')}
                      onMouseEnter={() => handleIconHover('admin-menu')}
                      onMouseLeave={handleDropdownLeave}
                      className="flex items-center justify-center w-7 h-7 text-gray-900 transition-colors dropdown-trigger"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                    <span 
                      className="text-xs text-gray-900 mt-0.5 dropdown-label"
                      onMouseEnter={() => handleTextHover('admin-menu')}
                      onMouseLeave={handleDropdownLeave}
                    >
                      Admin
                    </span>
                    
                    {/* Admin Dropdown Menu */}
                    <div 
                      className={`absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50 dropdown-menu ${activeDropdown === 'admin-menu' ? 'show' : ''}`}
                      onMouseEnter={handleDropdownContentHover}
                      onMouseLeave={handleDropdownContentLeave}
                    >
                      <div className="py-1">
                        {/* Product Management */}
                        <Link
                          to="/admin/products"
                          onClick={closeDropdown}
                          className={`flex items-center px-4 py-2 text-sm transition-colors dropdown-menu-item ${
                            isActive('/admin/products')
                              ? 'text-green-600 bg-green-50'
                              : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                          }`}
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          Products
                        </Link>
                        
                        {/* Product Image Management */}
                        <Link
                          to="/admin/product-images"
                          onClick={closeDropdown}
                          className={`flex items-center px-4 py-2 text-sm transition-colors dropdown-menu-item ${
                            isActive('/admin/product-images')
                              ? 'text-green-600 bg-green-50'
                              : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                          }`}
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Product Images
                        </Link>
                        
                        {/* Order Management */}
                        <Link
                          to="/admin/orders"
                          onClick={closeDropdown}
                          className={`flex items-center px-4 py-2 text-sm transition-colors dropdown-menu-item ${
                            isActive('/admin/orders')
                              ? 'text-green-600 bg-green-50'
                              : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                          }`}
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                          </svg>
                          Orders
                        </Link>
                        
                        {/* User Management */}
                        <Link
                          to="/admin/users"
                          onClick={closeDropdown}
                          className={`flex items-center px-4 py-2 text-sm transition-colors dropdown-menu-item ${
                            isActive('/admin/users')
                              ? 'text-green-600 bg-green-50'
                              : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                          }`}
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                          Users
                        </Link>
                        
                        {/* Category Management */}
                        <Link
                          to="/admin/categories"
                          onClick={closeDropdown}
                          className={`flex items-center px-4 py-2 text-sm transition-colors dropdown-menu-item ${
                            isActive('/admin/categories')
                              ? 'text-green-600 bg-green-50'
                              : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                          }`}
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          Categories
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-gray-700 hover:text-green-600 focus:outline-none focus:text-green-600 p-2"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isMobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 bg-white">
              <div className="px-4 sm:px-6 py-3 space-y-1">
                {/* User Menu for Mobile */}
                {user ? (
                  <div className="border-b border-gray-200 pb-3 mb-3">
                    <div className="flex items-center space-x-3 px-3 py-2 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    
                    {/* User Actions */}
                    <div className="mt-2 space-y-1">
                      <Link
                        to="/profile"
                        onClick={closeMobileMenu}
                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </Link>
                      
                      <Link
                        to="/orders"
                        onClick={closeMobileMenu}
                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        My Orders
                      </Link>
                      
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={closeMobileMenu}
                          className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Admin Panel
                        </Link>
                      )}
                      
                      <button
                        onClick={logout}
                        className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-b border-gray-200 pb-3 mb-3">
                    <div className="flex space-x-3">
                      <Link
                        to="/login"
                        onClick={closeMobileMenu}
                        className="flex-1 text-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                      >
                        Login
                      </Link>
                      <Link
                        to="/register"
                        onClick={closeMobileMenu}
                        className="flex-1 text-center px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
                      >
                        Register
                      </Link>
                    </div>
                  </div>
                )}

                {/* Navigation Menu Items */}
                <div className="space-y-1">
                  {menuItems.map((menuItem) => {
                    if (!menuItem.active) return null;

                    const menuRoute = getMenuRoute(menuItem.menuName);

                    if (menuItem.subMenu && menuItem.category && menuItem.category.length > 0) {
                      // Mobile dropdown menu - matching desktop style
                      return (
                        <div key={menuItem.menuId} className="relative">
                          <button
                            onClick={() => toggleDropdown(`mobile-menu-${menuItem.menuId}`)}
                            className="w-full text-left px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors flex items-center justify-between rounded-md bg-white shadow-sm ring-1 ring-gray-200"
                          >
                            {menuItem.menuName}
                            <svg
                              className={`h-4 w-4 transition-transform ${
                                activeDropdown === `mobile-menu-${menuItem.menuId}` ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          
                          {activeDropdown === `mobile-menu-${menuItem.menuId}` && (
                            <div className="mt-1 w-full bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                              <div className="py-1">
                                {menuItem.category
                                  .filter(category => category.active)
                                  .map((category) => {
                                    const categoryRoute = getMenuRoute(menuItem.menuName, category.category);
                                    return (
                                      <Link
                                        key={category.categoryId}
                                        to={categoryRoute}
                                        onClick={closeMobileMenu}
                                        className={`block px-4 py-2 text-sm transition-colors ${
                                          isActive(categoryRoute)
                                            ? 'text-green-600 bg-green-50'
                                            : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                                        }`}
                                      >
                                        {category.category}
                                      </Link>
                                    );
                                  })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }
                    // Regular menu item - matching desktop dropdown style
                    return (
                      <Link
                        key={menuItem.menuId}
                        to={menuRoute}
                        onClick={closeMobileMenu}
                        className={`block px-3 py-2 text-sm font-medium transition-colors rounded-md bg-white shadow-sm ring-1 ring-gray-200 ${
                          isActive(menuRoute)
                            ? 'text-green-600 bg-green-50 ring-green-200'
                            : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                        }`}
                      >
                        {menuItem.menuName}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Himalaya Seeds</h3>
              <p className="text-gray-300 mb-4">
                Premium quality seeds for your garden. We provide the best varieties of vegetables, 
                fruits, and herbs to help you grow healthy and delicious produce.
              </p>
              <div className="flex space-x-4">
                <button type="button" className="text-gray-400 hover:text-white transition-colors" aria-label="Follow us on Twitter">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </button>
                <button type="button" className="text-gray-400 hover:text-white transition-colors" aria-label="Follow us on Facebook">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </button>
                <button type="button" className="text-gray-400 hover:text-white transition-colors" aria-label="Follow us on Pinterest">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.749.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.751-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z.017 0z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/shipping" className="text-gray-300 hover:text-white transition-colors">Shipping Info</Link></li>
                <li><Link to="/returns" className="text-gray-300 hover:text-white transition-colors">Returns</Link></li>
                <li><Link to="/faq" className="text-gray-300 hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li><Link to="/help" className="text-gray-300 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/track-order" className="text-gray-300 hover:text-white transition-colors">Track Order</Link></li>
                <li><Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-300">
              © 2024 Himalaya Seeds. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;