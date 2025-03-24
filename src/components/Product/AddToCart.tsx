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
import { ADD_TO_CART } from '@/utils/gql/GQL_MUTATIONS';
import { CardProductProps } from '@/types/blocTypes';

const AddToCart = ({
  product,
  variant = 'primaryHollow',
}: {
  product: CardProductProps;
  variant?:
    | 'primary'
    | 'primaryHollow'
    | 'primaryWhite'
    | 'secondary'
    | 'secondaryHollow';
}) => {
  const { openCartModal } = useIntermediateCart();
  const { refetchCart } = useCartOperations();

  const productId = product?.databaseId;

  const productQueryInput = {
    clientMutationId: uuidv4(),
    productId,
  };

  const [addToCart, { loading: addToCartLoading }] = useMutation(ADD_TO_CART, {
    variables: {
      input: productQueryInput,
    },
    onCompleted: async () => {
      await refetchCart();
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
      label="Ajouter au panier"
      variant={variant}
      size="large"
      slug="#"
      additionalClass={`w-full ${
        addToCartLoading ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      AJOUTER AU PANIER
    </Cta>
  );
};

export default AddToCart;
