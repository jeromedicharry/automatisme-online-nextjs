import React, { useState } from 'react';
import CheckoutAdresses from './CheckoutAdresses';
import CheckoutShippingMethod from './CheckoutShippingMethod';
import CheckoutPayment from './CheckoutPayment';
import CheckoutSuccess from './CheckoutSuccess';
import CheckoutProInfos from './CheckoutProInfos';
import Stepper from './Stepper';

export type stepTypes = 'Addresses' | 'Payment' | 'SuccessMessage';
const CheckoutSteps = () => {
  const [currentStep, setCurrentStep] = useState<stepTypes>('Addresses');
  const [isAddressComplete, setIsAddressComplete] = useState(false);
  const [isProInfosComplete, setIsProInfosComplete] = useState(false);
  const [isShippingMethodComplete, setIsShippingMethodComplete] =
    useState(false);
  if (currentStep === 'Addresses') {
    return (
      <>
        <CheckoutAdresses setCanProceed={setIsAddressComplete} />
        <CheckoutProInfos setIsProInfosComplete={setIsProInfosComplete} />
        <CheckoutShippingMethod
          setIsShippingMethodComplete={setIsShippingMethodComplete}
        />
        <Stepper
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          canProceed={
            isAddressComplete && isProInfosComplete && isShippingMethodComplete
          }
        />
      </>
    );
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
