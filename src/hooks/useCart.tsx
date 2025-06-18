import { useQuery } from '@apollo/client';
import { createContext, useContext, ReactNode } from 'react';
import { GET_CART } from '@/utils/gql/WOOCOMMERCE_QUERIES';
import { getFormattedCart } from '@/utils/functions/functions';
import { CartContext } from '@/stores/CartProvider';

interface CartProviderProps {
  children: ReactNode;
}

interface CartContextType {
  refetchCart: () => Promise<any>;
}

export const CartOperationsContext = createContext<CartContextType>({
  refetchCart: async () => {},
});

export const CartProvider = ({ children }: CartProviderProps) => {
  const { setCart } = useContext(CartContext);

  const { refetch } = useQuery(GET_CART, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      const updatedCart = getFormattedCart(data);

      if (!updatedCart || !updatedCart.products.length) {
        localStorage.removeItem('woocommerce-cart');
        setCart(null);
        return;
      }
      localStorage.setItem('woocommerce-cart', JSON.stringify(updatedCart));
      setCart(updatedCart);
    },
  });

  return (
    <CartOperationsContext.Provider value={{ refetchCart: refetch }}>
      {children}
    </CartOperationsContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartOperationsContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
