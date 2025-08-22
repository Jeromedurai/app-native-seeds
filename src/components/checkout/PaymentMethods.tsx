import React, { useState, useEffect } from 'react';
import { PaymentMethod, CreditCardInfo, CheckoutValidation } from '../../types';
import { mockCheckoutApi } from '../../services/mockCheckoutApi';

interface PaymentMethodsProps {
  selectedPaymentMethod: PaymentMethod | null;
  creditCardInfo: CreditCardInfo | null;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onCreditCardChange: (cardInfo: CreditCardInfo) => void;
  onValidationChange: (isValid: boolean, errors: CheckoutValidation) => void;
  isSubmitting?: boolean;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  selectedPaymentMethod,
  creditCardInfo,
  onPaymentMethodChange,
  onCreditCardChange,
  onValidationChange,
  isSubmitting = false
}) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [cardData, setCardData] = useState<CreditCardInfo>(
    creditCardInfo || {
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      cardholderName: '',
      saveCard: false
    }
  );
  const [cardErrors, setCardErrors] = useState<CheckoutValidation>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Load payment methods on mount
  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        const response = await mockCheckoutApi.getPaymentMethods();
        if (response.success && response.data) {
          setPaymentMethods(response.data);
          // Auto-select credit card as default
          if (!selectedPaymentMethod) {
            const defaultMethod = response.data.find(m => m.type === 'credit_card');
            if (defaultMethod) {
              onPaymentMethodChange(defaultMethod);
            }
          }
        }
      } catch (error) {
        console.error('Failed to load payment methods:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPaymentMethods();
  }, [selectedPaymentMethod, onPaymentMethodChange]);

  // Update parent when card data changes
  useEffect(() => {
    onCreditCardChange(cardData);
  }, [cardData, onCreditCardChange]);

  // Validate credit card form
  useEffect(() => {
    if (selectedPaymentMethod?.type !== 'credit_card') {
      setCardErrors({});
      onValidationChange(true, {});
      return;
    }

    const errors: CheckoutValidation = {};

    // Card number validation
    if (!cardData.cardNumber.trim()) {
      errors.cardNumber = 'Card number is required';
    } else {
      const cleaned = cardData.cardNumber.replace(/\s/g, '');
      if (!/^\d{13,19}$/.test(cleaned)) {
        errors.cardNumber = 'Please enter a valid card number';
      }
    }

    // Expiry validation
    if (!cardData.expiryMonth) {
      errors.expiryMonth = 'Expiry month is required';
    }
    if (!cardData.expiryYear) {
      errors.expiryYear = 'Expiry year is required';
    } else if (cardData.expiryMonth && cardData.expiryYear) {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const expYear = parseInt(cardData.expiryYear);
      const expMonth = parseInt(cardData.expiryMonth);
      
      if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        errors.expiryMonth = 'Card has expired';
      }
    }

    // CVV validation
    if (!cardData.cvv.trim()) {
      errors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(cardData.cvv)) {
      errors.cvv = 'Please enter a valid CVV';
    }

    // Cardholder name validation
    if (!cardData.cardholderName.trim()) {
      errors.cardholderName = 'Cardholder name is required';
    }

    setCardErrors(errors);
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid, errors);
  }, [cardData, selectedPaymentMethod, onValidationChange]);

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const match = cleaned.match(/(\d{1,4})(\d{1,4})?(\d{1,4})?(\d{1,4})?/);
    if (match) {
      return [match[1], match[2], match[3], match[4]].filter(Boolean).join(' ');
    }
    return cleaned;
  };

  const getCardType = (number: string) => {
    const cleaned = number.replace(/\s/g, '');
    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return 'mastercard';
    if (/^3[47]/.test(cleaned)) return 'amex';
    if (/^6/.test(cleaned)) return 'discover';
    return 'unknown';
  };

  const handleCardInputChange = (field: keyof CreditCardInfo, value: string | boolean) => {
    if (field === 'cardNumber' && typeof value === 'string') {
      value = formatCardNumber(value);
    }
    
    setCardData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: keyof CreditCardInfo) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const getFieldError = (field: keyof CreditCardInfo) => {
    return touched[field] ? cardErrors[field] : null;
  };

  const getFieldClassName = (field: keyof CreditCardInfo) => {
    const baseClass = "w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors";
    const error = getFieldError(field);
    
    if (error) {
      return `${baseClass} border-red-300 bg-red-50`;
    }
    
    if (touched[field] && !error) {
      return `${baseClass} border-green-300 bg-green-50`;
    }
    
    return `${baseClass} border-gray-300`;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-green-100 rounded-lg">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
          <p className="text-sm text-gray-500">Choose how you'd like to pay for your order</p>
        </div>
      </div>

      {/* Payment Method Options */}
      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`
              relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200
              ${selectedPaymentMethod?.id === method.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
              }
            `}
            onClick={() => onPaymentMethodChange(method)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{method.icon}</div>
                <div>
                  <div className="font-medium text-gray-900">{method.name}</div>
                  {method.description && (
                    <div className="text-sm text-gray-500">{method.description}</div>
                  )}
                </div>
              </div>
              <div
                className={`
                  w-5 h-5 rounded-full border-2 transition-colors
                  ${selectedPaymentMethod?.id === method.id
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                  }
                `}
              >
                {selectedPaymentMethod?.id === method.id && (
                  <div className="w-full h-full rounded-full bg-white scale-50"></div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Credit Card Form */}
      {selectedPaymentMethod?.type === 'credit_card' && (
        <div className="bg-gray-50 rounded-xl p-6 space-y-6">
          <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Credit Card Information
          </h4>

          <div className="space-y-4">
            {/* Card Number */}
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Card Number *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="cardNumber"
                  value={cardData.cardNumber}
                  onChange={(e) => handleCardInputChange('cardNumber', e.target.value)}
                  onBlur={() => handleBlur('cardNumber')}
                  disabled={isSubmitting}
                  className={getFieldClassName('cardNumber')}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
                {cardData.cardNumber && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className={`
                      px-2 py-1 text-xs font-medium rounded
                      ${getCardType(cardData.cardNumber) === 'visa' ? 'bg-blue-100 text-blue-800' :
                        getCardType(cardData.cardNumber) === 'mastercard' ? 'bg-red-100 text-red-800' :
                        getCardType(cardData.cardNumber) === 'amex' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }
                    `}>
                      {getCardType(cardData.cardNumber).toUpperCase()}
                    </div>
                  </div>
                )}
              </div>
              {getFieldError('cardNumber') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('cardNumber')}</p>
              )}
            </div>

            {/* Expiry and CVV */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="expiryMonth" className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Month *
                </label>
                <select
                  id="expiryMonth"
                  value={cardData.expiryMonth}
                  onChange={(e) => handleCardInputChange('expiryMonth', e.target.value)}
                  onBlur={() => handleBlur('expiryMonth')}
                  disabled={isSubmitting}
                  className={getFieldClassName('expiryMonth')}
                >
                  <option value="">Month</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <option key={month} value={month.toString().padStart(2, '0')}>
                      {month.toString().padStart(2, '0')}
                    </option>
                  ))}
                </select>
                {getFieldError('expiryMonth') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('expiryMonth')}</p>
                )}
              </div>

              <div>
                <label htmlFor="expiryYear" className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Year *
                </label>
                <select
                  id="expiryYear"
                  value={cardData.expiryYear}
                  onChange={(e) => handleCardInputChange('expiryYear', e.target.value)}
                  onBlur={() => handleBlur('expiryYear')}
                  disabled={isSubmitting}
                  className={getFieldClassName('expiryYear')}
                >
                  <option value="">Year</option>
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(year => (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  ))}
                </select>
                {getFieldError('expiryYear') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('expiryYear')}</p>
                )}
              </div>

              <div>
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
                  CVV *
                </label>
                <input
                  type="text"
                  id="cvv"
                  value={cardData.cvv}
                  onChange={(e) => handleCardInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                  onBlur={() => handleBlur('cvv')}
                  disabled={isSubmitting}
                  className={getFieldClassName('cvv')}
                  placeholder="123"
                  maxLength={4}
                />
                {getFieldError('cvv') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('cvv')}</p>
                )}
              </div>
            </div>

            {/* Cardholder Name */}
            <div>
              <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name *
              </label>
              <input
                type="text"
                id="cardholderName"
                value={cardData.cardholderName}
                onChange={(e) => handleCardInputChange('cardholderName', e.target.value)}
                onBlur={() => handleBlur('cardholderName')}
                disabled={isSubmitting}
                className={getFieldClassName('cardholderName')}
                placeholder="John Doe"
              />
              {getFieldError('cardholderName') && (
                <p className="mt-1 text-sm text-red-600">{getFieldError('cardholderName')}</p>
              )}
            </div>

            {/* Save Card Option */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="saveCard"
                checked={cardData.saveCard}
                onChange={(e) => handleCardInputChange('saveCard', e.target.checked)}
                disabled={isSubmitting}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="saveCard" className="text-sm text-gray-700">
                Save this card for future purchases
              </label>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <div>
                <h5 className="text-sm font-medium text-blue-800">Your payment is secure</h5>
                <p className="text-sm text-blue-600 mt-1">
                  Your card information is encrypted and processed securely. We never store your card details.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alternative Payment Methods Info */}
      {selectedPaymentMethod && selectedPaymentMethod.type !== 'credit_card' && (
        <div className="bg-gray-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl">{selectedPaymentMethod.icon}</div>
            <div>
              <h4 className="text-lg font-medium text-gray-900">{selectedPaymentMethod.name}</h4>
              <p className="text-sm text-gray-600">{selectedPaymentMethod.description}</p>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              You'll be redirected to {selectedPaymentMethod.name} to complete your payment securely.
            </p>
          </div>
        </div>
      )}

      {/* Test Card Notice */}
      {selectedPaymentMethod?.type === 'credit_card' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h5 className="text-sm font-medium text-yellow-800">Test Mode</h5>
              <p className="text-sm text-yellow-700 mt-1">
                Use test card: <code className="bg-yellow-100 px-1 rounded">4242 4242 4242 4242</code> with any future expiry date and CVV.
                <br />
                Use <code className="bg-yellow-100 px-1 rounded">4000 0000 0000 0002</code> to test declined payments.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods; 