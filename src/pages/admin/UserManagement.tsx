import React, { useState, useEffect } from 'react';
import { Search, Edit, Shield, CheckCircle, XCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import UserStatusModal from '../../components/user/UserStatusModal';
import RolePermissionModal from '../../components/user/RolePermissionModal';


interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive' | 'pending';
  role: 'customer' | 'admin' | 'executive';
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  lastLogin?: string;
  avatar?: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

const UserManagement: React.FC = () => {
  const { user } = useAppContext();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [verificationFilter, setVerificationFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);

  // Mock roles data
  const roles: Role[] = [
    {
      id: '1',
      name: 'Customer',
      description: 'Regular customer with basic access',
      permissions: ['view_products', 'place_orders', 'view_own_orders']
    },
    {
      id: '2',
      name: 'Executive',
      description: 'Executive with business management access',
      permissions: ['view_products', 'place_orders', 'view_orders', 'manage_products', 'view_users', 'view_analytics', 'view_reports', 'manage_orders']
    },
    {
      id: '3',
      name: 'Admin',
      description: 'Full administrative access',
      permissions: ['view_products', 'place_orders', 'view_orders', 'manage_products', 'manage_users', 'manage_roles', 'view_analytics', 'manage_settings', 'manage_inventory', 'view_reports', 'manage_orders']
    }
  ];

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUsers: User[] = [
        {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+91 98765 43210',
          status: 'active',
          role: 'customer',
          emailVerified: true,
          phoneVerified: true,
          createdAt: '2024-01-15T10:30:00Z',
          lastLogin: '2024-05-20T14:30:00Z',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '+91 98765 43211',
          status: 'active',
          role: 'admin',
          emailVerified: true,
          phoneVerified: false,
          createdAt: '2024-02-10T09:15:00Z',
          lastLogin: '2024-05-21T11:45:00Z',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face'
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike.johnson@example.com',
          phone: '+91 98765 43212',
          status: 'inactive',
          role: 'customer',
          emailVerified: false,
          phoneVerified: false,
          createdAt: '2024-03-05T16:20:00Z',
          lastLogin: '2024-04-15T10:30:00Z'
        },
        {
          id: '4',
          name: 'Sarah Wilson',
          email: 'sarah.wilson@example.com',
          phone: '+91 98765 43213',
          status: 'pending',
          role: 'executive',
          emailVerified: true,
          phoneVerified: true,
          createdAt: '2024-05-01T12:00:00Z'
        },
        {
          id: '5',
          name: 'David Brown',
          email: 'david.brown@example.com',
          phone: '+91 98765 43214',
          status: 'active',
          role: 'customer',
          emailVerified: true,
          phoneVerified: true,
          createdAt: '2024-01-20T14:45:00Z',
          lastLogin: '2024-05-19T09:15:00Z'
        }
      ];
      
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setIsLoading(false);
    };

    loadUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (user.phone && user.phone.includes(searchQuery));
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesVerification = verificationFilter === 'all' || 
                                 (verificationFilter === 'verified' && user.emailVerified && user.phoneVerified) ||
                                 (verificationFilter === 'unverified' && (!user.emailVerified || !user.phoneVerified));
      
      return matchesSearch && matchesStatus && matchesRole && matchesVerification;
    });
    
    setFilteredUsers(filtered);
  }, [users, searchQuery, statusFilter, roleFilter, verificationFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'executive': return 'bg-blue-100 text-blue-800';
      case 'customer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusUpdate = (userId: string, newStatus: 'active' | 'inactive') => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
    setShowStatusModal(false);
    setSelectedUser(null);
  };

  const handleRoleUpdate = (userId: string, newRole: string, permissions: string[]) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, role: newRole as any } : user
      )
    );
    setShowRoleModal(false);
    setSelectedUser(null);
  };

  const handleVerificationToggle = (userId: string, type: 'email' | 'phone') => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? {
          ...user,
          [type === 'email' ? 'emailVerified' : 'phoneVerified']: !user[type === 'email' ? 'emailVerified' : 'phoneVerified']
        } : user
      )
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
        <p className="text-gray-600 mb-8">Manage users, roles, and permissions</p>

        {/* Search and Filter Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search users by name, email, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              {/* Role Filter */}
              <div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">All Roles</option>
                  <option value="customer">Customer</option>
                  <option value="executive">Executive</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {/* Additional Filters */}
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Verification:</span>
                <select
                  value={verificationFilter}
                  onChange={(e) => setVerificationFilter(e.target.value)}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">All</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500">
              {searchQuery || statusFilter !== 'all' || roleFilter !== 'all' || verificationFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'No users have been added yet'
              }
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Verification
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {user.avatar ? (
                              <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.name} />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                            {user.phone && (
                              <div className="text-sm text-gray-500">{user.phone}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleVerificationToggle(user.id, 'email')}
                            className={`p-1 rounded-full ${user.emailVerified ? 'text-green-600' : 'text-gray-400'}`}
                            title={user.emailVerified ? 'Email verified' : 'Email not verified'}
                          >
                            {user.emailVerified ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleVerificationToggle(user.id, 'phone')}
                            className={`p-1 rounded-full ${user.phoneVerified ? 'text-green-600' : 'text-gray-400'}`}
                            title={user.phoneVerified ? 'Phone verified' : 'Phone not verified'}
                          >
                            {user.phoneVerified ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowStatusModal(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Update Status"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowRoleModal(true);
                            }}
                            className="text-purple-600 hover:text-purple-900"
                            title="Manage Role & Permissions"
                          >
                            <Shield className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing 1 to {filteredUsers.length} of {filteredUsers.length} users
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg">1</button>
              <button className="p-2 border border-gray-300 rounded-lg text-gray-500 hover:bg-gray-50">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {showStatusModal && selectedUser && (
        <UserStatusModal
          user={selectedUser}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedUser(null);
          }}
          onUpdate={handleStatusUpdate}
        />
      )}

      {/* Role & Permission Modal */}
      {showRoleModal && selectedUser && (
        <RolePermissionModal
          user={selectedUser}
          roles={roles}
          onClose={() => {
            setShowRoleModal(false);
            setSelectedUser(null);
          }}
          onUpdate={handleRoleUpdate}
        />
      )}
    </div>
  );
};

export default UserManagement; 