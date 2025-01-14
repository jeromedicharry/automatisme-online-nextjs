import React, { useEffect, useState } from 'react';
import { AdyenCheckout } from '@adyen/adyen-web';
// import '@adyen/adyen-web/dist/adyen.css';

const AdyenComponent = () => {
  const [checkoutInstance, setCheckoutInstance] = useState(null);

  useEffect(() => {
    console.log('key', process.env.NEXT_PUBLIC_ADYEN_CLIENT_KEY);
    const initializeCheckout = async () => {
      try {
        const checkout = await AdyenCheckout({
          environment: 'test', // Remplacez par 'live' en production
          clientKey: process.env.NEXT_PUBLIC_ADYEN_CLIENT_KEY,
          paymentMethodsResponse: {}, // Récupérez vos méthodes de paiement via l'API Adyen
          countryCode: 'FR', // Par exemple, 'FR' pour la France
        });

        console.log('checkout', JSON.stringify(checkout));

        setCheckoutInstance(checkout);
      } catch (error) {
        console.error(
          "Erreur lors de l'initialisation d'AdyenCheckout :",
          error,
        );
      }
    };

    initializeCheckout();
  }, []);

  if (!checkoutInstance) {
    return <div>Chargement...</div>; // Affichez un loader pendant l'initialisation
  }

  return (
    <div>
      <div id="dropin-container" />
    </div>
  );
};

export default AdyenComponent;
