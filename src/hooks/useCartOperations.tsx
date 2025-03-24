import { useContext } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CART } from '@/utils/gql/WOOCOMMERCE_QUERIES';
import { getFormattedCart } from '@/utils/functions/functions';
import { CartContext } from '@/stores/CartProvider';
import useAuth from './useAuth';

export const useCartOperations = () => {
  const { cart, setCart } = useContext(CartContext);
  const { isPro } = useAuth();

  const { refetch } = useQuery(GET_CART, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      const updatedCart = getFormattedCart(data, isPro);
      if (!updatedCart || !updatedCart.products.length) {
        localStorage.removeItem('woocommerce-cart');
        setCart(null);
        return;
      }
      localStorage.setItem('woocommerce-cart', JSON.stringify(updatedCart));
      setCart(updatedCart);
    },
  });

  return {
    cart,
    refetchCart: refetch,
    isPro
  };
};
