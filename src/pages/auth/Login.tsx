import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { LoginCredentials } from '../../types';
import SocialLoginButtons from '../../components/user/SocialLoginButtons';

import { 
  validateEmail, 
  validateIndianPhoneNumber, 
  getErrorMessage,
  // socialLoginProviders // Reserved for future use 
} from '../../utils/auth';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, user } = useAppContext();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      // Check for returnUrl in query params first, then location state, then default to home
      const urlParams = new URLSearchParams(location.search);
      const returnUrl = urlParams.get('returnUrl');
      const from = returnUrl || location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  // Form state
  const [formData, setFormData] = useState<LoginCredentials>({
    emailOrPhone: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle field blur for validation
  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field as keyof LoginCredentials]);
  };

  // Validate individual field
  const validateField = (field: string, value: any) => {
    let error = '';

    switch (field) {
      case 'emailOrPhone':
        if (!value) {
          error = 'Email or phone number is required';
        } else {
          // Check if it's email or phone
          const isEmail = value.includes('@');
          if (isEmail) {
            if (!validateEmail(value)) {
              error = 'Please enter a valid email address';
            }
          } else {
            const phoneValidation = validateIndianPhoneNumber(value);
            if (!phoneValidation.isValid) {
              error = 'Please enter a valid Indian phone number';
            }
          }
        }
        break;
      case 'password':
        if (!value) {
          error = 'Password is required';
        } else if (value.length < 6) {
          error = 'Password must be at least 6 characters';
        }
        break;
    }

    setErrors(prev => ({
      ...prev,
      [field]: error
    }));

    return !error;
  };

  // Validate entire form
  const validateForm = (): boolean => {
    const emailOrPhoneValid = validateField('emailOrPhone', formData.emailOrPhone);
    const passwordValid = validateField('password', formData.password);
    
    setTouched({
      emailOrPhone: true,
      password: true
    });

    return emailOrPhoneValid && passwordValid;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await login(formData);
      
      // Handle immediate redirect after successful login
      const urlParams = new URLSearchParams(location.search);
      const returnUrl = urlParams.get('returnUrl');
      const from = returnUrl || location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      setErrors({
        submit: getErrorMessage(error instanceof Error ? error.message : 'Login failed')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle social login - Reserved for future use
  // const handleSocialLogin = async (providerId: 'google' | 'facebook' | 'apple') => {
  //   try {
  //     // In a real app, this would integrate with the social provider's SDK
  //     alert(`${providerId} login would be implemented here`);
  //   } catch (error) {
  //     setErrors({
  //       submit: `${providerId} login failed. Please try again.`
  //   });
  //   }
  // };

  return (
    <div className="bg-gray-50 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 min-h-[80vh]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <span className="text-3xl font-bold text-green-600">Himalaya Seeds</span>
          </Link>
          <h2 className="mt-6 text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {new URLSearchParams(location.search).get('returnUrl') 
              ? 'Sign in to add items to your cart and continue shopping'
              : 'Sign in to your account to continue shopping'
            }
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
          {/* Login Form */}
          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            {/* Email or Phone */}
            <div>
              <label htmlFor="emailOrPhone" className="block text-sm font-medium text-gray-700">
                Email or Phone Number
              </label>
              <div className="mt-1">
                <input
                  id="emailOrPhone"
                  name="emailOrPhone"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.emailOrPhone}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('emailOrPhone')}
                  placeholder="Enter email or phone number"
                  className={`appearance-none block w-full px-3 py-3 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 text-base ${
                    errors.emailOrPhone && touched.emailOrPhone
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {errors.emailOrPhone && touched.emailOrPhone && (
                  <p className="mt-1 text-sm text-red-600">{errors.emailOrPhone}</p>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('password')}
                  placeholder="Enter your password"
                  className={`appearance-none block w-full px-3 py-3 pr-10 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 text-base ${
                    errors.password && touched.password
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg
                    className="h-5 w-5 text-gray-400 hover:text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    )}
                  </svg>
                </button>
                {errors.password && touched.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <Link
                to="/forgot-password"
                className="text-sm text-green-600 hover:text-green-500 font-medium"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting || loading.isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting || loading.isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>
          </form>

          {/* Social Login */}
          <SocialLoginButtons mode="login" className="mt-6" />

          {/* Register Link */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">New to Himalaya Seeds?</span>
              </div>
            </div>
            <div className="mt-3">
              <Link
                to={`/register${location.search}`}
                className="w-full flex justify-center py-3 px-4 border border-green-600 rounded-lg shadow-sm text-base font-medium text-green-600 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                Create an account
              </Link>
            </div>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Credentials</h3>
          <div className="text-xs text-blue-700 space-y-1">
            <p><strong>Email:</strong> demo@himalayaseeds.com</p>
            <p><strong>Password:</strong> password123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 