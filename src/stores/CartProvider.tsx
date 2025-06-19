import React, { useState, useEffect, createContext, ReactNode } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_TO_CART } from '@/utils/gql/GQL_MUTATIONS';

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
  total: string; // Prix total TTC
  subtotal: string; // Prix total HT
  image: Image;
  productId: number;
  hasPose?: boolean; // Indique si le produit est éligible à l'installation
  addInstallation?: boolean; // Indique si l'installation est sélectionnée
  installationPrice?: number; // Prix de l'installation TTC
  installationTvaRate?: number; // Taux de TVA pour l'installation (0.2 par défaut, 0.1 pour TVA réduite)
  installationTvaAmount?: number; // Montant de la TVA pour l'installation
  deliveryLabel?: string; // Délai de livraison calculé à l'ajout au panier
}

export interface RootObject {
  products: Product[];
  totalProductsCount: number;
  totalProductsPrice: number;
  totalTax: number;
  subtotal: number;
  total: number;
  shippingTax: number;
  discountTotal: number; // Montant total des réductions
  discountTax: number; // TVA sur les réductions
  appliedCoupons: { code: string; discountAmount: string }[]; // Liste des coupons appliqués avec leur montant
}

export type TRootObject = RootObject | string | null | undefined;
export type TRootObjectNull = RootObject | null | undefined;

interface ICartContext {
  cart: RootObject | null | undefined;
  setCart: React.Dispatch<React.SetStateAction<TRootObjectNull>>;
  resyncFromLocalStorage: () => Promise<void>;
}

const CartState = {
  cart: null,
  setCart: () => {},
  resyncFromLocalStorage: async () => {}
};

export const CartContext = createContext<ICartContext>(CartState);

export const CartProvider = ({ children }: ICartProviderProps) => {
  const [cart, setCart] = useState<RootObject | null>();
  const [addToCartMutation] = useMutation(ADD_TO_CART);

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
  const resyncFromLocalStorage = async () => {
    const localCartData = localStorage.getItem('woocommerce-cart');
    if (localCartData) {
      try {
        const cartData: RootObject = JSON.parse(localCartData);
        // 1. Mettre à jour le state local
        setCart(cartData);
        // 2. Resynchroniser avec le backend
        for (const item of cartData.products) {
          await addToCartMutation({
            variables: {
              input: {
                productId: item.productId,
                quantity: item.qty
              }
            }
          });
          // Ajouter l'installation si nécessaire
          if (item.addInstallation) {
            // TODO: Appeler la mutation pour ajouter l'installation
          }
        }
      } catch (error) {
        console.error('Error resyncing cart:', error);
      }
    }
  };

  return (
    <CartContext.Provider value={{ cart, setCart, resyncFromLocalStorage }}>
      {children}
    </CartContext.Provider>
  );
};
