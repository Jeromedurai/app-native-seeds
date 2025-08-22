import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { PasswordResetRequest } from '../../types';
import { 
  validateEmail, 
  validateIndianPhoneNumber, 
  getErrorMessage 
} from '../../utils/auth';


const ForgotPassword: React.FC = () => {
  const { requestPasswordReset, loading } = useAppContext();

  // Form state
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    method: 'email' as 'email' | 'sms'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resetToken, setResetToken] = useState<string>('');

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-detect method based on input
    if (name === 'emailOrPhone') {
      const isEmail = value.includes('@');
      setFormData(prev => ({
        ...prev,
        method: isEmail ? 'email' : 'sms'
      }));
    }

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
    validateField(field, formData[field as keyof typeof formData]);
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
    }

    setErrors(prev => ({
      ...prev,
      [field]: error
    }));

    return !error;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateField('emailOrPhone', formData.emailOrPhone)) {
      setTouched({ emailOrPhone: true });
      return;
    }

    setIsSubmitting(true);
    try {
      const resetData: PasswordResetRequest = {
        emailOrPhone: formData.emailOrPhone,
        method: formData.method
      };

      const response = await requestPasswordReset(resetData);
      
      // Extract token from demo message (in real app, token would be sent via email/SMS)
      const tokenMatch = response.message.match(/Reset token \(for demo\): (\w+)/);
      if (tokenMatch) {
        setResetToken(tokenMatch[1]);
      }
      
      setIsSubmitted(true);
    } catch (error) {
      setErrors({
        submit: getErrorMessage(error instanceof Error ? error.message : 'Failed to send reset instructions')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <Link to="/" className="inline-block">
              <span className="text-3xl font-bold text-green-600">Himalaya Seeds</span>
            </Link>
            <div className="mt-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Check your {formData.method === 'email' ? 'email' : 'phone'}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                We've sent password reset instructions to{' '}
                <span className="font-medium">{formData.emailOrPhone}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
            <div className="space-y-6">
              {/* Demo Reset Token */}
              {resetToken && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Mode</h3>
                  <p className="text-xs text-blue-700 mb-3">
                    Use this token to reset your password:
                  </p>
                  <div className="bg-white border border-blue-200 rounded p-2 text-center">
                    <code className="text-sm font-mono text-blue-800">{resetToken}</code>
                  </div>
                </div>
              )}

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Didn't receive the {formData.method === 'email' ? 'email' : 'message'}?
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-green-600 hover:text-green-500 font-medium text-sm"
                >
                  Try again
                </button>
              </div>

              <div className="text-center">
                <Link
                  to="/reset-password"
                  state={{ token: resetToken, emailOrPhone: formData.emailOrPhone }}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  Continue to Reset Password
                </Link>
              </div>

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-green-600 hover:text-green-500 font-medium text-sm"
                >
                  ← Back to sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 min-h-[80vh]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <span className="text-3xl font-bold text-green-600">Himalaya Seeds</span>
          </Link>
          <h2 className="mt-6 text-2xl sm:text-3xl font-bold text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            No worries! Enter your email or phone number and we'll send you reset instructions.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
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

            {/* Method Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How would you like to receive reset instructions?
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="method"
                    value="email"
                    checked={formData.method === 'email'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Email (recommended)
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="method"
                    value="sms"
                    checked={formData.method === 'sms'}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    SMS text message
                  </span>
                </label>
              </div>
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
                    Sending instructions...
                  </>
                ) : (
                  'Send reset instructions'
                )}
              </button>
            </div>

            {/* Back to Login */}
            <div className="text-center">
              <Link
                to="/login"
                className="text-green-600 hover:text-green-500 font-medium text-sm"
              >
                ← Back to sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 