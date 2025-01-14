import React from 'react';
import { SubmitHandler, useForm, FormProvider } from 'react-hook-form';
import { InputField } from '@/components/Input/InputField.component';
import Button from '../UI/Button.component';
import { INPUT_FIELDS } from '@/utils/constants/INPUT_FIELDS';
import { ICheckoutDataProps } from '@/utils/functions/functions';
import AdyenComponent from './AdyenComponent';

interface IBillingProps {
  handleFormSubmit: SubmitHandler<ICheckoutDataProps>;
}

const Billing = ({ handleFormSubmit }: IBillingProps) => {
  const methods = useForm<ICheckoutDataProps>();

  return (
    <section className="text-gray-700 container p-4 py-2 mx-auto mb-[8rem] md:mb-0 flex gap-8">
      {/* Formulaire de facturation */}
      <div className="lg:w-1/2">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleFormSubmit)}>
            <div className="mx-auto flex flex-wrap">
              {INPUT_FIELDS.map(({ id, label, name, customValidation }) => (
                <InputField
                  key={id}
                  inputLabel={label}
                  inputName={name}
                  customValidation={customValidation}
                />
              ))}
              <div className="mt-4 flex justify-center">
                <Button>COMMANDER</Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>

      {/* Méthodes de paiement */}
      <div className="lg:w-1/2">
        <h2 className="text-lg font-bold mb-4">Méthodes de paiement</h2>
        <AdyenComponent />
      </div>
    </section>
  );
};

export default Billing;
