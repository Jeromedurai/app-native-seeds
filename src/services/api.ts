import { 
  ApiResponse, 
  User, 
  LoginCredentials, 
  RegisterData, 
  AuthResponse,
  PasswordResetRequest,
  PasswordResetConfirm,
  VerificationRequest,
  VerificationConfirm,
  SocialLoginData,
  PasswordStrength,
  PhoneNumberValidation
} from '../types';
import endpoints from '../api/endpoints/endpoints';
import { ILoginRequest, ILoginResponse, ILoginResponseData, ILogoutRequest, ILogoutResponse } from '../modals/interface';

// New interface for real API response
export interface RealAuthResponse {
  user: ILoginResponseData;
  token: string | null;
  expiresIn: number;
}

export class RealAuthApi {
  // User authentication using real endpoint - returns actual backend data
  async login(credentials: LoginCredentials): Promise<ApiResponse<RealAuthResponse>> {
    try {
      const payload: ILoginRequest = {
        emailOrPhone: credentials.emailOrPhone,
        password: credentials.password,
        rememberMe: credentials.rememberMe ?? false
      };

      const response: ILoginResponse = await endpoints.login(payload);
      
      if (response.exception) {
        return {
          data: null as any,
          success: false,
          message: response.exception || 'Login failed'
        };
      }

      // Return the real API response data directly
      return {
        data: {
          user: response.data,
          token: response.data.token || `token_${response.data.userId}_${Date.now()}`,
          expiresIn: 86400 // 24 hours
        },
        success: true
      };
    } catch (error) {
      return {
        data: null as any,
        success: false,
        message: error instanceof Error ? error.message : 'Login failed'
      };
    }
  }

  // Logout user using real endpoint
  async logout(payload: ILogoutRequest): Promise<ApiResponse<{ message: string }>> {
    try {
      const response: ILogoutResponse = await endpoints.logout(payload);
      
      if (response.exception) {
        return {
          data: null as any,
          success: false,
          message: response.exception || 'Logout failed'
        };
      }

      return {
        data: { message: response.data || 'Logged out successfully' },
        success: true
      };
    } catch (error) {
      return {
        data: null as any,
        success: false,
        message: error instanceof Error ? error.message : 'Logout failed'
      };
    }
  }

  // Placeholder methods for other auth operations
  // These would need to be implemented with real endpoints when available
  
  async register(userData: RegisterData): Promise<ApiResponse<AuthResponse>> {
    throw new Error('Registration endpoint not yet implemented');
  }

  async requestPasswordReset(data: PasswordResetRequest): Promise<ApiResponse<{ message: string }>> {
    throw new Error('Password reset endpoint not yet implemented');
  }

  async confirmPasswordReset(data: PasswordResetConfirm): Promise<ApiResponse<{ message: string }>> {
    throw new Error('Password reset confirmation endpoint not yet implemented');
  }

  async requestVerification(data: VerificationRequest): Promise<ApiResponse<{ message: string }>> {
    throw new Error('Verification request endpoint not yet implemented');
  }

  async confirmVerification(data: VerificationConfirm): Promise<ApiResponse<{ message: string }>> {
    throw new Error('Verification confirmation endpoint not yet implemented');
  }

  async socialLogin(data: SocialLoginData): Promise<ApiResponse<AuthResponse>> {
    throw new Error('Social login endpoint not yet implemented');
  }

  async getProfile(token: string): Promise<ApiResponse<User>> {
    throw new Error('Profile endpoint not yet implemented');
  }

  async updateProfile(token: string, updates: Partial<User>): Promise<ApiResponse<User>> {
    throw new Error('Profile update endpoint not yet implemented');
  }

  // Utility methods
  validateIndianPhoneNumber(phone: string): PhoneNumberValidation {
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
  }

  checkPasswordStrength(password: string): PasswordStrength {
    const feedback: string[] = [];
    let score = 0;

    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (hasMinLength) score++;
    else feedback.push('Password must be at least 8 characters long');

    if (hasUppercase) score++;
    else feedback.push('Add uppercase letters');

    if (hasLowercase) score++;
    else feedback.push('Add lowercase letters');

    if (hasNumber) score++;
    else feedback.push('Add numbers');

    if (hasSpecialChar) score++;
    else feedback.push('Add special characters');

    return {
      score,
      feedback,
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar
    };
  }
}

export const realAuthApi = new RealAuthApi(); 