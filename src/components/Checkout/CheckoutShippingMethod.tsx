import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALEX_SHIPPING_METHOD, SET_CART_SHIPPING_METHOD } from '@/utils/gql/GQL_MUTATIONS';
import { GET_CART } from '@/utils/gql/WOOCOMMERCE_QUERIES';
import BlocIntroSmall from '../atoms/BlocIntroSmall';

interface ShippingMethod {
  id: string;
  label: string;
  cost: string;
  delayMin: number;
  delayMax: number;
  description: string;
}

const CheckoutShippingMethod = ({
  setIsShippingMethodComplete,
}: {
  setIsShippingMethodComplete: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [loading, setLoading] = useState(true);

  // Récupérer les méthodes de livraison du backend
  const { data: shippingMethodsData, refetch: refetchShippingMethods } = useQuery(GET_ALEX_SHIPPING_METHOD);
  const { refetch: refetchCart } = useQuery(GET_CART);
  const [setShippingMethod] = useMutation(SET_CART_SHIPPING_METHOD);

  // Gérer le changement manuel de méthode de livraison
  const handleShippingMethodChange = async (methodId: string) => {
    try {
      const response = await setShippingMethod({
        variables: {
          shippingMethodId: methodId,
        },
      });
      console.log('=== SET_CART_SHIPPING_METHOD RESPONSE ===');
      console.log('Response:', response);
      console.log('Cart data:', response.data?.setShippingMethod?.cart);
      console.log('Shipping total:', response.data?.setShippingMethod?.cart?.shippingTotal);
      console.log('Shipping tax:', response.data?.setShippingMethod?.cart?.shippingTax);
      
      // Après la mutation, rafraîchir les données pour mettre à jour l'UI
      await Promise.all([
        refetchShippingMethods(),
        refetchCart()
      ]);
      setIsShippingMethodComplete(true);
    } catch (error) {
      console.error('Error setting shipping method:', error);
      setIsShippingMethodComplete(false);
    }
  };

  // Formater le temps de livraison
  const formatDeliveryTime = (delayMin: number, delayMax: number) => {
    if (delayMin === delayMax) {
      return `${delayMin} jours ouvrés`;
    }
    return `${delayMin} à ${delayMax} jours ouvrés`;
  };

  // Vérifier si une méthode est sélectionnée
  useEffect(() => {
    console.log('=== GET_ALEX_SHIPPING_METHOD RESPONSE ===');
    console.log('Full response:', JSON.stringify(shippingMethodsData, null, 2));
    console.log('\n=== PARSED DATA ===');
    console.log('Cart:', shippingMethodsData?.cart);
    console.log('Dynamic methods:', shippingMethodsData?.cart?.dynamicShippingMethods);
    if (shippingMethodsData?.cart?.dynamicShippingMethods) {
      console.log('First dynamic method:', shippingMethodsData.cart.dynamicShippingMethods[0]);
    }
    console.log('\n=== CHOSEN METHOD ===');
    console.log('Chosen methods array:', shippingMethodsData?.cart?.chosenShippingMethods);
    if (shippingMethodsData?.cart?.chosenShippingMethods?.length > 0) {
      console.log('Current chosen method:', shippingMethodsData.cart.chosenShippingMethods[0]);
      setIsShippingMethodComplete(true);
    }
    setLoading(false);
  }, [shippingMethodsData, setIsShippingMethodComplete]);

  if (loading) {
    return (
      <section>
        <BlocIntroSmall title="Sélectionnez votre méthode de livraison" />
        <div className="mt-4">
          <div className="text-center py-4">
            <p>Chargement des méthodes de livraison...</p>
          </div>
        </div>
      </section>
    );
  }

  const chosenMethodId = shippingMethodsData?.cart?.chosenShippingMethods?.[0];
  const methods = shippingMethodsData?.cart?.dynamicShippingMethods || [];

  return (
    <section>
      <BlocIntroSmall title="Sélectionnez votre méthode de livraison" />
      <div className="mt-4">
        {methods.length > 0 ? (
          <div className="space-y-4">
            {methods.map((method: ShippingMethod) => {
              // Vérifier si la méthode est sélectionnée en comparant avec l'ID choisi
              const isSelected = chosenMethodId === method.id;
              
              // Pour les méthodes carrier_dynamic, vérifier aussi le type (relais/express)
              const isRelaisSelected = chosenMethodId === 'carrier_dynamic_relais' && 
                                     method.id === 'carrier_dynamic' && 
                                     method.label.toLowerCase().includes('relais');

              return (
                <label
                  key={method.id}
                  className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                    isSelected || isRelaisSelected
                      ? 'border-secondary bg-white'
                      : 'border-light-grey hover:border-secondary'
                  }`}
                >
                  <div className="flex h-5 items-center">
                    <input
                      type="radio"
                      name="shipping-method"
                      value={method.id}
                      checked={isSelected || isRelaisSelected}
                      onChange={() => handleShippingMethodChange(
                        // Si c'est une méthode relais, utiliser carrier_dynamic_relais
                        method.label.toLowerCase().includes('relais') ? 'carrier_dynamic_relais' : method.id
                      )}
                      className="h-4 w-4 border-gray-300 text-primary focus:ring-secondary accent-secondary"
                    />
                  </div>
                  <div className="ml-3 text-sm flex-1">
                    <div className="font-medium text-primary flex justify-between items-center">
                      <span>{method.label}</span>
                      <span className="text-secondary font-bold">
                        {method.cost === '0' || method.cost === '0.00'
                          ? 'Gratuit'
                          : `${parseFloat(method.cost).toFixed(2)}€`}
                      </span>
                    </div>
                    <p className="text-dark-grey mt-1">
                      {method.description} - Livraison sous {formatDeliveryTime(method.delayMin, method.delayMax)}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-4">
            <p>Aucune méthode de livraison disponible.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CheckoutShippingMethod;
