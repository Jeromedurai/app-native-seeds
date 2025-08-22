import React, { useState, useEffect, useRef } from 'react';
import { CheckoutAddress, CheckoutValidation } from '../../types';
import { mockCheckoutApi } from '../../services/mockCheckoutApi';

interface AddressFormProps {
  address: CheckoutAddress | null;
  type: 'shipping' | 'billing';
  onAddressChange: (address: CheckoutAddress) => void;
  onValidationChange: (isValid: boolean, errors: CheckoutValidation) => void;
  isSubmitting?: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({
  address,
  type,
  onAddressChange,
  onValidationChange,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState<CheckoutAddress>(
    address || {
      type,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'IN'
    }
  );

  const [errors, setErrors] = useState<CheckoutValidation>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isValidating, setIsValidating] = useState(false);

  // Use refs for callbacks to avoid dependency issues
  const onValidationChangeRef = useRef(onValidationChange);
  onValidationChangeRef.current = onValidationChange;
  
  const onAddressChangeRef = useRef(onAddressChange);
  onAddressChangeRef.current = onAddressChange;

  // Indian States for dropdown
  const states = [
    { value: '', label: 'Select State' },
    { value: 'AN', label: 'Andaman and Nicobar Islands' },
    { value: 'AP', label: 'Andhra Pradesh' },
    { value: 'AR', label: 'Arunachal Pradesh' },
    { value: 'AS', label: 'Assam' },
    { value: 'BR', label: 'Bihar' },
    { value: 'CH', label: 'Chandigarh' },
    { value: 'CT', label: 'Chhattisgarh' },
    { value: 'DL', label: 'Delhi' },
    { value: 'GA', label: 'Goa' },
    { value: 'GJ', label: 'Gujarat' },
    { value: 'HR', label: 'Haryana' },
    { value: 'HP', label: 'Himachal Pradesh' },
    { value: 'JK', label: 'Jammu and Kashmir' },
    { value: 'JH', label: 'Jharkhand' },
    { value: 'KA', label: 'Karnataka' },
    { value: 'KL', label: 'Kerala' },
    { value: 'MP', label: 'Madhya Pradesh' },
    { value: 'MH', label: 'Maharashtra' },
    { value: 'MN', label: 'Manipur' },
    { value: 'ML', label: 'Meghalaya' },
    { value: 'MZ', label: 'Mizoram' },
    { value: 'NL', label: 'Nagaland' },
    { value: 'OR', label: 'Odisha' },
    { value: 'PY', label: 'Puducherry' },
    { value: 'PB', label: 'Punjab' },
    { value: 'RJ', label: 'Rajasthan' },
    { value: 'SK', label: 'Sikkim' },
    { value: 'TN', label: 'Tamil Nadu' },
    { value: 'TG', label: 'Telangana' },
    { value: 'TR', label: 'Tripura' },
    { value: 'UP', label: 'Uttar Pradesh' },
    { value: 'UT', label: 'Uttarakhand' },
    { value: 'WB', label: 'West Bengal' }
  ];

  // Simplified: Update parent when form data changes
  useEffect(() => {
    onAddressChangeRef.current(formData);
  }, [formData]);

  // Validate form with debouncing (simplified approach)
  useEffect(() => {
    const validateForm = async () => {
      // Skip validation if key fields are empty
      if (!formData.firstName && !formData.lastName && !formData.email) {
        setErrors({});
        onValidationChangeRef.current(false, {});
        return;
      }

      setIsValidating(true);
      try {
        const response = await mockCheckoutApi.validateAddress(formData);
        
        if (response.success) {
          setErrors({});
          onValidationChangeRef.current(true, {});
        } else {
          const validationErrors = response.errors || {};
          setErrors(validationErrors);
          onValidationChangeRef.current(false, validationErrors);
        }
      } catch (error) {
        console.error('Address validation error:', error);
        onValidationChangeRef.current(false, { general: 'Validation failed' });
      } finally {
        setIsValidating(false);
      }
    };

    // Debounce validation
    const timeoutId = setTimeout(validateForm, 1500);
    return () => clearTimeout(timeoutId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formData.firstName, 
    formData.lastName, 
    formData.email, 
    formData.phone, 
    formData.address1, 
    formData.city, 
    formData.state, 
    formData.zipCode
  ]); // Remove onValidationChange to prevent loops

  const handleInputChange = (field: keyof CheckoutAddress, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: keyof CheckoutAddress) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const getFieldError = (field: keyof CheckoutAddress) => {
    return touched[field] ? errors[field] : null;
  };

  const getFieldClassName = (field: keyof CheckoutAddress) => {
    const baseClass = "w-full px-4 py-3 sm:py-3.5 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-base";
    const error = getFieldError(field);
    
    if (error) {
      return `${baseClass} border-red-300 bg-red-50`;
    }
    
    if (touched[field] && !error) {
      return `${baseClass} border-green-300 bg-green-50`;
    }
    
    return `${baseClass} border-gray-300`;
  };

  return (
    <div className="space-y-8">
      {/* Form Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 bg-blue-100 rounded-lg flex-shrink-0">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 capitalize mb-2">
            {type} Address
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {type === 'shipping' ? 'Where should we deliver your order?' : 'Billing information for your payment'}
          </p>
        </div>
        {isValidating && (
          <div className="flex-shrink-0">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              Validating...
            </div>
          </div>
        )}
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor={`${type}-firstName`} className="block text-sm font-semibold text-gray-700">
              First Name *
            </label>
            <input
              type="text"
              id={`${type}-firstName`}
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              onBlur={() => handleBlur('firstName')}
              disabled={isSubmitting}
              className={getFieldClassName('firstName')}
              placeholder="John"
            />
            {getFieldError('firstName') && (
              <p className="text-sm text-red-600">{getFieldError('firstName')}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor={`${type}-lastName`} className="block text-sm font-semibold text-gray-700">
              Last Name *
            </label>
            <input
              type="text"
              id={`${type}-lastName`}
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              onBlur={() => handleBlur('lastName')}
              disabled={isSubmitting}
              className={getFieldClassName('lastName')}
              placeholder="Doe"
            />
            {getFieldError('lastName') && (
              <p className="text-sm text-red-600">{getFieldError('lastName')}</p>
            )}
          </div>
        </div>

        {/* Contact Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor={`${type}-email`} className="block text-sm font-semibold text-gray-700">
              Email Address *
            </label>
            <input
              type="email"
              id={`${type}-email`}
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => handleBlur('email')}
              disabled={isSubmitting}
              className={getFieldClassName('email')}
              placeholder="john.doe@example.com"
            />
            {getFieldError('email') && (
              <p className="text-sm text-red-600">{getFieldError('email')}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor={`${type}-phone`} className="block text-sm font-semibold text-gray-700">
              Phone Number *
            </label>
            <input
              type="tel"
              id={`${type}-phone`}
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              onBlur={() => handleBlur('phone')}
              disabled={isSubmitting}
              className={getFieldClassName('phone')}
              placeholder="+91 98765 43210"
            />
            {getFieldError('phone') && (
              <p className="text-sm text-red-600">{getFieldError('phone')}</p>
            )}
          </div>
        </div>

        {/* Company Field */}
        <div className="space-y-2">
          <label htmlFor={`${type}-company`} className="block text-sm font-semibold text-gray-700">
            Company (Optional)
          </label>
          <input
            type="text"
            id={`${type}-company`}
            value={formData.company || ''}
            onChange={(e) => handleInputChange('company', e.target.value)}
            onBlur={() => handleBlur('company')}
            disabled={isSubmitting}
            className={getFieldClassName('company')}
            placeholder="Company Name"
          />
        </div>

        {/* Address Fields */}
        <div className="space-y-2">
          <label htmlFor={`${type}-address1`} className="block text-sm font-semibold text-gray-700">
            Street Address *
          </label>
          <input
            type="text"
            id={`${type}-address1`}
            value={formData.address1}
            onChange={(e) => handleInputChange('address1', e.target.value)}
            onBlur={() => handleBlur('address1')}
            disabled={isSubmitting}
            className={getFieldClassName('address1')}
            placeholder="123 Main Street"
          />
          {getFieldError('address1') && (
            <p className="text-sm text-red-600">{getFieldError('address1')}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor={`${type}-address2`} className="block text-sm font-semibold text-gray-700">
            Apartment, Suite, etc. (Optional)
          </label>
          <input
            type="text"
            id={`${type}-address2`}
            value={formData.address2 || ''}
            onChange={(e) => handleInputChange('address2', e.target.value)}
            onBlur={() => handleBlur('address2')}
            disabled={isSubmitting}
            className={getFieldClassName('address2')}
            placeholder="Apt 4B, Floor 2"
          />
        </div>

        {/* City, State, ZIP Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label htmlFor={`${type}-city`} className="block text-sm font-semibold text-gray-700">
              City *
            </label>
            <input
              type="text"
              id={`${type}-city`}
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              onBlur={() => handleBlur('city')}
              disabled={isSubmitting}
              className={getFieldClassName('city')}
              placeholder="Mumbai"
            />
            {getFieldError('city') && (
              <p className="text-sm text-red-600">{getFieldError('city')}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor={`${type}-state`} className="block text-sm font-semibold text-gray-700">
              State *
            </label>
            <select
              id={`${type}-state`}
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              onBlur={() => handleBlur('state')}
              disabled={isSubmitting}
              className={getFieldClassName('state')}
            >
              {states.map((state) => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </select>
            {getFieldError('state') && (
              <p className="text-sm text-red-600">{getFieldError('state')}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor={`${type}-zipCode`} className="block text-sm font-semibold text-gray-700">
              ZIP Code *
            </label>
            <input
              type="text"
              id={`${type}-zipCode`}
              value={formData.zipCode}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
              onBlur={() => handleBlur('zipCode')}
              disabled={isSubmitting}
              className={getFieldClassName('zipCode')}
              placeholder="400001"
            />
            {getFieldError('zipCode') && (
              <p className="text-sm text-red-600">{getFieldError('zipCode')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Validation Status */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressForm; 