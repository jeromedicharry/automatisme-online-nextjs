import React, { useState, useMemo } from 'react';
import CheckoutAdresses from './CheckoutAdresses';
import CheckoutShippingMethod from './CheckoutShippingMethod';
import CheckoutSuccess from './CheckoutSuccess';
import CheckoutProInfos from './CheckoutProInfos';
import Stepper from './Stepper';
import CheckoutForm from './CheckoutForm';
import EmptyElement from '../EmptyElement';

export type stepTypes = 'Addresses' | 'Payment' | 'SuccessMessage';
const CheckoutSteps = () => {
  const [currentStep, setCurrentStep] = useState<stepTypes>('Addresses');
  const [error, setError] = useState(false);
  const [isAddressComplete, setIsAddressComplete] = useState(false);
  const [isProInfosComplete, setIsProInfosComplete] = useState(false);
  const [isShippingMethodComplete, setIsShippingMethodComplete] =
    useState(false);

  const memoizedCheckoutForm = useMemo(
    () => (
      <CheckoutForm
        onPaymentSuccess={() => setCurrentStep('SuccessMessage')}
        onPaymentError={() => {
          setError(true);
          // setCurrentStep('Addresses');
        }}
      />
    ),
    [],
  );

  if (error) {
    return (
      <EmptyElement
        title="Une erreur est survenue lors du paiement"
        subtitle="Veuillez procéder à nouveau au paiement de votre commande."
        ctaLabel="Retour au panier"
        ctaSlug="/panier"
        ctaType="secondary"
      />
    );
  }
  if (currentStep === 'Addresses') {
    console.log(
      isAddressComplete,
      isProInfosComplete,
      isShippingMethodComplete,
    );
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
    return memoizedCheckoutForm;
  }
  if (currentStep === 'SuccessMessage') {
    return <CheckoutSuccess />;
  }

  return null;
};

export default CheckoutSteps;
