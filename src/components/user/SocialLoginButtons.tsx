import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import LoadingSpinner from '../common/LoadingSpinner';
type SocialProvider = 'google' | 'facebook' | 'apple';

interface SocialLoginButtonsProps {
  mode?: 'login' | 'register';
  className?: string;
}

const SocialLoginButtons: React.FC<SocialLoginButtonsProps> = ({ 
  mode = 'login',
  className = '' 
}) => {
  const { socialLogin } = useAppContext();
  const navigate = useNavigate();
  const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(null);

  const handleSocialLogin = async (provider: SocialProvider) => {
    setLoadingProvider(provider);
    
    try {
      // In a real app, this would open the provider's OAuth flow
      // For demo purposes, we'll simulate the process
      const mockToken = `mock_${provider}_token_${Date.now()}`;
      
      await socialLogin({
        provider,
        accessToken: mockToken,
        profile: {
          id: `mock_${provider}_id`,
          email: `demo@${provider}.com`,
          name: `Demo ${provider.charAt(0).toUpperCase() + provider.slice(1)} User`
        }
      });

      // Navigate to home after successful login
      navigate('/', { 
        state: { 
          message: `Successfully ${mode === 'login' ? 'logged in' : 'registered'} with ${provider.charAt(0).toUpperCase() + provider.slice(1)}!` 
        }
      });
    } catch (error: any) {
      console.error(`${provider} login failed:`, error);
      // Error handling is done by the calling component
    } finally {
      setLoadingProvider(null);
    }
  };

  const socialProviders = [
    {
      provider: 'google' as const,
      name: 'Google',
      bgColor: 'bg-white',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-300',
      hoverColor: 'hover:bg-gray-50',
      logo: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      )
    },
    {
      provider: 'facebook' as const,
      name: 'Facebook',
      bgColor: 'bg-[#1877F2]',
      textColor: 'text-white',
      borderColor: 'border-[#1877F2]',
      hoverColor: 'hover:bg-[#166FE5]',
      logo: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    {
      provider: 'apple' as const,
      name: 'Apple',
      bgColor: 'bg-black',
      textColor: 'text-white',
      borderColor: 'border-black',
      hoverColor: 'hover:bg-gray-800',
      logo: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C8.396 0 8.002.019 8.002.019 7.34.023 4.979.448 2.727 3.11 1.2 5.089.047 7.572.047 10.492c0 2.981 1.181 6.167 2.685 8.421 2.319 3.479 4.594 6.932 8.405 6.932 1.877 0 2.691-.123 3.83-.675 1.656-.798 2.818-2.059 3.986-3.485.928-1.133 1.86-2.507 2.616-4.22C22.666 15.185 24 12.132 24 8.967c0-4.746-2.268-6.592-4.085-7.38C18.724.415 15.917-.002 12.017 0zm2.78 7.674c-.615 2.33-1.624 3.436-3.026 3.436-1.848 0-2.906-1.299-2.906-2.963 0-1.748 1.027-2.963 2.572-2.963 1.416 0 2.332.8 2.332 2.013 0 .27-.028.477-.028.477z"/>
        </svg>
      )
    }
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">
            Or {mode} with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {socialProviders.map(({ provider, name, bgColor, textColor, borderColor, hoverColor, logo }) => (
          <button
            key={provider}
            onClick={() => handleSocialLogin(provider)}
            disabled={loadingProvider !== null}
            className={`
              w-full inline-flex justify-center items-center px-4 py-2 border rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed
              ${bgColor} ${textColor} ${borderColor} ${hoverColor}
            `}
          >
            {loadingProvider === provider ? (
              <LoadingSpinner size="sm" color={provider === 'google' ? 'primary' : 'white'} />
            ) : (
              <>
                {logo}
                <span className="ml-2">{name}</span>
              </>
            )}
          </button>
        ))}
      </div>

      {/* Demo Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
        <p className="text-xs text-blue-700 text-center">
          <span className="font-medium">Demo Mode:</span> Social login buttons create demo accounts. 
          In production, these would integrate with actual OAuth providers.
        </p>
      </div>
    </div>
  );
};

export default SocialLoginButtons; 