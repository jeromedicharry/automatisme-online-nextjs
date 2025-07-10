import React, { useEffect, useCallback, useContext } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import BlocIntroSmall from '../atoms/BlocIntroSmall';
import {
  SET_CART_ALEX_MUTATION,
  GET_ALEX_SHIPPING_METHOD,
  SET_CART_SHIPPING_METHOD,
} from '@/utils/gql/GQL_MUTATIONS';
import { GET_CART } from '@/utils/gql/WOOCOMMERCE_QUERIES';
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
  const { refetch: refetchCart } = useQuery(GET_CART);
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
            quantity: product.qty,
          })),
          country: cart.shippingAddress.country,
          postcode: cart.shippingAddress.postcode,
          state: cart.shippingAddress.state,
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
    try {
      // 1. Appliquer la méthode de livraison
      const { data } = await setShippingMethod({
        variables: {
          shippingMethodId: methodId,
        },
      });

      if (data?.setShippingMethod?.cart) {
        // 2. Mettre à jour le contexte du panier avec la méthode sélectionnée
        setCart({
          ...cart!,
          chosenShippingMethod:
            data.setShippingMethod.cart.chosenShippingMethods,
        });

        // 3. Rafraîchir le panier pour avoir les nouvelles données à jour
        await refetchCart();

        // 4. Mettre à jour l'état de complétion
        setIsShippingMethodComplete(true);
      }
    } catch (error) {
      console.error('Error setting shipping method:', error);
      setCart({
        ...cart!,
        chosenShippingMethod: undefined,
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
    const hasValidShippingMethod = Array.isArray(cart?.chosenShippingMethod)
      ? cart.chosenShippingMethod.length > 0 &&
        !cart.chosenShippingMethod.includes('none')
      : !!cart?.chosenShippingMethod && cart.chosenShippingMethod !== 'none';

    setIsShippingMethodComplete(hasValidShippingMethod);
  }, [cart?.chosenShippingMethod, setIsShippingMethodComplete]);

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

  return (
    <section>
      <BlocIntroSmall title="Sélectionnez votre méthode de livraison" />
      <div className="mt-4">
        {methods.length > 0 ? (
          <div className="space-y-4">
            {methods.map((method) => {
              const isSelected = Array.isArray(cart?.chosenShippingMethod)
                ? cart?.chosenShippingMethod.includes(method.id)
                : cart?.chosenShippingMethod === method.id;

              return (
                <label
                  key={method.id}
                  className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? 'border-secondary bg-white'
                      : 'border-light-grey hover:border-secondary'
                  }`}
                >
                  <div className="flex h-5 items-center">
                    <input
                      type="radio"
                      name="shipping-method"
                      value={method.id}
                      checked={isSelected}
                      onChange={() => handleShippingMethodChange(method.id)}
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
