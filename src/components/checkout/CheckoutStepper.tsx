import React from 'react';
import { CheckoutStep } from '../../types';

interface CheckoutStepperProps {
  steps: CheckoutStep[];
  currentStep: number;
}

const CheckoutStepper: React.FC<CheckoutStepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="bg-white py-4 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between relative">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            const isLast = index === steps.length - 1;

            return (
              <div key={step.id} className="flex flex-col items-center relative z-10">
                {/* Step Circle */}
                <div
                  className={`
                    flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300
                    ${isCompleted 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : isActive 
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : 'bg-white border-gray-300 text-gray-500'
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>

                {/* Step Labels - All in one line */}
                <div className="mt-2 text-center min-w-max">
                  <div className="flex items-center gap-1">
                    <span
                      className={`
                        text-xs font-medium transition-colors duration-300
                        ${isActive 
                          ? 'text-blue-600' 
                          : isCompleted 
                          ? 'text-green-600' 
                          : 'text-gray-500'
                        }
                      `}
                    >
                      {step.title}
                    </span>
                    <span className="text-xs text-gray-400 hidden sm:inline">•</span>
                    <span className="text-xs text-gray-400 hidden sm:inline max-w-20 truncate">
                      {step.description}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Progress Line - Positioned behind steps */}
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10">
            <div
              className="h-full bg-blue-500 transition-all duration-500 ease-in-out"
              style={{
                width: `${((currentStep + 1) / steps.length) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Mobile Step Description */}
        <div className="mt-4 sm:hidden">
          <div className="text-center">
            <div className="text-sm font-medium text-gray-900">
              {steps[currentStep]?.title}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {steps[currentStep]?.description}
            </div>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="mt-4 text-center">
          <div className="text-xs text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </div>
          <div className="mt-2">
            <div className="bg-gray-200 rounded-full h-1.5 max-w-xs mx-auto">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-500 ease-in-out"
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutStepper; 