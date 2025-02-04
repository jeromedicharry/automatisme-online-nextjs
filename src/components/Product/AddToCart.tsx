// Imports
import React, { useContext, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';

// Components
import Cta from '../atoms/Cta';

// State
import { CartContext } from '@/stores/CartProvider';
import { useIntermediateCart } from '@/stores/IntermediateCartContext';

// Utils
import { getFormattedCart } from '@/utils/functions/functions';

// GraphQL
import { GET_CART } from '@/utils/gql/WOOCOMMERCE_QUERIES';
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
  const { setCart } = useContext(CartContext);
  const { openCartModal } = useIntermediateCart();
  const [requestError, setRequestError] = useState<boolean>(false);

  const productId = product?.databaseId;

  const productQueryInput = {
    clientMutationId: uuidv4(),
    productId,
  };

  const { data, refetch } = useQuery(GET_CART, {
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      const updatedCart = getFormattedCart(data);

      if (!updatedCart) {
        return;
      }

      localStorage.setItem('woocommerce-cart', JSON.stringify(updatedCart));
      setCart(updatedCart);
    },
  });

  const [addToCart, { loading: addToCartLoading }] = useMutation(ADD_TO_CART, {
    variables: {
      input: productQueryInput,
    },
    onCompleted: () => {
      refetch();
      // Ouvrir la modale intermédiaire après l'ajout réussi
      openCartModal(product);
    },
    onError: () => {
      setRequestError(true);
    },
  });

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    await addToCart();
    // Refetch cart après 2 secondes
    setTimeout(() => {
      refetch();
    }, 2000);
  };

  return (
    <Cta
      handleButtonClick={(e) => handleAddToCart(e)}
      label="Ajouter au panier"
      variant={variant}
      size="large"
      slug="#"
      additionalClass={`w-full ${
        addToCartLoading || requestError ? 'opacity-50 pointer-events-none' : ''
      }`}
    >
      AJOUTER AU PANIER
    </Cta>
  );
};

export default AddToCart;
