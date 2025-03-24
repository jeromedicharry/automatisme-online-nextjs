import React, { useContext } from 'react';
import { useMutation } from '@apollo/client';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';

import { CartContext, Product } from '@/stores/CartProvider';
import LoadingSpinner from '../atoms/LoadingSpinner';
import Cta from '../atoms/Cta';

import { getFormattedCart } from '@/utils/functions/functions';

import { UPDATE_CART } from '@/utils/gql/GQL_MUTATIONS';
import BlocIntroSmall from '../atoms/BlocIntroSmall';

// Nouvelle fonction adaptée pour les produits formatés
const getUpdatedItemsFromFormatted = (
  products: Product[],
  newQty: number,
  cartKey: string,
) => {
  // Transforme les produits formatés en format attendu par l'API WooCommerce
  return products.map((product) => {
    if (product.cartKey === cartKey) {
      return {
        key: product.cartKey,
        quantity: newQty,
      };
    }
    return {
      key: product.cartKey,
      quantity: product.qty,
    };
  });
};

const CartContents = ({
  isProSession,
  refetch,
}: {
  isProSession: boolean;
  refetch: () => Promise<any>;
}) => {
  const { cart, setCart } = useContext(CartContext);

  const [updateCart, { loading: updateCartProcessing }] = useMutation(
    UPDATE_CART,
    {
      onCompleted: async () => {
        try {
          const { data: newData } = await refetch();
          if (!newData || !newData.cart) return;

          const updatedCart = getFormattedCart(newData, isProSession);
          if (updatedCart) {
            localStorage.setItem(
              'woocommerce-cart',
              JSON.stringify(updatedCart),
            );
            // Force le re-render avec le nouveau state
            await Promise.resolve();
            setCart(updatedCart);
          }
        } catch (error) {
          console.error('Error updating cart:', error);
        }
      },
    },
  );

  // Fonction pour gérer le changement de quantité d'un produit
  const handleQuantityChangeFormatted = (
    event: React.ChangeEvent<HTMLInputElement>,
    cartKey: string,
    products: Product[],
    updateCart: any,
    loading: boolean,
  ) => {
    if (loading) {
      return;
    }

    const newQty = parseInt(event.target.value, 10);

    // Vérifier si la quantité est valide
    if (newQty < 1) {
      return;
    }

    const updatedItems = getUpdatedItemsFromFormatted(
      products,
      newQty,
      cartKey,
    );

    updateCart({
      variables: {
        input: {
          clientMutationId: uuidv4(),
          items: updatedItems,
        },
      },
    });
  };

  // Fonction pour supprimer un produit
  const handleRemoveProductClick = (cartKey: string) => {
    if (cart?.products?.length) {
      const updatedItems = getUpdatedItemsFromFormatted(
        cart.products,
        0,
        cartKey,
      );
      updateCart({
        variables: {
          input: {
            clientMutationId: uuidv4(),
            items: updatedItems,
          },
        },
      });
    }
  };

  // Vérification si le panier est chargé
  if (!cart || !cart.products) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <section>
      <BlocIntroSmall title="Détails de votre panier" />

      <div className="flex flex-col gap-6">
        {cart.products.map((item) => (
          <div
            key={item.cartKey}
            className="flex items-start justify-between p-4 bg-white rounded-lg shadow-card hover:shadow-cardhover mb-4 duration-300"
          >
            <div className="flex-shrink-0 flex w-[136px] relative justify-center items-center self-center">
              <Image
                src={item.image.sourceUrl || '/placeholder.png'}
                alt={item.name || 'Produit Automatisme Online'}
                width={200}
                height={200}
                className="aspect-square object-contain"
              />
            </div>
            <div className="flex-grow mx-4 self-center">
              <h2 className="font-bold text-primary">{item.name}</h2>
              <p>Avis vérifiés</p>
              <p className="text-primary text-2xl font-bold pr-7 relative w-fit">
                {item.price.toFixed(2)}€{' '}
                <span className="absolute right-0 top-1 text-xs">
                  {isProSession ? 'HT' : 'TTC'}
                </span>
              </p>
              <div className="text-dark-grey text-xs">
                Expédition sous 10 jours
              </div>
            </div>
            <div className="flex items-shrink">
              <input
                type="number"
                min="1"
                value={item.qty}
                onChange={(event) => {
                  handleQuantityChangeFormatted(
                    event,
                    item.cartKey,
                    cart.products,
                    updateCart,
                    updateCartProcessing,
                  );
                }}
                className="w-12 px-2 py-1 text-center border border-primary rounded-lg mr-2"
              />
              <Cta
                slug="#"
                label="Supprimer"
                handleButtonClick={() => handleRemoveProductClick(item.cartKey)}
                variant="secondaryHollow"
                size="default"
                additionalClass={`max-w-fit min-w-0 ${
                  updateCartProcessing ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                Supprimer
              </Cta>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CartContents;
