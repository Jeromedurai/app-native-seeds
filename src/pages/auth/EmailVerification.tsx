import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Phone, Clock, CheckCircle, RotateCcw } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';


const EmailVerification: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { confirmVerification, requestVerification } = useAppContext();
  
  // Get verification method and contact from navigation state
  const state = location.state as { method: 'email' | 'phone'; contact: string; fromRegister?: boolean } | null;
  const method = state?.method || 'email';
  const contact = state?.contact || '';
  const fromRegister = state?.fromRegister || false;

  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if no contact info
  useEffect(() => {
    if (!contact) {
      navigate('/login');
    }
  }, [contact, navigate]);

  // Timer for resend functionality
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (value && index === 5 && newCode.every(digit => digit)) {
      handleVerification(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerification = async (code?: string) => {
    const codeToVerify = code || verificationCode.join('');
    if (codeToVerify.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await confirmVerification({
        type: method,
        value: contact,
        code: codeToVerify
      });

      setSuccess(true);
      
      setTimeout(() => {
        if (fromRegister) {
          navigate('/login', { 
            state: { 
              message: 'Account verified successfully! Please log in.',
              email: method === 'email' ? contact : undefined 
            }
          });
        } else {
          navigate('/profile', { 
            state: { message: `${method === 'email' ? 'Email' : 'Phone'} verified successfully!` }
          });
        }
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Verification failed. Please try again.');
      setVerificationCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setError('');

    try {
      await requestVerification({ type: method, value: contact });
      setTimeLeft(300);
      setCanResend(false);
      setVerificationCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      setError(error.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (success) {
    return (
      <div className="bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 min-h-[80vh]">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              <h2 className="mt-4 text-2xl font-bold text-gray-900">
                Verification Successful!
              </h2>
              <p className="mt-2 text-gray-600">
                Your {method === 'email' ? 'email' : 'phone number'} has been verified.
              </p>
              <div className="mt-4">
                <LoadingSpinner size="sm" />
                <p className="mt-2 text-sm text-gray-500">Redirecting...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 min-h-[80vh]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
            {method === 'email' ? (
              <Mail className="h-6 w-6 text-blue-600" />
            ) : (
              <Phone className="h-6 w-6 text-blue-600" />
            )}
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            Verify Your {method === 'email' ? 'Email' : 'Phone'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a 6-digit verification code to
          </p>
          <p className="font-medium text-gray-900">
            {method === 'email' ? contact : `+91 ${contact.replace(/(\d{5})(\d{5})/, '$1 $2')}`}
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={(e) => { e.preventDefault(); handleVerification(); }}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                Enter Verification Code
              </label>
              <div className="flex justify-center space-x-2 mb-6">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                ))}
              </div>
              
              {/* Demo code hint */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-700 text-center">
                  <span className="font-medium">Demo Code:</span> 123456
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-red-700 text-center">{error}</p>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading || verificationCode.some(digit => !digit)}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  'Verify Code'
                )}
              </button>
            </div>

            <div className="mt-6 text-center">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-4">
                <Clock className="h-4 w-4" />
                <span>Code expires in {formatTime(timeLeft)}</span>
              </div>

              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isResending}
                  className="inline-flex items-center space-x-2 text-sm font-medium text-blue-600 hover:text-blue-500 disabled:opacity-50"
                >
                                     {isResending ? (
                     <LoadingSpinner size="sm" />
                   ) : (
                    <RotateCcw className="h-4 w-4" />
                  )}
                  <span>{isResending ? 'Sending...' : 'Resend Code'}</span>
                </button>
              ) : (
                <p className="text-sm text-gray-500">
                  Didn't receive the code? You can resend in {formatTime(timeLeft)}
                </p>
              )}
            </div>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => navigate(fromRegister ? '/register' : '/profile')}
                className="text-sm font-medium text-gray-600 hover:text-gray-500"
              >
                ← Back to {fromRegister ? 'Registration' : 'Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification; 