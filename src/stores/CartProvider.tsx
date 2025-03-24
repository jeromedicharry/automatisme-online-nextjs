import React, {
  useState,
  useEffect,
  createContext,
  ReactElement,
  JSXElementConstructor,
  ReactFragment,
  ReactPortal,
} from 'react';
import { useQuery } from '@apollo/client';
import { GET_CART } from '@/utils/gql/WOOCOMMERCE_QUERIES';
import { getFormattedCart } from '@/utils/functions/functions';
import useAuth from '@/hooks/useAuth';

interface ICartProviderProps {
  children:
    | string
    | number
    | boolean
    | ReactElement<any, string | JSXElementConstructor<any>>
    | ReactFragment
    | ReactPortal
    | null
    | undefined;
}

interface Image {
  sourceUrl?: string;
  srcSet?: string;
  title: string;
}

export interface Product {
  cartKey: string;
  name: string;
  qty: number;
  price: number;
  totalPrice: number;
  image: Image;
  productId: number;
}

export interface RootObject {
  products: Product[];
  totalProductsCount: number;
  totalProductsPrice: number;
  totalTax: number;
}

export type TRootObject = RootObject | string | null | undefined;

export type TRootObjectNull = RootObject | null | undefined;

interface ICartContext {
  cart: RootObject | null | undefined;
  setCart: React.Dispatch<React.SetStateAction<TRootObjectNull>>;
  refetchCart: () => Promise<any>;
}

const CartState = {
  cart: null,
  setCart: () => {},
  refetchCart: async () => {},
};

export const CartContext = createContext<ICartContext>(CartState);

/**
 * Provides a global application context for the entire application with the cart contents
 */
export const CartProvider = ({ children }: ICartProviderProps) => {
  const [cart, setCart] = useState<RootObject | null>();
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

  useEffect(() => {
    // Check if we are client-side before we access the localStorage
    if (typeof window === 'undefined') {
      return;
    }
    const localCartData = localStorage.getItem('woocommerce-cart');
    if (localCartData) {
      try {
        const cartData: RootObject = JSON.parse(localCartData);
        setCart(cartData);
      } catch (error) {
        console.error('Error parsing cart data:', error);
      }
    }
  }, []);

  return (
    <CartContext.Provider value={{ cart, setCart, refetchCart: refetch }}>
      {children}
    </CartContext.Provider>
  );
};
