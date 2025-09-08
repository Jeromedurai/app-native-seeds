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
import { ILoginRequest, ILoginResponse, ILoginResponseData, ILogoutRequest, ILogoutResponse, IRegisterRequest, IRegisterResponse, IResetPasswordRequest, IResetPasswordResponse, IGetProfileResponse, IUpdateProfileRequest, IUpdateProfileResponse } from '../modals/interface';

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
    try {
      const payload: IRegisterRequest = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
        agreeToTerms: userData.agreeToTerms
      };

      const response: IRegisterResponse = await endpoints.registerUser(payload);
      
      if (response.exception) {
        return {
          data: null as any,
          success: false,
          message: response.exception || 'Registration failed'
        };
      }

      // Transform the API response to match the expected AuthResponse format
      const authResponse: AuthResponse = {
        user: {
          id: response.data.user.userId.toString(),
          name: `${response.data.user.firstName} ${response.data.user.lastName}`.trim(),
          email: response.data.user.email,
          phone: response.data.user.phone,
          role: (response.data.user.roles[0]?.roleName.toLowerCase() === 'admin' ? 'admin' : 
                response.data.user.roles[0]?.roleName.toLowerCase() === 'executive' ? 'executive' : 'customer') as 'customer' | 'admin' | 'executive',
          emailVerified: response.data.user.emailVerified,
          phoneVerified: response.data.user.phoneVerified,
          isEmailVerified: response.data.user.emailVerified,
          isPhoneVerified: response.data.user.phoneVerified,
          createdAt: response.data.user.createdAt,
          tenantId: response.data.user.tenantId
        },
        token: response.data.token,
        refreshToken: response.data.refreshToken,
        expiresIn: response.data.expiresIn
      };

      return {
        data: authResponse,
        success: true
      };
    } catch (error) {
      return {
        data: null as any,
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed'
      };
    }
  }

  async requestPasswordReset(data: PasswordResetRequest): Promise<ApiResponse<{ message: string }>> {
    throw new Error('Password reset endpoint not yet implemented');
  }

  async confirmPasswordReset(data: PasswordResetConfirm): Promise<ApiResponse<{ message: string }>> {
    try {
      const payload: IResetPasswordRequest = {
        resetToken: data.resetToken,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
      };

      const response: IResetPasswordResponse = await endpoints.resetPassword(payload);
      
      if (response.exception) {
        return {
          data: null as any,
          success: false,
          message: response.exception || 'Password reset failed'
        };
      }

      return {
        data: { message: response.data || 'Password reset successfully' },
        success: true
      };
    } catch (error) {
      return {
        data: null as any,
        success: false,
        message: error instanceof Error ? error.message : 'Password reset failed'
      };
    }
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

  async getProfile(userId: number, tenantId: number): Promise<ApiResponse<User>> {
    try {
      const response: IGetProfileResponse = await endpoints.getUserProfile(userId, tenantId);
      
      if (response.exception) {
        return {
          data: null as any,
          success: false,
          message: response.exception || 'Failed to get profile'
        };
      }

      // Transform the API response to match the expected User format
      const user: User = {
        id: response.data.data.userId.toString(),
        name: response.data.data.fullName,
        email: response.data.data.email,
        phone: response.data.data.phone,
        role: (response.data.data.roles?.[0]?.roleName.toLowerCase() === 'admin' ? 'admin' : 
              response.data.data.roles?.[0]?.roleName.toLowerCase() === 'executive' ? 'executive' : 'customer') as 'customer' | 'admin' | 'executive',
        emailVerified: response.data.data.emailVerified,
        phoneVerified: response.data.data.phoneVerified,
        isEmailVerified: response.data.data.emailVerified,
        isPhoneVerified: response.data.data.phoneVerified,
        createdAt: response.data.data.createdAt,
        tenantId: response.data.data.tenantId,
        profilePicture: response.data.data.profilePicture,
        bio: response.data.data.bio,
        website: response.data.data.website
      };

      return {
        data: user,
        success: true
      };
    } catch (error) {
      return {
        data: null as any,
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get profile'
      };
    }
  }

  async updateProfile(userId: number, updates: { name: string; phone: string; bio?: string; website?: string }): Promise<ApiResponse<User>> {
    try {
      const payload: IUpdateProfileRequest = {
        userId,
        name: updates.name,
        phone: updates.phone,
        bio: updates.bio || '',
        website: updates.website || ''
      };

      const response: IUpdateProfileResponse = await endpoints.updateUserProfile(payload);
      
      if (response.exception) {
        return {
          data: null as any,
          success: false,
          message: response.exception || 'Failed to update profile'
        };
      }

      // After successful update, get the updated profile
      const updatedProfile = await this.getProfile(userId, 1); // Assuming tenantId is 1
      
      return updatedProfile;
    } catch (error) {
      return {
        data: null as any,
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update profile'
      };
    }
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