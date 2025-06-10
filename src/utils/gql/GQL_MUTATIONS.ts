import { gql } from '@apollo/client';
import { CART_SHIPPING_FRAGMENT } from './fragments';
import { ADDRESS_FIELDS } from './CUSTOMER_QUERIES';

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
      order {
        id
        databaseId
        total(format: RAW)
        currency
        adyenReference
        billing {
          ${ADDRESS_FIELDS}
          email
        }
        shipping {
          ${ADDRESS_FIELDS}
        }
      }
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

export const GET_ORDER_GLOBAL_ID = gql`
  query GetOrderGlobalId($databaseId: ID!) {
    order(id: $databaseId, idType: DATABASE_ID) {
      id
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

export const UPDATE_SHIPPING_METHOD = gql`
  mutation UpdateShippingMethod($input: UpdateShippingMethodInput!) {
    updateShippingMethod(input: $input) {
      cart {
        ...CartShippingFields
        total
        subtotal
        contents {
          nodes {
            key
            quantity
            total
            subtotal
            subtotalTax
            installationPrice
            addInstallation
          }
        }
      }
    }
  }
  ${CART_SHIPPING_FRAGMENT}
`;
