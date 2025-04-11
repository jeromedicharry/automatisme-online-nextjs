import React from 'react';
import Cta from '../atoms/Cta';
import { stepTypes } from '.';

const Stepper = ({
  currentStep,
  setCurrentStep,
  canProceed,
}: {
  currentStep: stepTypes;
  setCurrentStep: (step: stepTypes) => void;
  canProceed: boolean;
}) => {
  return (
    <div className="flex justify-start max-md:flex-col max-md:items-stretch mt-6 md:w-fit gap-4 ml-auto">
      {currentStep === 'Addresses' && (
        <>
          <Cta
            slug="/panier"
            label="Retourner au panier"
            size="default"
            variant="primaryHollow"
            additionalClass="max-md:w-full"
          >
            {'Retourner au panier'}
          </Cta>
          <Cta
            slug="#"
            label={
              canProceed
                ? 'Continuer vers le paiement'
                : 'Informations manquantes'
            }
            handleButtonClick={() => setCurrentStep('Payment')}
            disabled={!canProceed}
            size="default"
            variant="primary"
            additionalClass={`max-md:w-full ${!canProceed && 'cursor-not-allowed opacity-50'}`}
          >
            Continuer vers le paiement
          </Cta>
        </>
      )}
      {currentStep === 'Payment' && (
        <>
          <Cta
            slug="#"
            label="Retourner aux adresses"
            size="default"
            variant="primaryHollow"
            handleButtonClick={() => setCurrentStep('Addresses')}
            additionalClass="max-md:w-full"
          >
            {'Retourner aux adresses'}
          </Cta>
          <Cta
            slug="#"
            label="Continuer"
            handleButtonClick={() => setCurrentStep('SuccessMessage')}
            disabled={!canProceed}
            size="default"
            variant="primary"
            additionalClass="max-md:w-full"
          >
            Passer la commande
          </Cta>
        </>
      )}
    </div>
  );
};

export default Stepper;
