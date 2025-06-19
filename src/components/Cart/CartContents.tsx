import React, { useContext } from 'react';
import { useMutation } from '@apollo/client';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';

import { CartContext, Product } from '@/stores/CartProvider';
import LoadingSpinner from '../atoms/LoadingSpinner';
import Cta from '../atoms/Cta';
import BlocIntroSmall from '../atoms/BlocIntroSmall';

// Utils
import {
  UPDATE_CART,
  UPDATE_CART_ITEM_INSTALLATION,
} from '@/utils/gql/GQL_MUTATIONS';
import { useCartOperations } from '@/hooks/useCartOperations';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/utils/constants/PLACHOLDERS';
import Link from 'next/link';

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

const CartContents = () => {
  const { cart } = useContext(CartContext);
  const { refetchCart, isPro } = useCartOperations();

  const [updateCart, { loading: updateCartProcessing }] = useMutation(
    UPDATE_CART,
    {
      onCompleted: async () => {
        await refetchCart();
      },
    },
  );

  const [
    updateCartItemInstallation,
    { loading: updateInstallationProcessing },
  ] = useMutation(UPDATE_CART_ITEM_INSTALLATION, {
    onCompleted: async () => {
      await refetchCart();
    },
  });

  // Fonction pour gérer le changement de quantité d'un produit
  const handleQuantityChangeFormatted = async (
    event: React.ChangeEvent<HTMLInputElement>,
    cartKey: string,
    products: Product[],
  ) => {
    if (updateCartProcessing) {
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

    await updateCart({
      variables: {
        input: {
          clientMutationId: uuidv4(),
          items: updatedItems,
        },
      },
    });
  };

  // Fonction pour supprimer un produit
  const handleRemoveProductClick = async (cartKey: string) => {
    if (cart?.products?.length) {
      const updatedItems = getUpdatedItemsFromFormatted(
        cart.products,
        0,
        cartKey,
      );
      await updateCart({
        variables: {
          input: {
            clientMutationId: uuidv4(),
            items: updatedItems,
          },
        },
      });
    }
  };

  // Nouvelle fonction pour gérer l'ajout/suppression d'installation
  const handleInstallationToggle = async (
    cartKey: string,
    currentInstallationStatus?: boolean,
  ) => {
    if (updateInstallationProcessing) {
      return;
    }

    try {
      await updateCartItemInstallation({
        variables: {
          clientMutationId: uuidv4(),
          cartItemKey: cartKey,
          addInstallation: !currentInstallationStatus,
        },
      });

      // 🚀 Après la mise à jour, récupère à nouveau le panier
      refetchCart();
    } catch (error) {
      console.error('Erreur mise à jour installation:', error);
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
          <div key={item.cartKey}>
            <div className="relative">
              <div className="flex items-start gap-4 relative justify-between p-4 bg-white rounded-lg shadow-card hover:shadow-cardhover mb-4 duration-300">
                <div className="flex-shrink-0 flex w-24 xl:w-[136px] relative justify-center items-center self-center">
                  <Link href={`/nos-produits/${item.slug}`}>
                    <Image
                      src={item.image.sourceUrl || PRODUCT_IMAGE_PLACEHOLDER}
                      alt={item.name || 'Produit Automatisme Online'}
                      width={200}
                      height={200}
                      className="aspect-square object-contain"
                    />
                  </Link>
                </div>
                <div className="xl:flex xl:w-full xl:justify-between items-start w-full">
                  <div className="xl:flex-grow xl:mx-4 self-center">
                    <h2 className="font-bold text-primary text-sm xl:text-base leading-general xxl:max-w-[300px]">
                      {item.name}
                    </h2>
                    <p className="text-primary text-2xl font-bold pr-7 relative w-fit">
                      {(isPro ? parseFloat(item.subtotal) / item.qty : parseFloat(item.total) / item.qty).toFixed(2)}€{' '}
                      <span className="absolute right-0 top-1 text-xs">
                        {isPro ? 'HT' : 'TTC'}
                      </span>
                    </p>
                    <div className="text-dark-grey text-xs">
                      {item.deliveryLabel}
                    </div>
                  </div>
                  <div className="w-fit flex items-shrink max-xl:mt-6 lg:ml-auto">
                    <input
                      type="number"
                      min="1"
                      value={item.qty}
                      onChange={(event) =>
                        handleQuantityChangeFormatted(
                          event,
                          item.cartKey,
                          cart.products,
                        )
                      }
                      className="w-12 px-2 py-1 text-center border border-primary rounded-lg mr-2"
                    />
                    <Cta
                      slug="#"
                      label="Supprimer"
                      handleButtonClick={() =>
                        handleRemoveProductClick(item.cartKey)
                      }
                      variant="secondaryHollow"
                      size="default"
                      additionalClass={`max-w-fit min-w-0 ${
                        updateCartProcessing
                          ? 'opacity-50 pointer-events-none'
                          : ''
                      }`}
                    >
                      Supprimer
                    </Cta>
                  </div>
                </div>
              </div>
              {item.hasPose && !item.addInstallation && (
                <div className="absolute right-4 bottom-4 max-xl:static max-xl:mt-6">
                  <Cta
                    slug="#"
                    variant={`primary`}
                    label={`${"Ajouter une prestation d'installation"}`}
                    handleButtonClick={() =>
                      handleInstallationToggle(
                        item.cartKey,
                        item.addInstallation ?? false,
                      )
                    }
                    isFull
                  >
                    {"Ajouter une prestation d'installation"}
                  </Cta>
                </div>
              )}
            </div>
            {item.addInstallation ? (
              <div className="relative">
                <div className="flex items-start gap-4 relative justify-between p-4 bg-white rounded-lg shadow-card hover:shadow-cardhover mb-4 duration-300">
                  <div className="flex-shrink-0 flex w-24 xl:w-[136px] relative justify-center items-center self-center">
                    <Image
                      src={PRODUCT_IMAGE_PLACEHOLDER}
                      alt={item.name || 'Installation Automatisme Online'}
                      width={200}
                      height={200}
                      className="aspect-square object-contain"
                    />
                  </div>
                  <div className="xl:flex xl:w-full xl:justify-between items-start w-full">
                    <div className="xl:flex-grow xl:mx-4 self-center">
                      <h2 className="font-bold text-primary text-sm xl:text-base leading-general xxl:max-w-[300px]">
                        <div className="font-bold">
                          {"Prestation d'installation pour "}
                        </div>
                        <div className="text-dark-grey font-medium max-w-[250px]">
                          {`${item.name}`}
                        </div>
                        <div className="text-secondary font-bold">{`Quantité x ${item.qty}`}</div>
                      </h2>
                      <div className="text-primary">
                        {isPro ? (
                          <p className="text-2xl font-bold pr-7 relative w-fit">
                            {(item.installationPrice ? item.installationPrice - (item.installationTvaAmount || 0) : 0).toFixed(2)}€{' '}
                            <span className="absolute right-0 top-1 text-xs">
                              HT
                            </span>
                          </p>
                        ) : (
                          <>
                            <p className="text-2xl font-bold pr-7 relative w-fit">
                              {(item.installationPrice || 0).toFixed(2)}€{' '}
                              <span className="absolute right-0 top-1 text-xs">
                                TTC
                              </span>
                            </p>
                            <p className="text-sm text-dark-grey">
                              {(item.installationPrice ? item.installationPrice - (item.installationTvaAmount || 0) : 0).toFixed(2)}
                              € HT
                              <span className="ml-2">(TVA {((item.installationTvaRate || 0.2) * 100)}%)</span>
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {item.hasPose && item.addInstallation && (
                  <div className="absolute max-xl:static max-xl:mt-4 right-4 bottom-4">
                    <Cta
                      slug="#"
                      variant={'primaryHollow'}
                      label={`${"Supprimer la prestation d'installation"}`}
                      handleButtonClick={() =>
                        handleInstallationToggle(
                          item.cartKey,
                          item.addInstallation ?? false,
                        )
                      }
                      isFull
                    >
                      {"Supprimer la prestation d'installation"}
                    </Cta>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CartContents;
