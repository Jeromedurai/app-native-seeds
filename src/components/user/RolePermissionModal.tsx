import React, { useState } from 'react';
import { X, Shield, AlertTriangle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  status: string;
  role: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

interface RolePermissionModalProps {
  user: User;
  roles: Role[];
  onClose: () => void;
  onUpdate: (userId: string, newRole: string, permissions: string[]) => void;
}

const RolePermissionModal: React.FC<RolePermissionModalProps> = ({ user, roles, onClose, onUpdate }) => {
  const [selectedRole, setSelectedRole] = useState<string>(user.role);
  const [customPermissions, setCustomPermissions] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // All available permissions
  const allPermissions = [
    { id: 'view_products', name: 'View Products', description: 'Can browse and view product details' },
    { id: 'place_orders', name: 'Place Orders', description: 'Can create and place new orders' },
    { id: 'view_own_orders', name: 'View Own Orders', description: 'Can view their own order history' },
    { id: 'view_orders', name: 'View All Orders', description: 'Can view all orders in the system' },
    { id: 'manage_products', name: 'Manage Products', description: 'Can create, edit, and delete products' },
    { id: 'view_users', name: 'View Users', description: 'Can view user list and basic information' },
    { id: 'manage_users', name: 'Manage Users', description: 'Can update user status and basic information' },
    { id: 'manage_roles', name: 'Manage Roles', description: 'Can create, edit, and assign roles' },
    { id: 'view_analytics', name: 'View Analytics', description: 'Can access analytics and reports' },
    { id: 'manage_settings', name: 'Manage Settings', description: 'Can modify system settings' },
    { id: 'manage_inventory', name: 'Manage Inventory', description: 'Can manage inventory and stock levels' },
    { id: 'view_reports', name: 'View Reports', description: 'Can view business reports and analytics' },
    { id: 'manage_orders', name: 'Manage Orders', description: 'Can manage and process all orders' }
  ];

  // const currentRole = roles.find(role => role.name.toLowerCase() === user.role.toLowerCase()); // Reserved for future use
  const selectedRoleData = roles.find(role => role.id === selectedRole);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use custom permissions if any are selected, otherwise use role permissions
      const finalPermissions = customPermissions.length > 0 ? customPermissions : (selectedRoleData?.permissions || []);
      onUpdate(user.id, selectedRoleData?.name || selectedRole, finalPermissions);
    } catch (error) {
      console.error('Error updating user role:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePermissionToggle = (permissionId: string) => {
    setCustomPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(p => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  const isPermissionChecked = (permissionId: string) => {
    if (customPermissions.length > 0) {
      return customPermissions.includes(permissionId);
    }
    return selectedRoleData?.permissions.includes(permissionId) || false;
  };

  const getRoleColor = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'executive': return 'bg-blue-100 text-blue-800';
      case 'customer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Manage Role & Permissions</h3>
              <p className="text-sm text-gray-500">Assign roles and customize permissions for {user.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Role
                </label>
                <div className="space-y-3">
                  {roles.map((role) => (
                    <label key={role.id} className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="role"
                        value={role.id}
                        checked={selectedRole === role.id}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="mt-1 text-purple-600 focus:ring-purple-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Shield className="w-4 h-4 text-purple-600" />
                          <p className="font-medium text-gray-900">{role.name}</p>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{role.description}</p>
                        <div className="mt-2">
                          <p className="text-xs text-gray-500 font-medium">Default Permissions:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {role.permissions.map((permission) => (
                              <span key={permission} className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                                {permission.replace(/_/g, ' ')}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Permissions */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Permissions
                  </label>
                  {customPermissions.length > 0 && (
                    <span className="text-xs text-purple-600 font-medium">
                      Custom permissions enabled
                    </span>
                  )}
                </div>
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {allPermissions.map((permission) => (
                    <label key={permission.id} className="flex items-start space-x-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={isPermissionChecked(permission.id)}
                        onChange={() => handlePermissionToggle(permission.id)}
                        className="mt-1 text-purple-600 focus:ring-purple-500 rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{permission.name}</p>
                        <p className="text-xs text-gray-500">{permission.description}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Custom Permissions Notice */}
                {customPermissions.length > 0 && (
                  <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-purple-600" />
                      <p className="text-sm text-purple-800">
                        <strong>Custom permissions enabled.</strong> The selected permissions will override the role's default permissions.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Warning for Admin Role */}
            {selectedRoleData?.name.toLowerCase() === 'admin' && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Admin Role Warning</p>
                    <p className="text-sm text-red-700">
                      Admin users have full access to all system features. This includes sensitive operations like user management, system settings, and analytics.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? 'Updating...' : 'Update Role & Permissions'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RolePermissionModal; 