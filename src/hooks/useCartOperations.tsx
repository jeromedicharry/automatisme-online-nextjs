import { useContext, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CART } from '@/utils/gql/WOOCOMMERCE_QUERIES';
import { getFormattedCart } from '@/utils/functions/functions';
import { CartContext } from '@/stores/CartProvider';
import useAuth from './useAuth';

export const useCartOperations = () => {
  const { cart, setCart } = useContext(CartContext);
  const { isPro, loggedIn } = useAuth();

  const { refetch } = useQuery(GET_CART, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      console.log('Data NOW:', JSON.stringify(data, null, 2));

      const updatedCart = getFormattedCart(data, isPro);
      if (!updatedCart || !updatedCart.products.length) {
        setCart(null);
        return;
      }
      localStorage.setItem('woocommerce-cart', JSON.stringify(updatedCart));
      setCart(updatedCart);
    },
    onError: () => {
      console.error('Erreur lors de la récupération du panier');
    },
  });

  // Effet pour gérer la connexion
  useEffect(() => {
    if (loggedIn) {
      // À la connexion : on récupère le panier de l'utilisateur
      // WooCommerce fusionnera automatiquement avec le panier anonyme
      refetch().catch(console.error);
    }
  }, [loggedIn, refetch]);

  return {
    cart,
    refetchCart: refetch,
    isPro,
  };
};
