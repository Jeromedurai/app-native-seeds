// Permission constants
export const PERMISSIONS = {
  VIEW_PRODUCTS: 'view_products',
  PLACE_ORDERS: 'place_orders',
  VIEW_OWN_ORDERS: 'view_own_orders',
  VIEW_ORDERS: 'view_orders',
  MANAGE_PRODUCTS: 'manage_products',
  VIEW_USERS: 'view_users',
  MANAGE_USERS: 'manage_users',
  MANAGE_ROLES: 'manage_roles',
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_SETTINGS: 'manage_settings',
  MANAGE_INVENTORY: 'manage_inventory',
  VIEW_REPORTS: 'view_reports',
  MANAGE_ORDERS: 'manage_orders'
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Role definitions with their default permissions
export const ROLES = {
  CUSTOMER: {
    name: 'customer',
    permissions: [
      PERMISSIONS.VIEW_PRODUCTS,
      PERMISSIONS.PLACE_ORDERS,
      PERMISSIONS.VIEW_OWN_ORDERS
    ] as Permission[]
  },
  EXECUTIVE: {
    name: 'executive',
    permissions: [
      PERMISSIONS.VIEW_PRODUCTS,
      PERMISSIONS.PLACE_ORDERS,
      PERMISSIONS.VIEW_ORDERS,
      PERMISSIONS.MANAGE_PRODUCTS,
      PERMISSIONS.VIEW_USERS,
      PERMISSIONS.VIEW_ANALYTICS,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.MANAGE_ORDERS
    ] as Permission[]
  },
  ADMIN: {
    name: 'admin',
    permissions: [
      PERMISSIONS.VIEW_PRODUCTS,
      PERMISSIONS.PLACE_ORDERS,
      PERMISSIONS.VIEW_ORDERS,
      PERMISSIONS.MANAGE_PRODUCTS,
      PERMISSIONS.MANAGE_USERS,
      PERMISSIONS.MANAGE_ROLES,
      PERMISSIONS.VIEW_ANALYTICS,
      PERMISSIONS.MANAGE_SETTINGS,
      PERMISSIONS.MANAGE_INVENTORY,
      PERMISSIONS.VIEW_REPORTS,
      PERMISSIONS.MANAGE_ORDERS
    ] as Permission[]
  }
} as const;

// Permission checking utility
export const hasPermission = (userRole: string, requiredPermission: Permission): boolean => {
  const role = Object.values(ROLES).find(r => r.name === userRole.toLowerCase());
  return role?.permissions.includes(requiredPermission) || false;
};

// Role checking utility
export const hasRole = (userRole: string, requiredRole: string): boolean => {
  return userRole.toLowerCase() === requiredRole.toLowerCase();
};

// Check if user has any of the required permissions
export const hasAnyPermission = (userRole: string, requiredPermissions: Permission[]): boolean => {
  return requiredPermissions.some(permission => hasPermission(userRole, permission));
};

// Check if user has all required permissions
export const hasAllPermissions = (userRole: string, requiredPermissions: Permission[]): boolean => {
  return requiredPermissions.every(permission => hasPermission(userRole, permission));
};

// Get all permissions for a role
export const getRolePermissions = (roleName: string): Permission[] => {
  const role = Object.values(ROLES).find(r => r.name === roleName.toLowerCase());
  return role?.permissions || [];
};

// Check if user can access admin features
export const canAccessAdmin = (userRole: string): boolean => {
  return hasRole(userRole, 'admin') || hasRole(userRole, 'executive');
};

// Check if user can manage users
export const canManageUsers = (userRole: string): boolean => {
  return hasPermission(userRole, PERMISSIONS.MANAGE_USERS);
};

// Check if user can manage products
export const canManageProducts = (userRole: string): boolean => {
  return hasPermission(userRole, PERMISSIONS.MANAGE_PRODUCTS);
};

// Check if user can view analytics
export const canViewAnalytics = (userRole: string): boolean => {
  return hasPermission(userRole, PERMISSIONS.VIEW_ANALYTICS);
};

// Permission descriptions for UI
export const PERMISSION_DESCRIPTIONS = {
  [PERMISSIONS.VIEW_PRODUCTS]: 'Can browse and view product details',
  [PERMISSIONS.PLACE_ORDERS]: 'Can create and place new orders',
  [PERMISSIONS.VIEW_OWN_ORDERS]: 'Can view their own order history',
  [PERMISSIONS.VIEW_ORDERS]: 'Can view all orders in the system',
  [PERMISSIONS.MANAGE_PRODUCTS]: 'Can create, edit, and delete products',
  [PERMISSIONS.VIEW_USERS]: 'Can view user list and basic information',
  [PERMISSIONS.MANAGE_USERS]: 'Can update user status and basic information',
  [PERMISSIONS.MANAGE_ROLES]: 'Can create, edit, and assign roles',
  [PERMISSIONS.VIEW_ANALYTICS]: 'Can access analytics and reports',
  [PERMISSIONS.MANAGE_SETTINGS]: 'Can modify system settings',
  [PERMISSIONS.MANAGE_INVENTORY]: 'Can manage inventory and stock levels',
  [PERMISSIONS.VIEW_REPORTS]: 'Can view business reports and analytics',
  [PERMISSIONS.MANAGE_ORDERS]: 'Can manage and process all orders'
} as const;

// Role descriptions for UI
export const ROLE_DESCRIPTIONS = {
  [ROLES.CUSTOMER.name]: 'Regular customer with basic access',
  [ROLES.EXECUTIVE.name]: 'Executive with business management access',
  [ROLES.ADMIN.name]: 'Full administrative access'
} as const; 