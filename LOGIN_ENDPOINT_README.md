# Login Endpoint Implementation

This document describes the implementation of the new login endpoint for the Himalaya Seeds application.

## Overview

The login endpoint has been implemented to authenticate users using email/phone and password credentials. It follows the existing application architecture and integrates seamlessly with the current authentication flow.

## Endpoint Details

- **URL**: `https://localhost:5002/api/user/auth/login`
- **Method**: `POST`
- **Content-Type**: `application/json`

## Request Payload

```json
{
    "emailOrPhone": "admin@example.com",
    "password": "Admin123!",
    "rememberMe": false
}
```

### Field Descriptions

- `emailOrPhone`: User's email address or phone number
- `password`: User's password
- `rememberMe`: Boolean flag for "remember me" functionality

## Response Format

```json
{
    "data": {
        "userId": 11,
        "firstName": "Admin",
        "lastName": "User",
        "email": "admin@example.com",
        "phone": "+1-555-0100",
        "active": true,
        "tenantId": 1,
        "lastLogin": "2025-09-01T16:01:09.23",
        "rememberMe": false,
        "roles": [],
        "token": null,
        "tokenExpiration": null
    },
    "exception": null
}
```

## Implementation Files

### 1. Interfaces (`src/modals/interface.ts`)

New TypeScript interfaces have been added:

- `ILoginRequest`: Defines the login request payload structure
- `IUserRole`: Defines user role structure
- `ILoginResponseData`: Defines the login response data structure
- `ILoginResponse`: Extends the base API result with login-specific data

### 2. Constants (`src/api/util/constant.ts`)

Added the login endpoint URL constant:

```typescript
export const URL_CONSTANTS = {
  // ... existing constants
  userAuth: 'api/user/auth/login'
}
```

### 3. Endpoints (`src/api/endpoints/endpoints.ts`)

Updated the `EndPoints` class with:

- Proper constructor initialization
- Cache initialization method
- New `login()` method that calls the real endpoint
- Error handling and response processing

### 4. Real API Service (`src/services/api.ts`)

Created a new `RealAuthApi` class that:

- Implements the login method using the new endpoint
- **Returns the real API response data directly** without transformation
- Uses `RealAuthResponse` interface that matches your backend structure
- Provides placeholder methods for other auth operations
- Includes utility methods for validation

### 5. App Context Integration (`src/context/AppContext.tsx`)

Updated to use the real API instead of mock API:

- Import changed from `mockAuthApi` to `realAuthApi`
- All authentication calls now use the real endpoint
- Maintains the same interface for seamless integration

## Usage Examples

### Direct Endpoint Usage

```typescript
import endpoints from '../api/endpoints/endpoints';

const loginUser = async () => {
  try {
    const response = await endpoints.login({
      emailOrPhone: 'admin@example.com',
      password: 'Admin123!',
      rememberMe: false
    });
    
    if (response.exception) {
      console.error('Login failed:', response.exception);
      return;
    }
    
    console.log('User logged in:', response.data);
  } catch (error) {
    console.error('Login error:', error);
  }
};
```

### Using the Real API Service

```typescript
import { realAuthApi } from '../services/api';

const loginUser = async () => {
  try {
    const response = await realAuthApi.login({
      emailOrPhone: 'admin@example.com',
      password: 'Admin123!',
      rememberMe: false
    });
    
    if (response.success) {
      // Access the real backend data directly
      console.log('User ID:', response.data.user.userId);
      console.log('First Name:', response.data.user.firstName);
      console.log('Last Name:', response.data.user.lastName);
      console.log('Email:', response.data.user.email);
      console.log('Phone:', response.data.user.phone);
      console.log('Tenant ID:', response.data.user.tenantId);
      console.log('Roles:', response.data.user.roles);
      console.log('Token:', response.data.user.token);
    } else {
      console.error('Login failed:', response.message);
    }
  } catch (error) {
    console.error('Login error:', error);
  }
};
```

### Using the App Context (Recommended)

```typescript
import { useAppContext } from '../context/AppContext';

const LoginComponent = () => {
  const { login, loading } = useAppContext();
  
  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      // Login successful, user will be redirected
    } catch (error) {
      // Handle login error
      console.error('Login failed:', error);
    }
  };
  
  return (
    // Your login form JSX
  );
};
```

## Testing

A component has been created at `src/components/common/RealUserDataDisplay.tsx` that demonstrates:

- How to access and display the real API response data
- Shows all user fields from the backend response
- Displays the actual data structure from your API
- Can be used to verify the real data is working correctly

## Error Handling

The implementation includes comprehensive error handling:

- Network errors are caught and properly formatted
- API exceptions are handled gracefully
- User-friendly error messages are provided
- Loading states are managed appropriately

## Security Considerations

- Passwords are sent over HTTPS (localhost:5002)
- No sensitive data is logged or stored in plain text
- Token-based authentication is supported
- Remember me functionality is implemented

## Future Enhancements

The following features are planned for future implementation:

- Registration endpoint
- Password reset endpoints
- Email/phone verification endpoints
- Social login integration
- Profile management endpoints
- Token refresh mechanism

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend allows requests from your frontend origin
2. **Network Errors**: Verify the backend is running on `https://localhost:5002`
3. **Authentication Errors**: Check that the credentials match the expected format
4. **Response Format Issues**: Ensure the backend returns data in the expected structure

### Debug Mode

To enable debug logging, you can modify the `execute` function in `endpoints.ts`:

```typescript
async function execute<T>(action: () => Promise<T>): Promise<T> {
  try {
    console.log('Executing API call...');
    const result = await action();
    console.log('API call successful:', result);
    return result;
  } catch (ex) {
    console.error('API call failed:', ex);
    throw ex;
  }
}
```

## Dependencies

The implementation requires the following dependencies:

- `axios` for HTTP requests
- `react` for the UI components
- `typescript` for type safety

## Conclusion

The login endpoint has been successfully implemented and integrated into the existing application architecture. It provides a secure, type-safe way to authenticate users while maintaining backward compatibility with the current authentication flow.
