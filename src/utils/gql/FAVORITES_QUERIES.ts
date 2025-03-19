// Requête pour récupérer les Ids

import { gql } from '@apollo/client';
import { PRODUCT_CARD_FRAGMENT } from './WOOCOMMERCE_QUERIES';

const GET_FAVORITE_IDS = gql`
  query GetFavorites {
    favorites {
      databaseId
    }
  }
`;
// Requête pour récupérer les produits favoris sur la page mon compte
const GET_FAVORITES = gql`
  query GetFavorites {
    favorites {
      slug
      ... on SimpleProduct {
        ${PRODUCT_CARD_FRAGMENT}
      }
    }
  }
`;

// Mutation pour ajouter aux favoris
const ADD_TO_FAVORITES = gql`
  mutation AddToFavorites($productId: Int!) {
    addToFavorites(input: { productId: $productId }) {
      success
      message
      product {
        id
        databaseId
      }
    }
  }
`;

// Mutation pour supprimer des favoris
const REMOVE_FROM_FAVORITES = gql`
  mutation RemoveFromFavorites($productId: Int!) {
    removeFromFavorites(input: { productId: $productId }) {
      success
      message
      productId
    }
  }
`;

export {
  GET_FAVORITE_IDS,
  GET_FAVORITES,
  ADD_TO_FAVORITES,
  REMOVE_FROM_FAVORITES,
};
