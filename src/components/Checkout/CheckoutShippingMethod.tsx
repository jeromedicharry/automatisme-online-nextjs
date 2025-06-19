import React, { useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import BlocIntroSmall from '../atoms/BlocIntroSmall';
import { UPDATE_SHIPPING_METHOD } from '@/utils/gql/GQL_MUTATIONS';
import {
  GET_CART_SHIPPING_METHODS,
  GET_CART_SHIPPING_INFO,
} from '@/utils/gql/WOOCOMMERCE_QUERIES';

interface ShippingMethod {
  methodId: string;
  instanceId: number;
  label: string;
  cost: string;
}

const CheckoutShippingMethod = ({
  setIsShippingMethodComplete,
}: {
  setIsShippingMethodComplete: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [chosenMethod, setChosenMethod] = React.useState<string>('');

  const {
    data: shippingMethodsData,
    loading: loadingMethods,
    refetch: refetchMethods,
  } = useQuery(GET_CART_SHIPPING_METHODS);
  const { data: cartData } = useQuery(GET_CART_SHIPPING_INFO);

  const [updateShippingMethod] = useMutation(UPDATE_SHIPPING_METHOD, {
    refetchQueries: [
      { query: GET_CART_SHIPPING_METHODS },
      { query: GET_CART_SHIPPING_INFO },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      refetchMethods();
    },
  });

  const handleMethodChange = useCallback(
    async (methodId: string, instanceId: number) => {
      try {
        const methodIdentifier = `${methodId}:${instanceId}`;
        console.log('Sending mutation with input:', methodIdentifier);
        const response = await updateShippingMethod({
          variables: {
            input: {
              shippingMethods: [methodIdentifier],
            },
          },
        });
        console.log('Raw mutation response:', response);
        setChosenMethod(methodIdentifier);
      } catch (error) {
        console.error('Error updating shipping method:', error);
      }
    },
    [updateShippingMethod],
  );

  // Définir la méthode standard par défaut ou utiliser celle déjà sélectionnée
  useEffect(() => {
    if (!loadingMethods && cartData && shippingMethodsData) {
      const currentMethod = cartData?.cart?.chosenShippingMethods[0];
      console.log('Current shipping method:', currentMethod);

      if (currentMethod) {
        // Si une méthode est déjà sélectionnée, on la conserve
        setChosenMethod(currentMethod);
      } else if (
        shippingMethodsData?.cart?.availableShippingMethods[0]?.rates
      ) {
        // Sinon, on applique la méthode standard
        const standardMethod =
          shippingMethodsData.cart.availableShippingMethods[0].rates.find(
            (method: ShippingMethod) =>
              method.methodId === 'flat_rate' && method.instanceId === 2,
          );
        if (standardMethod) {
          handleMethodChange('flat_rate', 2);
        }
      }
    }
  }, [loadingMethods, shippingMethodsData, cartData, handleMethodChange]);

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
  }, [chosenMethod, setIsShippingMethodComplete]);

  if (loadingMethods) {
    return <div>Chargement des méthodes de livraison...</div>;
  }

  const shippingMethods: ShippingMethod[] =
    shippingMethodsData?.cart?.availableShippingMethods[0]?.rates || [];

  const getMethodDescription = (methodId: string, instanceId: number) => {
    if (methodId === 'flat_rate' && instanceId === 2) {
      return 'Recevez votre commande directement chez vous sous 3 à 5 jours ouvrés.';
    } else if (methodId === 'flat_rate' && instanceId === 3) {
      return 'Recevez votre commande directement chez vous sous 24 à 48h ouvrées.';
    } else if (methodId === 'local_pickup' && instanceId === 1) {
      return "Retirez votre commande directement en magasin dès qu'elle est prête.";
    }
    return '';
  };

  return (
    <section className="mt-2 md:mt-8">
      <BlocIntroSmall title="Sélectionnez votre méthode de livraison" />
      <div className="mt-4 flex flex-col gap-6">
        {shippingMethods.map((method: ShippingMethod) => (
          <label
            key={`${method.methodId}_${method.instanceId}`}
            htmlFor={`${method.methodId}_${method.instanceId}`}
            className={`flex items-start p-4 border rounded-lg transition-all duration-200 cursor-pointer hover:shadow-card ${
              chosenMethod === `${method.methodId}:${method.instanceId}`
                ? 'border-2 border-secondary bg-gray-50'
                : 'border-breadcrumb-grey'
            } ${method.methodId === 'flat_rate' && method.instanceId === 2 ? 'order-1' : ''} ${
              method.methodId === 'flat_rate' && method.instanceId === 3
                ? 'order-2'
                : ''
            } ${method.methodId === 'local_pickup' && method.instanceId === 1 ? 'order-4' : ''}`}
          >
            <div className="flex items-center h-5">
              <input
                id={`${method.methodId}_${method.instanceId}`}
                name="shipping_method"
                type="radio"
                checked={
                  chosenMethod === `${method.methodId}:${method.instanceId}`
                }
                onChange={() =>
                  handleMethodChange(method.methodId, method.instanceId)
                }
                className="w-5 h-5 text-primary border-primary focus:ring-secondary accent-secondary"
              />
            </div>
            <div className="ml-3 text-sm flex-1">
              <div className="font-medium text-primary flex justify-between items-center">
                <span>{method.label}</span>
                <span className="text-secondary font-bold">
                  {method.cost === '0.00' ? 'Gratuit' : `${method.cost}€`}
                </span>
              </div>
              <p className="text-dark-grey mt-1">
                {getMethodDescription(method.methodId, method.instanceId)}
              </p>
            </div>
          </label>
        ))}
      </div>
    </section>
  );
};

export default CheckoutShippingMethod;
