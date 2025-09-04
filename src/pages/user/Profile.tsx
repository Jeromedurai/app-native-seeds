import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Shield, Calendar, CheckCircle, XCircle, AlertCircle, Edit3, Camera, Settings, LogOut } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EditProfileModal from '../../components/user/EditProfileModal';
import ChangePasswordModal from '../../components/user/ChangePasswordModal';

const Profile: React.FC = () => {
  const { user, requestVerification, logout } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');
  
  // Modal states
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  // Handle messages from navigation state
  useEffect(() => {
    const state = location.state as { message?: string; requirePhone?: boolean } | null;
    if (state?.message) {
      setMessage(state.message);
      setMessageType('info');
      // Clear the state
      navigate('/profile', { replace: true });
    }
  }, [location.state, navigate]);

  const handleVerificationRequest = async (method: 'email' | 'phone') => {
    if (!user) return;
    
    const contact = method === 'email' ? user.email : user.phone;
    if (!contact) {
      setMessage(`Please add a ${method} to your profile first`);
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    try {
      await requestVerification({ type: method, value: contact });
      navigate('/email-verification', {
        state: {
          method,
          contact,
          fromRegister: false
        }
      });
    } catch (error: any) {
      setMessage(error.message || `Failed to send ${method} verification`);
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { state: { message: 'You have been logged out successfully' } });
    } catch (error) {
      console.error('Logout error:', error);
      // Still navigate to login even if logout API fails
      navigate('/login', { state: { message: 'You have been logged out' } });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section with User Info */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="relative bg-gradient-to-r from-green-600 to-green-700 px-8 py-12">
            <div className="flex items-center space-x-6">
              {/* Profile Avatar */}
              <div className="relative">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-12 h-12 text-green-600" />
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>
              
              {/* User Details */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                <p className="text-green-100 text-lg">{user.email}</p>
                <div className="flex items-center mt-2 text-green-100">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">Member since July 23, 2025</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => setShowEditProfileModal(true)}
                  className="flex items-center px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
              </div>
            </div>

        {/* Message Alert */}
            {message && (
          <div className={`mb-8 p-4 rounded-xl border-l-4 ${
            messageType === 'success' ? 'bg-green-50 border-green-400 text-green-700' :
            messageType === 'error' ? 'bg-red-50 border-red-400 text-red-700' :
            'bg-blue-50 border-blue-400 text-blue-700'
              }`}>
                <div className="flex items-center">
                  {messageType === 'success' ? (
                <CheckCircle className="h-5 w-5 mr-3" />
                  ) : messageType === 'error' ? (
                <XCircle className="h-5 w-5 mr-3" />
                  ) : (
                <AlertCircle className="h-5 w-5 mr-3" />
                  )}
              <p className="font-medium">{message}</p>
                </div>
              </div>
            )}

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Basic Information Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
                <button 
                  onClick={() => setShowEditProfileModal(true)}
                  className="text-green-600 hover:text-green-700 font-medium flex items-center"
                >
                  <Edit3 className="w-4 h-4 mr-1" />
                  Edit
                </button>
              </div>
              
                <div className="space-y-6">
                {/* Name */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-lg font-semibold text-gray-900">{user.name}</p>
                  </div>
                </div>
                
                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-500">Email Address</label>
                    <p className="text-lg font-semibold text-gray-900">{user.email}</p>
                    <div className="flex items-center mt-1">
                      {user.emailVerified ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Unverified
                        </span>
                      )}
                    </div>
                        </div>
                      </div>

                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Phone className="w-6 h-6 text-purple-600" />
                  </div>
                        <div className="flex-1">
                    <label className="text-sm font-medium text-gray-500">Phone Number</label>
                    {user.phone ? (
                      <>
                        <p className="text-lg font-semibold text-gray-900">{user.phone}</p>
                        <div className="flex items-center mt-1">
                          {user.phoneVerified ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              Unverified
                            </span>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-400">Not provided</p>
                        <button className="text-green-600 hover:text-green-700 text-sm font-medium mt-1">
                          Add Phone Number
                              </button>
                      </>
                            )}
                          </div>
                        </div>
                    </div>
                  </div>
                </div>

          {/* Account Security Card */}
                  <div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Account Security</h2>
                <Settings className="w-5 h-5 text-gray-400" />
                        </div>
                        
              <div className="space-y-6">
                {/* Email Verification */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">Email Verification</span>
                            {user.emailVerified ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  {!user.emailVerified && (
                    <button
                      onClick={() => handleVerificationRequest('email')}
                      disabled={isLoading}
                      className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm font-medium"
                    >
                      {isLoading ? 'Sending...' : 'Verify Email'}
                    </button>
                            )}
                          </div>
                          
                {/* Phone Verification */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">Phone Verification</span>
                            {user.phone ? (
                              user.phoneVerified ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                              )
                            ) : (
                      <AlertCircle className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                  {user.phone && !user.phoneVerified && (
                    <button
                      onClick={() => handleVerificationRequest('phone')}
                      disabled={isLoading}
                      className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm font-medium"
                    >
                      {isLoading ? 'Sending...' : 'Verify Phone'}
                    </button>
                  )}
                  {!user.phone && (
                    <p className="text-xs text-gray-500">Add a phone number to enable verification</p>
                  )}
                      </div>

                {/* Security Score */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">Security Score</span>
                    <span className="text-sm font-bold text-green-600">85%</span>
                      </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{width: '85%'}}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Your account is well protected</p>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setShowChangePasswordModal(true)}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <Shield className="w-5 h-5 text-blue-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Change Password</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-green-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Update Email</span>
                  </div>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-purple-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Update Phone</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security Tips */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Security Tips</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Strong Password</h4>
                <p className="text-sm text-gray-600">Use a unique, strong password for your account</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Verify Contacts</h4>
                <p className="text-sm text-gray-600">Keep your email and phone verified for security</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Regular Updates</h4>
                <p className="text-sm text-gray-600">Keep your profile information up to date</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        <EditProfileModal
          isOpen={showEditProfileModal}
          onClose={() => setShowEditProfileModal(false)}
        />

        <ChangePasswordModal
          isOpen={showChangePasswordModal}
          onClose={() => setShowChangePasswordModal(false)}
        />
      </div>
    );
};

export default Profile; 