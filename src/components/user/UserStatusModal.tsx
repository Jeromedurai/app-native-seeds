import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  role: string;
}

interface UserStatusModalProps {
  user: User;
  onClose: () => void;
  onUpdate: (userId: string, newStatus: 'active' | 'inactive') => void;
}

const UserStatusModal: React.FC<UserStatusModalProps> = ({ user, onClose, onUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState<'active' | 'inactive'>(user.status === 'pending' ? 'active' : user.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      onUpdate(user.id, selectedStatus);
    } catch (error) {
      console.error('Error updating user status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'inactive':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    }
  };

  // const getStatusDescription = (status: string) => {
  //   switch (status) {
  //     case 'active':
  //       return 'User can access the platform and perform all allowed actions based on their role.';
  //     case 'inactive':
  //       return 'User cannot access the platform. They will be logged out if currently active.';
  //     default:
  //       return 'User status is pending approval.';
  //   }
  // }; // Reserved for future use

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Update User Status</h3>
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
                <p className="text-sm text-gray-500 capitalize">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Status
            </label>
            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
              {getStatusIcon(user.status)}
              <span className="text-sm font-medium text-gray-900 capitalize">{user.status}</span>
            </div>
          </div>

          {/* Status Selection */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                New Status
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    checked={selectedStatus === 'active'}
                    onChange={(e) => setSelectedStatus(e.target.value as 'active' | 'inactive')}
                    className="text-green-600 focus:ring-green-500"
                  />
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">Active</p>
                      <p className="text-sm text-gray-500">User can access the platform</p>
                    </div>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="status"
                    value="inactive"
                    checked={selectedStatus === 'inactive'}
                    onChange={(e) => setSelectedStatus(e.target.value as 'active' | 'inactive')}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="font-medium text-gray-900">Inactive</p>
                      <p className="text-sm text-gray-500">User cannot access the platform</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Warning Message */}
            {selectedStatus === 'inactive' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <p className="text-sm text-red-800">
                    <strong>Warning:</strong> This will immediately log out the user if they are currently active.
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating || selectedStatus === user.status}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserStatusModal; 