import React, { useState } from 'react';
import CheckoutAdresses from './CheckoutAdresses';
import CheckoutShippingMethod from './CheckoutShippingMethod';
import CheckoutPayment from './CheckoutPayment';
import CheckoutSuccess from './CheckoutSuccess';
import CheckoutProInfos from './CheckoutProInfos';

export type stepTypes =
  | 'Adresses'
  | 'ProInfos'
  | 'ShippingMethod'
  | 'Payment'
  | 'SuccessMessage';
const CheckoutSteps = () => {
  const [currentStep, setCurrentStep] = useState<stepTypes>('Adresses');
  if (currentStep === 'Adresses') {
    return <CheckoutAdresses setCurrentStep={setCurrentStep} />;
  }
  if (currentStep === 'ProInfos') {
    return <CheckoutProInfos setCurrentStep={setCurrentStep} />;
  }
  if (currentStep === 'ShippingMethod') {
    return <CheckoutShippingMethod />;
  }
  if (currentStep === 'Payment') {
    return <CheckoutPayment />;
  }
  if (currentStep === 'SuccessMessage') {
    return <CheckoutSuccess />;
  }

  return null;
};

export default CheckoutSteps;
