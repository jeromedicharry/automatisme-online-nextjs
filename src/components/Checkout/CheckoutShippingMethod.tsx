import React, { useEffect } from 'react';
import BlocIntroSmall from '../atoms/BlocIntroSmall';

type ShippingMethod = 'home_delivery' | 'relais_delivery' | 'pickup' | 'none';

const CheckoutShippingMethod = ({
  setIsShippingMethodComplete,
}: {
  setIsShippingMethodComplete: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [chosenMethod, setChosenMethod] =
    React.useState<ShippingMethod>('none');
  useEffect(() => {
    if (
      !chosenMethod ||
      chosenMethod === undefined ||
      chosenMethod === 'none'
    ) {
      setIsShippingMethodComplete(false);
    } else {
      setIsShippingMethodComplete(true);
    }
  });

  const handleMethodChange = (method: ShippingMethod) => {
    setChosenMethod(method);
  };

  //Todo gérer le choix de la methode de livraison
  return (
    <section className="mt-10 md:mt-8">
      <BlocIntroSmall title="Sélectionnez votre méthode de livraison" />
      <div className="mt-4 space-y-4">
        <div
          className={`flex items-start p-4 border rounded-lg ${chosenMethod === 'home_delivery' ? 'border-2 border-secondary' : 'border-breadcrumb-grey hover:shadow-card'}`}
        >
          {' '}
          <div className="flex items-center h-5">
            <input
              id="home_delivery"
              name="shipping_method"
              type="radio"
              checked={chosenMethod === 'home_delivery'}
              onChange={() => handleMethodChange('home_delivery')}
              className={`w-5 h-5 text-primary border-primary focus:ring-secondary accent-secondary cursor-pointer`}
            />
          </div>
          <div className="ml-3 text-sm">
            <label
              htmlFor="home_delivery"
              className="font-medium text-primary cursor-pointer"
            >
              Livraison à domicile
            </label>
            <p className="text-dark-grey">
              Recevez votre commande directement chez vous sous 3 à 5 jours
              ouvrés.
            </p>
          </div>
        </div>

        <div
          className={`flex items-start p-4 border rounded-lg ${chosenMethod === 'relais_delivery' ? 'border-2 border-secondary' : 'border-breadcrumb-grey hover:shadow-card'}`}
        >
          {' '}
          <div className="flex items-center h-5">
            <input
              id="relais_delivery"
              name="shipping_method"
              type="radio"
              checked={chosenMethod === 'relais_delivery'}
              onChange={() => handleMethodChange('relais_delivery')}
              className={`cursor-pointer w-5 h-5 text-primary border-primary focus:ring-secondary accent-secondary`}
            />
          </div>
          <div className="ml-3 text-sm">
            <label
              htmlFor="relais_delivery"
              className="cursor-pointer font-medium text-primary"
            >
              Livraison en point relais
            </label>
            <p className="text-dark-grey">
              Récupérez votre commande dans le point relais de votre choix sous
              2 à 4 jours ouvrés.
            </p>
          </div>
        </div>

        <div
          className={`flex items-start p-4 border rounded-lg ${chosenMethod === 'pickup' ? 'border-2 border-secondary' : 'border-breadcrumb-grey hover:shadow-card'}`}
        >
          <div className="flex items-center h-5">
            <input
              id="pickup"
              name="shipping_method"
              type="radio"
              checked={chosenMethod === 'pickup'}
              onChange={() => handleMethodChange('pickup')}
              className={`cursor-pointer w-5 h-5 text-primary border-primary focus:ring-secondary accent-secondary`}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="pickup" className="font-medium text-primary">
              Récupérez le chez nous, 4 rue du Thal, 67210 Obernai. A 30 km de
              Strasbourg
            </label>
            <p className="cursor-pointer text-dark-grey">
              {
                "Retirez votre commande directement en magasin dès qu'elle est prête."
              }
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutShippingMethod;
