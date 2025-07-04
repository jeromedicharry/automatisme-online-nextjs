import React, { useEffect, useCallback, useContext } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import BlocIntroSmall from '../atoms/BlocIntroSmall';
import {
  SET_CART_ALEX_MUTATION,
  GET_ALEX_SHIPPING_METHOD,
  SET_CART_SHIPPING_METHOD,
} from '@/utils/gql/GQL_MUTATIONS';
import { CartContext } from '@/stores/CartProvider';



interface DynamicShippingMethod {
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
  const { cart, setCart } = useContext(CartContext);
  const [loading, setLoading] = React.useState(true);

  const { data: shippingMethodsData } = useQuery(GET_ALEX_SHIPPING_METHOD);
  const [setCartAlex] = useMutation(SET_CART_ALEX_MUTATION);
  const [setShippingMethod] = useMutation(SET_CART_SHIPPING_METHOD);

  const [methods, setMethods] = React.useState<DynamicShippingMethod[]>([]);
  const formatDeliveryTime = (delayMin: number, delayMax: number) => {
    if (delayMin === delayMax) {
      return `${delayMin} jours ouvrés`;
    }
    return `${delayMin} à ${delayMax} jours ouvrés`;
  };

  const loadMethods = useCallback(async () => {
    if (!cart?.shippingAddress) return;

    try {
      const { data } = await setCartAlex({
        variables: {
          items: cart.products.map((product) => ({
            productId: product.productId,
            quantity: product.qty
          })),
          country: cart.shippingAddress.country,
          postcode: cart.shippingAddress.postcode,
          state: cart.shippingAddress.state
        },
      });

      if (data?.setCart?.cart?.dynamicShippingMethods) {
        setMethods(data.setCart.cart.dynamicShippingMethods);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading shipping methods:', error);
      setLoading(false);
    }
  }, [cart, setCartAlex]);

  const handleShippingMethodChange = async (methodId: string) => {
    console.log('🚀 Changement de méthode - ID sélectionné:', methodId);
    console.log('🛒 État actuel du panier:', cart);

    try {
      const { data } = await setShippingMethod({
        variables: {
          shippingMethodId: methodId,
        },
      });

      console.log('📦 Réponse GraphQL:', data?.setShippingMethod?.cart);

      if (data?.setShippingMethod?.cart) {
        // Le schéma GraphQL utilise chosenShippingMethods mais notre type utilise chosenShippingMethod
        const { chosenShippingMethods, dynamicShippingMethods } = data.setShippingMethod.cart;
        console.log('✨ chosenShippingMethods reçu:', chosenShippingMethods);

        setCart({
          ...cart!,
          chosenShippingMethod: chosenShippingMethods, // Conversion du pluriel au singulier
          dynamicShippingMethods
        });
        console.log('✅ Nouveau panier après mise à jour:', {
          chosenShippingMethod: chosenShippingMethods,
          dynamicShippingMethods
        });
        setIsShippingMethodComplete(true);
      }
    } catch (error) {
      console.error('Error setting shipping method:', error);
      setCart({
        ...cart!,
        chosenShippingMethod: undefined
      });
      setIsShippingMethodComplete(false);
    }
  };

  useEffect(() => {
    if (cart?.shippingAddress) {
      loadMethods();
    }
  }, [cart?.shippingAddress, loadMethods]);

  useEffect(() => {
    if (shippingMethodsData?.cart?.dynamicShippingMethods) {
      setMethods(shippingMethodsData.cart.dynamicShippingMethods);
      setLoading(false);
    }
  }, [shippingMethodsData]);

  useEffect(() => {
    console.log('🔄 useEffect - chosenShippingMethod:', cart?.chosenShippingMethod);
    setIsShippingMethodComplete(
      !!cart?.chosenShippingMethod && cart.chosenShippingMethod !== 'none'
    );
  }, [cart?.chosenShippingMethod, setIsShippingMethodComplete]);

  if (loading) {
    return (
      <section className="mt-2 md:mt-8">
        <BlocIntroSmall title="Sélectionnez votre méthode de livraison" />
        <div className="mt-4">
          <div className="text-center py-4">
            <p>Chargement des méthodes de livraison...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-2 md:mt-8">
      <BlocIntroSmall title="Sélectionnez votre méthode de livraison" />
      <div className="mt-4">
        {methods.length > 0 ? (
          <div className="space-y-4">
            {methods.map((method) => {
              const isSelected = cart?.chosenShippingMethod === method.id;
              console.log(`🎯 Méthode ${method.id} - Selected:`, isSelected, '- Current:', cart?.chosenShippingMethod);

              return (
                <label
                  key={method.id}
                  className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                >
                  <div className="flex h-5 items-center">
                    <input
                      type="radio"
                      name="shipping-method"
                      value={method.id}
                      checked={isSelected}
                      onChange={() => handleShippingMethodChange(method.id)}
                      className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
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
                      {method.description} - Livraison sous{' '}
                      {formatDeliveryTime(method.delayMin, method.delayMax)}
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
