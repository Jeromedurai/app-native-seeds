import { PasswordStrength, PhoneNumberValidation, AuthValidation } from '../types';

// Indian phone number validation
export const validateIndianPhoneNumber = (phone: string): PhoneNumberValidation => {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Check if it's a valid Indian number
  // Indian mobile numbers: +91 followed by 10 digits starting with 6,7,8,9
  const indianMobileRegex = /^(\+91)?[6-9]\d{9}$/;
  
  if (indianMobileRegex.test(cleaned)) {
    const withCountryCode = cleaned.startsWith('+91') ? cleaned : `+91${cleaned}`;
    const nationalNumber = withCountryCode.substring(3);
    
    return {
      isValid: true,
      formatted: `+91 ${nationalNumber.substring(0, 5)} ${nationalNumber.substring(5)}`,
      countryCode: '+91',
      nationalNumber
    };
  }

  return {
    isValid: false,
    formatted: phone,
    countryCode: '',
    nationalNumber: ''
  };
};

// Format phone number as user types
export const formatPhoneNumberInput = (value: string): string => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  
  // Don't format if empty
  if (!digits) return '';
  
  // Handle country code
  if (digits.length <= 2) {
    return digits;
  }
  
  // Add +91 prefix if not present
  if (!digits.startsWith('91')) {
    const formatted = `91${digits}`;
    if (formatted.length <= 12) {
      return formatted.substring(0, 2) + ' ' + formatted.substring(2, 7) + ' ' + formatted.substring(7, 12);
    }
    return formatted.substring(0, 12);
  }
  
  // Format: 91 XXXXX XXXXX
  if (digits.length <= 7) {
    return digits.substring(0, 2) + ' ' + digits.substring(2);
  } else {
    return digits.substring(0, 2) + ' ' + digits.substring(2, 7) + ' ' + digits.substring(7, 12);
  }
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password strength checker
export const checkPasswordStrength = (password: string): PasswordStrength => {
  const feedback: string[] = [];
  let score = 0;

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (hasMinLength) score++;
  else feedback.push('At least 8 characters');

  if (hasUppercase) score++;
  else feedback.push('One uppercase letter');

  if (hasLowercase) score++;
  else feedback.push('One lowercase letter');

  if (hasNumber) score++;
  else feedback.push('One number');

  if (hasSpecialChar) score++;
  else feedback.push('One special character');

  return {
    score,
    feedback,
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar
  };
};

// Get password strength text and color
export const getPasswordStrengthDisplay = (strength: PasswordStrength): { text: string; color: string; bgColor: string } => {
  switch (strength.score) {
    case 0:
    case 1:
      return { text: 'Very Weak', color: 'text-red-600', bgColor: 'bg-red-100' };
    case 2:
      return { text: 'Weak', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    case 3:
      return { text: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    case 4:
      return { text: 'Good', color: 'text-green-600', bgColor: 'bg-green-100' };
    case 5:
      return { text: 'Strong', color: 'text-green-700', bgColor: 'bg-green-200' };
    default:
      return { text: 'Very Weak', color: 'text-red-600', bgColor: 'bg-red-100' };
  }
};

// Generic form validation
export const createFormValidator = (rules: Record<string, (value: any) => string | null>) => {
  return (values: Record<string, any>, touched: Record<string, boolean> = {}): AuthValidation => {
    const errors: Record<string, string> = {};
    
    Object.keys(rules).forEach(field => {
      if (touched[field] !== false) { // Validate if touched is true or undefined
        const error = rules[field](values[field]);
        if (error) {
          errors[field] = error;
        }
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      touched
    };
  };
};

// Common validation rules
export const validationRules = {
  required: (value: any) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'This field is required';
    }
    return null;
  },
  
  email: (value: string) => {
    if (!value) return 'Email is required';
    if (!validateEmail(value)) return 'Please enter a valid email address';
    return null;
  },
  
  phone: (value: string) => {
    if (!value) return 'Phone number is required';
    const validation = validateIndianPhoneNumber(value);
    if (!validation.isValid) return 'Please enter a valid Indian phone number';
    return null;
  },
  
  password: (value: string) => {
    if (!value) return 'Password is required';
    const strength = checkPasswordStrength(value);
    if (strength.score < 3) return 'Password is too weak';
    return null;
  },
  
  confirmPassword: (value: string, originalPassword: string) => {
    if (!value) return 'Please confirm your password';
    if (value !== originalPassword) return 'Passwords do not match';
    return null;
  },
  
  name: (value: string) => {
    if (!value) return 'Name is required';
    if (value.length < 2) return 'Name must be at least 2 characters';
    if (value.length > 50) return 'Name must be less than 50 characters';
    return null;
  },
  
  agreeToTerms: (value: boolean) => {
    if (!value) return 'You must agree to the terms and conditions';
    return null;
  }
};

// Social login providers configuration
export const socialLoginProviders = [
  {
    id: 'google' as const,
    name: 'Google',
    icon: '🔵', // In a real app, use proper SVG icons
    color: 'bg-red-500 hover:bg-red-600'
  },
  {
    id: 'facebook' as const,
    name: 'Facebook', 
    icon: '📘',
    color: 'bg-blue-600 hover:bg-blue-700'
  },
  {
    id: 'apple' as const,
    name: 'Apple',
    icon: '🍎',
    color: 'bg-black hover:bg-gray-800'
  }
];

// Token management
export const tokenManager = {
  get: () => localStorage.getItem('authToken'),
  set: (token: string) => localStorage.setItem('authToken', token),
  remove: () => localStorage.removeItem('authToken'),
  isValid: (token: string) => {
    if (!token) return false;
    try {
      // In a real app, validate JWT expiration
      const parts = token.split('_');
      return parts.length >= 3;
    } catch {
      return false;
    }
  }
};

// Error message mapping for better UX
export const getErrorMessage = (error: string): string => {
  const errorMap: Record<string, string> = {
    'User not found': 'No account found with this email or phone number.',
    'Invalid password': 'The password you entered is incorrect.',
    'Email already registered': 'An account with this email already exists.',
    'Phone number already registered': 'An account with this phone number already exists.',
    'Invalid verification code': 'The verification code is incorrect. Please try again.',
    'Verification code has expired': 'The verification code has expired. Please request a new one.',
    'Invalid or expired reset token': 'The reset link is invalid or has expired.',
    'Reset token has expired': 'The reset link has expired. Please request a new one.',
    'Passwords do not match': 'The passwords you entered do not match.',
    'Password is too weak': 'Please choose a stronger password.',
    'You must agree to the terms and conditions': 'Please accept our terms and conditions to continue.'
  };

  return errorMap[error] || error;
}; 