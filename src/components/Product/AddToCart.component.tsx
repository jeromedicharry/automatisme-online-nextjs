// Imports
import React, { useContext, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { v4 as uuidv4 } from 'uuid';

// Components
import Cta from '../atoms/Cta';

// State
import { CartContext } from '@/stores/CartProvider';

// Utils
import { getFormattedCart } from '@/utils/functions/functions';

// GraphQL
import { GET_CART } from '@/utils/gql/WOOCOMMERCE_QUERIES';
import { ADD_TO_CART } from '@/utils/gql/GQL_MUTATIONS';
import { CardProductProps } from '@/types/blocTypes';

/**
 * Handles the Add to cart functionality.
 * Uses GraphQL for product data
 * @param {IAddToCartProps} product // Product data
 * @param {number} variationId // Variation ID
 * @param {boolean} fullWidth // Whether the button should be full-width
 */

const AddToCart = ({ product }: { product: CardProductProps }) => {
  const { setCart } = useContext(CartContext);
  const [requestError, setRequestError] = useState<boolean>(false);

  const productId = product?.databaseId;
  console.log('productId', productId);

  const productQueryInput = {
    clientMutationId: uuidv4(), // Generate a unique id.
    productId,
  };

  // Get cart data query
  const { data, refetch } = useQuery(GET_CART, {
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      // Update cart in the localStorage.
      const updatedCart = getFormattedCart(data);

      if (!updatedCart) {
        return;
      }

      localStorage.setItem('woocommerce-cart', JSON.stringify(updatedCart));

      // Update cart data in React Context.
      setCart(updatedCart);
    },
  });

  // Add to cart mutation
  const [addToCart, { loading: addToCartLoading }] = useMutation(ADD_TO_CART, {
    variables: {
      input: productQueryInput,
    },

    onCompleted: () => {
      // Update the cart with new values in React context.
      refetch();
    },

    onError: () => {
      setRequestError(true);
    },
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart();
    // Refetch cart after 2 seconds
    setTimeout(() => {
      refetch();
    }, 2000);
  };

  return (
    <>
      <Cta
        handleButtonClick={(e) => handleAddToCart(e)}
        label="Ajouter au panier"
        variant="secondary"
        size="large"
        slug="#"
        additionalClass={`w-full ${addToCartLoading || requestError ? 'opacity-50 pointer-events-none' : ''}`}
      >
        AJOUTER AU PANIER
      </Cta>
    </>
  );
};

export default AddToCart;
