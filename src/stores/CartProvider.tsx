import React, {
  useState,
  useEffect,
  createContext,
  ReactElement,
  JSXElementConstructor,
  ReactFragment,
  ReactPortal,
} from 'react';

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
  // upsell: { nodes: CardProductProps[] };
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
}

const CartState = {
  cart: null,
  setCart: () => {},
};

export const CartContext = createContext<ICartContext>(CartState);

/**
 * Provides a global application context for the entire application with the cart contents

 */
export const CartProvider = ({ children }: ICartProviderProps) => {
  const [cart, setCart] = useState<RootObject | null>();

  useEffect(() => {
    // Check if we are client-side before we access the localStorage
    if (typeof window === 'undefined') {
      console.log('ici');
      return;
    }
    const localCartData = localStorage.getItem('woocommerce-cart');
    if (localCartData) {
      try {
        const cartData: RootObject = JSON.parse(localCartData);
        console.log('Cart data from localStorage:', cartData);
        setCart(cartData);
      } catch (error) {
        console.error('Error parsing cart data:', error);
      }
    }
  }, []);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};
