import React, { useEffect, useCallback, useContext } from 'react';
import { useMutation } from '@apollo/client';
import BlocIntroSmall from '../atoms/BlocIntroSmall';
import {
  GET_DYNAMIC_SHIPPING_METHODS,
  SET_CART_SHIPPING_METHOD,
} from '@/utils/gql/GQL_MUTATIONS';
import { CartContext } from '@/stores/CartProvider';

const CheckoutShippingMethod = ({
  setIsShippingMethodComplete,
}: {
  setIsShippingMethodComplete: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { cart, setCart } = useContext(CartContext);
  const [loading, setLoading] = React.useState(true);
  const [methods, setMethods] = React.useState<Array<{
    id: string;
    label: string;
    cost: number;
    delayMin: number;
    delayMax: number;
    description: string;
  }>>([]);
  const [hasLoaded, setHasLoaded] = React.useState(false);

  // Mutation pour charger les méthodes de livraison dynamiques
  const [getDynamicMethods] = useMutation(GET_DYNAMIC_SHIPPING_METHODS, {
    onCompleted: (data) => {
      console.log('🔄 getDynamicMethods - Réponse complète:', data);
      const { cart: updatedCart } = data.setCartAndGetDynamicShippingMethods;
      console.log('🔄 getDynamicMethods - Cart reçu:', updatedCart);
      
      if (updatedCart?.dynamicShippingMethods) {
        console.log('✅ getDynamicMethods - Méthodes trouvées:', updatedCart.dynamicShippingMethods);
        setMethods(updatedCart.dynamicShippingMethods);
        
        if (cart) {
          const newCart = {
            ...cart,
            dynamicShippingMethods: updatedCart.dynamicShippingMethods,
            chosenShippingMethod: updatedCart.chosenShippingMethod || cart.chosenShippingMethod
          };
          console.log('💾 getDynamicMethods - Mise à jour du cart:', newCart);
          setCart(newCart);
        }
      } else {
        console.warn('⚠️ getDynamicMethods - Pas de méthodes dans la réponse');
      }
      
      setLoading(false);
      setHasLoaded(true);
    },
    onError: (error) => {
      console.error('❌ getDynamicMethods - Erreur:', error);
      setLoading(false);
      setHasLoaded(true);
    },
  });

  // Mutation pour définir la méthode de livraison
  const [setShippingMethod] = useMutation(SET_CART_SHIPPING_METHOD, {
    onCompleted: (data) => {
      console.log('🔄 setShippingMethod - Réponse complète:', data);
      if (data?.setCartShippingMethod?.cart) {
        console.log('✅ setShippingMethod - Cart mis à jour:', data.setCartShippingMethod.cart);
      } else {
        console.warn('⚠️ setShippingMethod - Pas de cart dans la réponse');
      }
      console.log('✅ Méthode de livraison mise à jour:', data);
      const { cart: updatedCart } = data.setCartShippingMethod;
      if (cart && updatedCart) {
        // Mettre à jour les deux states
        setCart({
          ...cart,
          chosenShippingMethod: updatedCart.chosenShippingMethod,
          dynamicShippingMethods: updatedCart.dynamicShippingMethods,
        });
        setMethods(updatedCart.dynamicShippingMethods);
        // Marquer l'étape comme complète si une méthode est sélectionnée
        setIsShippingMethodComplete(!!updatedCart.chosenShippingMethod);
      }
    },
    onError: (error) => {
      console.error('❌ Erreur lors de la mise à jour de la méthode:', error);
    },
  });

  // Gérer le chargement des méthodes
  const loadMethods = useCallback(async () => {
    if (!cart?.products?.length) {
      console.log('❌ Pas de produits dans le panier');
      setLoading(false);
      return;
    }

    if (!cart) {
      console.log('❌ Cart non initialisé');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      console.log('💬 Chargement des méthodes avec cart:', cart);
      const result = await getDynamicMethods({
        variables: {
          items: cart.products.map((product) => ({
            productId: product.productId,
            quantity: product.qty,
          })),
          country: cart.shippingAddress?.country || 'FR',
          postcode: cart.shippingAddress?.postcode || '',
          state: cart.shippingAddress?.state || '',
        },
      });
      
      console.log('💬 Résultat du chargement:', result.data);
    } catch (error) {
      console.error('❌ Erreur lors du chargement des méthodes:', error);
    } finally {
      setLoading(false);
    }
  }, [cart, getDynamicMethods]);

  // Charger les méthodes uniquement au montage initial
  useEffect(() => {
    if (!hasLoaded && cart) {
      console.log('💬 Premier chargement des méthodes, cart:', cart);
      loadMethods();
    }
  }, [hasLoaded, cart, loadMethods]);

  // Recharger les méthodes quand l'adresse change
  useEffect(() => {
    if (hasLoaded && cart?.shippingAddress) {
      console.log(
        "💬 Rechargement des méthodes après changement d'adresse, cart:",
        cart,
      );
      loadMethods();
    }
  }, [hasLoaded, cart, loadMethods]);

  // Gérer le changement de méthode
  const handleMethodChange = useCallback(
    async (methodId: string) => {
      console.log('🎯 handleMethodChange - Méthode cliquée:', methodId);
      console.log('📦 handleMethodChange - Cart actuel:', cart);
      
      try {
        // Si la méthode est déjà sélectionnée, ne rien faire
        if (cart?.chosenShippingMethod === methodId) {
          console.log('⏭️ handleMethodChange - Méthode déjà sélectionnée');
          return;
        }

        console.log('🚀 handleMethodChange - Envoi mutation avec:', { methodId });
        const result = await setShippingMethod({
          variables: { shippingMethodId: methodId }
        });

        console.log('✅ handleMethodChange - Réponse reçue:', result);
        const updatedCart = result.data?.setCartShippingMethod?.cart;

        if (cart && updatedCart?.chosenShippingMethod) {
          const newCart = {
            ...cart,
            chosenShippingMethod: updatedCart.chosenShippingMethod
          };
          console.log('💾 handleMethodChange - Mise à jour cart:', newCart);
          setCart(newCart);
          setIsShippingMethodComplete(true);
        } else {
          console.warn('⚠️ handleMethodChange - Pas de méthode choisie dans la réponse');
        }
      } catch (error) {
        console.error('❌ handleMethodChange - Erreur:', error);
      }
    },
    [cart, setCart, setShippingMethod, setIsShippingMethodComplete]
  );

  // Mettre à jour l'état de complétion
  useEffect(() => {
    setIsShippingMethodComplete(
      !!cart?.chosenShippingMethod && cart.chosenShippingMethod !== 'none',
    );
  }, [cart?.chosenShippingMethod, setIsShippingMethodComplete]);

  if (loading) {
    return <div>Chargement des méthodes de livraison...</div>;
  }

  const formatDeliveryTime = (delayMin: number, delayMax: number) => {
    if (delayMin === delayMax) {
      return `${delayMin} jour${delayMin > 1 ? 's' : ''} ouvré${delayMin > 1 ? 's' : ''}`;
    }
    return `${delayMin} à ${delayMax} jours ouvrés`;
  };

  return (
    <section className="mt-2 md:mt-8">
      <BlocIntroSmall title="Sélectionnez votre méthode de livraison" />
      <div className="mt-4">
        {loading ? (
          <div className="text-center py-4">
            <p>Chargement des méthodes de livraison...</p>
          </div>
        ) : methods?.length ? (
          <div className="flex flex-col gap-6">
            {methods.map((method) => {
              const isSelected = cart?.chosenShippingMethod === method.id;
              console.log(
                '💬 Rendu de la méthode:',
                method.id,
                'chosenMethod:',
                cart?.chosenShippingMethod,
              );
              return (
                <label
                  key={method.id}
                  htmlFor={method.id}
                  className={`flex items-start p-4 border rounded-lg transition-all duration-200 cursor-pointer hover:shadow-card ${
                    isSelected
                      ? 'border-2 border-secondary bg-gray-50'
                      : 'border-breadcrumb-grey'
                  } ${method.id === 'carrier_dynamic_express' ? 'order-1' : ''} ${
                    method.id === 'carrier_dynamic_relais' ? 'order-2' : ''
                  }`}
                >
                  <div className="flex items-center h-5">
                    <input
                      id={method.id}
                      name="shipping_method"
                      type="radio"
                      checked={isSelected}
                      onChange={() => handleMethodChange(method.id)}
                      className="w-5 h-5 text-primary border-primary focus:ring-secondary accent-secondary"
                    />
                  </div>
                  <div className="ml-3 text-sm flex-1">
                    <div className="font-medium text-primary flex justify-between items-center">
                      <span>{method.label}</span>
                      <span className="text-secondary font-bold">
                        {method.cost === 0
                          ? 'Gratuit'
                          : `${method.cost.toFixed(2)}€`}
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
