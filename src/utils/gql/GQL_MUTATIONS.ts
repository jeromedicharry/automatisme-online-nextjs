import { gql } from '@apollo/client';

export const ADD_TO_CART = gql`
  mutation ($input: AddToCartInput!) {
    addToCart(input: $input) {
      cartItem {
        key
        quantity
      }
    }
  }
`;

export const CHECKOUT_MUTATION = gql`
  mutation CHECKOUT_MUTATION($input: CheckoutInput!) {
    checkout(input: $input) {
      result
      redirect
    }
  }
`;
export const UPDATE_CART = gql`
  mutation ($input: UpdateItemQuantitiesInput!) {
    updateItemQuantities(input: $input) {
      items {
        key
        quantity
      }
      removed {
        key
        product {
          node {
            id
            databaseId
          }
        }
      }
      updated {
        key
        product {
          node {
            id
            databaseId
          }
        }
      }
    }
  }
`;

export const UPDATE_CART_ITEM_INSTALLATION = gql`
  mutation UpdateCartItemInstallation(
    $cartItemKey: String!
    $addInstallation: Boolean!
  ) {
    updateCartItemInstallation(
      input: { cartItemKey: $cartItemKey, addInstallation: $addInstallation }
    ) {
      success
      message
      cart {
        contents {
          nodes {
            key
            addInstallation
            installationPrice
            product {
              node {
                name
              }
            }
          }
        }
        total
      }
    }
  }
`;
