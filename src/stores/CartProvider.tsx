import React, { useState, useEffect, createContext, ReactNode } from 'react';

interface ICartProviderProps {
  children: ReactNode;
}

interface Image {
  sourceUrl?: string;
  srcSet?: string;
  title: string;
}

export interface Product {
  cartKey: string;
  slug: string;
  name: string;
  qty: number;
  price: number;
  totalPrice: number;
  image: Image;
  productId: number;
  slug: string;
  hasPose?: boolean; // Indique si le produit est éligible à l'installation
  addInstallation?: boolean; // Indique si l'installation est sélectionnée
  installationPrice?: number; // Prix de l'installation
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

export const CartProvider = ({ children }: ICartProviderProps) => {
  const [cart, setCart] = useState<RootObject | null>();

  useEffect(() => {
    if (typeof window === 'undefined') return;

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
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};
