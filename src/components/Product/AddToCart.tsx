// Imports
import React from 'react';
import { useMutation } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';

// Components
import Cta from '../atoms/Cta';

// State
import { useIntermediateCart } from '@/stores/IntermediateCartContext';
import { useCartOperations } from '@/hooks/useCartOperations';

// GraphQL
import {
  ADD_TO_CART,
  UPDATE_CART_ITEM_INSTALLATION,
} from '@/utils/gql/GQL_MUTATIONS';
import { CardProductProps } from '@/types/blocTypes';

const AddToCart = ({
  product,
  variant = 'primaryHollow',
  isSingleProduct = false,
  addInstallation = false,
  isMeili = false,
  onAddToCart,
}: {
  product: CardProductProps;
  variant?:
    | 'primary'
    | 'primaryHollow'
    | 'primaryWhite'
    | 'secondary'
    | 'secondaryHollow';
  addInstallation?: boolean;
  isSingleProduct?: boolean;
  isMeili?: boolean;
  onAddToCart?: (quantity?: number) => void;
}) => {
  const { openCartModal } = useIntermediateCart();
  const { refetchCart } = useCartOperations();

  const productId = product?.databaseId;

  const productQueryInput = {
    clientMutationId: uuidv4(),
    productId,
  };

  // Mutation pour ajouter l'installation après ajout au panier
  const [updateCartItemInstallation] = useMutation(
    UPDATE_CART_ITEM_INSTALLATION,
    {
      onCompleted: async () => {
        await refetchCart();
      },
    },
  );

  // Gestion de l'ajout d'installation après ajout au panier
  const handleAddInstallation = async (cartKey: string) => {
    try {
      await updateCartItemInstallation({
        variables: {
          clientMutationId: uuidv4(),
          cartItemKey: cartKey,
          addInstallation: true,
        },
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'installation:", error);
    }
  };

  const [addToCart, { loading: addToCartLoading }] = useMutation(ADD_TO_CART, {
    variables: {
      input: productQueryInput,
    },
    onCompleted: async (data) => {
      // Si on a sélectionné l'installation et que le produit a été ajouté avec succès
      if (addInstallation && data?.addToCart?.cartItem?.key) {
        await handleAddInstallation(data.addToCart.cartItem.key);
      }

      await refetchCart();
      // Déclencher le tracking add_to_cart
      onAddToCart?.(1);
      openCartModal(product);
    },
  });

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    await addToCart();
  };

  return (
    <Cta
      handleButtonClick={handleAddToCart}
      label={
        addInstallation ? 'Ajouter avec installation' : 'AJOUTER AU PANIER'
      }
      variant={variant}
      size="large"
      slug="#"
      additionalClass={`${isSingleProduct ? '' : 'w-full'} ${
        addToCartLoading ? 'opacity-50 pointer-events-none' : ''
      }`}
      isMeili={isMeili}
    >
      {addInstallation ? 'Ajouter avec installation' : 'Ajouter au panier'}
    </Cta>
  );
};

export default AddToCart;
