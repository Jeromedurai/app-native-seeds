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
import { generateId } from '../utils';  

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate 5% failure rate for testing
const simulateFailure = () => Math.random() < 0.05;

// In-memory storage for demo (simulates database)
let usersStorage: User[] = [
  {
    id: '1',
    email: 'demo@himalayaseeds.com',
    phone: '+91 98765 43210',
    name: 'Demo User',
    emailVerified: true,
    phoneVerified: true,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    role: 'customer'
  },
  {
    id: '2',
    email: 'admin@himalayaseeds.com',
    phone: '+91 98765 43211',
    name: 'Admin User',
    emailVerified: true,
    phoneVerified: true,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    role: 'admin'
  },
  {
    id: '3',
    email: 'executive@himalayaseeds.com',
    phone: '+91 98765 43212',
    name: 'Executive User',
    emailVerified: true,
    phoneVerified: true,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    role: 'executive'
  }
];

// Temporary storage for verification codes and reset tokens
let verificationCodes: Record<string, { code: string; expires: Date; type: 'email' | 'phone' }> = {};
let resetTokens: Record<string, { token: string; expires: Date; userId: string }> = {};
let passwordStorage: Record<string, string> = {
  'demo@himalayaseeds.com': 'password123', // For demo user
  'admin@himalayaseeds.com': 'admin123', // For admin user
  'executive@himalayaseeds.com': 'executive123' // For executive user
};

export class MockAuthApi {
  // User authentication
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    await delay(800); // Simulate API delay

    if (simulateFailure()) {
      return {
        data: null as any,
        success: false,
        message: 'Login service temporarily unavailable'
      };
    }

    const { emailOrPhone, password } = credentials;
    
    // Find user by email or phone
    const user = usersStorage.find(u => 
      u.email === emailOrPhone || u.phone === emailOrPhone
    );

    if (!user) {
      return {
        data: null as any,
        success: false,
        message: 'User not found'
      };
    }

    // Check password (in real app, this would be hashed)
    const storedPassword = passwordStorage[user.email];
    if (storedPassword !== password) {
      return {
        data: null as any,
        success: false,
        message: 'Invalid password'
      };
    }

    // Update last login
    user.lastLogin = new Date().toISOString();

    // Generate token (in real app, this would be JWT)
    const token = `token_${user.id}_${Date.now()}`;
    
    return {
      data: {
        user,
        token,
        expiresIn: 86400 // 24 hours
      },
      success: true
    };
  }

  // User registration
  async register(userData: RegisterData): Promise<ApiResponse<AuthResponse>> {
    await delay(1000); // Simulate API delay

    if (simulateFailure()) {
      return {
        data: null as any,
        success: false,
        message: 'Registration service temporarily unavailable'
      };
    }

    const { name, email, phone, password, confirmPassword, agreeToTerms } = userData;

    // Validation
    if (!agreeToTerms) {
      return {
        data: null as any,
        success: false,
        message: 'You must agree to the terms and conditions'
      };
    }

    if (password !== confirmPassword) {
      return {
        data: null as any,
        success: false,
        message: 'Passwords do not match'
      };
    }

    // Check if user already exists
    const existingUser = usersStorage.find(u => 
      u.email === email || u.phone === phone
    );

    if (existingUser) {
      return {
        data: null as any,
        success: false,
        message: existingUser.email === email ? 'Email already registered' : 'Phone number already registered'
      };
    }

    // Validate phone number format
    const phoneValidation = this.validateIndianPhoneNumber(phone);
    if (!phoneValidation.isValid) {
      return {
        data: null as any,
        success: false,
        message: 'Please enter a valid Indian phone number'
      };
    }

    // Create new user
    const newUser: User = {
      id: generateId(),
      email,
      phone: phoneValidation.formatted,
      name,
      emailVerified: false,
      phoneVerified: false,
      createdAt: new Date().toISOString(),
      role: 'customer' // Default role for new users
    };

    // Store user and password
    usersStorage.push(newUser);
    passwordStorage[email] = password;

    // Generate verification codes
    await this.generateVerificationCode(email, 'email');
    await this.generateVerificationCode(phoneValidation.formatted, 'phone');

    // Generate token
    const token = `token_${newUser.id}_${Date.now()}`;

    return {
      data: {
        user: newUser,
        token,
        expiresIn: 86400
      },
      success: true
    };
  }

  // Request password reset
  async requestPasswordReset(data: PasswordResetRequest): Promise<ApiResponse<{ message: string }>> {
    await delay(600);

    if (simulateFailure()) {
      return {
        data: null as any,
        success: false,
        message: 'Password reset service temporarily unavailable'
      };
    }

    const user = usersStorage.find(u => 
      u.email === data.emailOrPhone || u.phone === data.emailOrPhone
    );

    if (!user) {
      // Don't reveal if user exists for security
      return {
        data: { message: 'If the email/phone exists, you will receive reset instructions' },
        success: true
      };
    }

    // Generate reset token
    const token = generateId();
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // 1 hour expiry

    resetTokens[data.emailOrPhone] = {
      token,
      expires,
      userId: user.id
    };

    const method = data.method === 'email' ? 'email' : 'SMS';
    
    return {
      data: { 
        message: `Password reset instructions sent via ${method}. Reset token (for demo): ${token}` 
      },
      success: true
    };
  }

  // Confirm password reset
  async confirmPasswordReset(data: PasswordResetConfirm): Promise<ApiResponse<{ message: string }>> {
    await delay(600);

    if (simulateFailure()) {
      return {
        data: null as any,
        success: false,
        message: 'Password reset service temporarily unavailable'
      };
    }

    // Find reset token
    const resetEntry = Object.entries(resetTokens).find(([, entry]) => 
      entry.token === data.resetToken
    );

    if (!resetEntry) {
      return {
        data: null as any,
        success: false,
        message: 'Invalid or expired reset token'
      };
    }

    const [emailOrPhone, tokenData] = resetEntry;

    // Check if token is expired
    if (new Date() > tokenData.expires) {
      delete resetTokens[emailOrPhone];
      return {
        data: null as any,
        success: false,
        message: 'Reset token has expired'
      };
    }

    // Validate new password
    if (data.newPassword !== data.confirmPassword) {
      return {
        data: null as any,
        success: false,
        message: 'Passwords do not match'
      };
    }

    // Find user and update password
    const user = usersStorage.find(u => u.id === tokenData.userId);
    if (!user) {
      return {
        data: null as any,
        success: false,
        message: 'User not found'
      };
    }

    // Update password
    passwordStorage[user.email] = data.newPassword;

    // Clean up reset token
    delete resetTokens[emailOrPhone];

    return {
      data: { message: 'Password updated successfully' },
      success: true
    };
  }

  // Request verification (email or phone)
  async requestVerification(data: VerificationRequest): Promise<ApiResponse<{ message: string }>> {
    await delay(500);

    if (simulateFailure()) {
      return {
        data: null as any,
        success: false,
        message: 'Verification service temporarily unavailable'
      };
    }

    const code = await this.generateVerificationCode(data.value, data.type);
    const method = data.type === 'email' ? 'email' : 'SMS';

    return {
      data: { 
        message: `Verification code sent via ${method}. Code (for demo): ${code}` 
      },
      success: true
    };
  }

  // Confirm verification
  async confirmVerification(data: VerificationConfirm): Promise<ApiResponse<{ message: string }>> {
    await delay(400);

    if (simulateFailure()) {
      return {
        data: null as any,
        success: false,
        message: 'Verification service temporarily unavailable'
      };
    }

    const storedData = verificationCodes[data.value];

    if (!storedData) {
      return {
        data: null as any,
        success: false,
        message: 'No verification code found'
      };
    }

    if (new Date() > storedData.expires) {
      delete verificationCodes[data.value];
      return {
        data: null as any,
        success: false,
        message: 'Verification code has expired'
      };
    }

    if (storedData.code !== data.code) {
      return {
        data: null as any,
        success: false,
        message: 'Invalid verification code'
      };
    }

    // Find and update user
    const user = usersStorage.find(u => 
      u.email === data.value || u.phone === data.value
    );

    if (user) {
      if (data.type === 'email') {
        user.emailVerified = true;
      } else {
        user.phoneVerified = true;
      }
    }

    // Clean up verification code
    delete verificationCodes[data.value];

    return {
      data: { message: `${data.type} verified successfully` },
      success: true
    };
  }

  // Social login
  async socialLogin(data: SocialLoginData): Promise<ApiResponse<AuthResponse>> {
    await delay(700);

    if (simulateFailure()) {
      return {
        data: null as any,
        success: false,
        message: 'Social login service temporarily unavailable'
      };
    }

    // Check if user exists
    let user = usersStorage.find(u => u.email === data.profile.email);

    if (!user) {
      // Create new user from social profile
      user = {
        id: generateId(),
        email: data.profile.email,
        name: data.profile.name,
        avatar: data.profile.avatar,
        emailVerified: true, // Social logins are pre-verified
        phoneVerified: false,
        createdAt: new Date().toISOString()
      };
      usersStorage.push(user);
    }

    // Update last login
    user.lastLogin = new Date().toISOString();

    // Generate token
    const token = `social_token_${user.id}_${Date.now()}`;

    return {
      data: {
        user,
        token,
        expiresIn: 86400
      },
      success: true
    };
  }

  // Utility: Generate verification code
  private async generateVerificationCode(value: string, type: 'email' | 'phone'): Promise<string> {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit code
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 10); // 10 minutes expiry

    verificationCodes[value] = {
      code,
      expires,
      type
    };

    return code;
  }

  // Utility: Validate Indian phone number
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

  // Utility: Check password strength
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

  // Get current user profile
  async getProfile(token: string): Promise<ApiResponse<User>> {
    await delay(300);

    if (simulateFailure()) {
      return {
        data: null as any,
        success: false,
        message: 'Profile service temporarily unavailable'
      };
    }

    // Extract user ID from token (in real app, verify JWT)
    const userId = token.split('_')[1];
    const user = usersStorage.find(u => u.id === userId);

    if (!user) {
      return {
        data: null as any,
        success: false,
        message: 'User not found'
      };
    }

    return {
      data: user,
      success: true
    };
  }

  // Update user profile
  async updateProfile(token: string, updates: Partial<User>): Promise<ApiResponse<User>> {
    await delay(500);

    if (simulateFailure()) {
      return {
        data: null as any,
        success: false,
        message: 'Profile update service temporarily unavailable'
      };
    }

    const userId = token.split('_')[1];
    const userIndex = usersStorage.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return {
        data: null as any,
        success: false,
        message: 'User not found'
      };
    }

    // Update user (excluding sensitive fields)
    const allowedUpdates: (keyof Pick<User, 'name' | 'phone'>)[] = ['name', 'phone'];
    const filteredUpdates: Partial<Pick<User, 'name' | 'phone'>> = {};
    
    allowedUpdates.forEach(key => {
      if (key in updates && updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    });

    usersStorage[userIndex] = {
      ...usersStorage[userIndex],
      ...filteredUpdates
    };

    return {
      data: usersStorage[userIndex],
      success: true
    };
  }
}

export const mockAuthApi = new MockAuthApi(); 