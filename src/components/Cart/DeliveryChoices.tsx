import React from 'react';
import BlocIntroSmall from '../atoms/BlocIntroSmall';

const DeliveryChoices = () => {
  return (
    <section>
      <BlocIntroSmall title="Mode de livraison" />
      <div className="px-4 py-4 md:py-6 bg-white rounded-lg shadow-card">
        <div className="text-3xl font-bold leading-general text-primary py-10">
          {' '}
          Liste des moyens de livraison attente BAck{' '}
        </div>
      </div>
    </section>
  );
};

export default DeliveryChoices;
