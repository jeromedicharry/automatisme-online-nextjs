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
    $hasReducedTvaRate: Boolean
  ) {
    updateCartItemInstallation(
      input: {
        cartItemKey: $cartItemKey
        addInstallation: $addInstallation
        hasReducedTvaRate: $hasReducedTvaRate
      }
    ) {
      success
      message
      cart {
        contents {
          nodes {
            key
            quantity
            total
            subtotal
            subtotalTax
            addInstallation
            installationPrice
            installationTvaRate
            installationTvaAmount
          }
        }
        total
        totalTax
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

// Mutation pour appliquer un coupon
export const APPLY_COUPON = gql`
  mutation ApplyCoupon($code: String!) {
    applyCoupon(input: { code: $code }) {
      cart {
        total
        subtotal
        totalTax
        discountTax
        discountTotal
        shippingTotal
        shippingTax
        feeTotal
        feeTax
        appliedCoupons {
          code
        }
        contents {
          nodes {
            key
            product {
              node {
                id
                name
                slug
              }
            }
            quantity
            total
            subtotal
            subtotalTax
            installationPrice
            installationTvaRate
            installationTvaAmount
            addInstallation
          }
        }
      }
    }
  }
`;

// Mutation pour supprimer un coupon
export const REMOVE_COUPON = gql`
  mutation RemoveCoupon($code: String!) {
    removeCoupons(input: { codes: [$code] }) {
      cart {
        total
        subtotal
        totalTax
        discountTax
        discountTotal
        shippingTotal
        shippingTax
        feeTotal
        feeTax
        appliedCoupons {
          code
        }
        contents {
          nodes {
            key
            product {
              node {
                id
                name
                slug
              }
            }
            quantity
            total
            subtotal
            subtotalTax
            installationPrice
            installationTvaRate
            installationTvaAmount
            addInstallation
          }
        }
      }
    }
  }
`;

export const GET_ALEX_SHIPPING_METHOD = gql`
  query getShippingMethods {
    cart {
      contents {
        nodes {
          key
          product {
            node {
              id
              name
            }
          }
          quantity
        }
      }

      dynamicShippingMethods {
        id
        label
        cost
        delayMin
        delayMax
        description
      }

      chosenShippingMethods
      shippingTotal
      shippingTax
      total
      relayPoint
    }
  }
`;

export const SET_CART_SHIPPING_METHOD = gql`
  mutation setShippingMethod($shippingMethodId: String!) {
    setShippingMethod(input: { shippingMethodId: $shippingMethodId }) {
      cart {
        chosenShippingMethods
        dynamicShippingMethods {
          id
          label
          cost
          delayMin
          delayMax
          description
        }
        shippingTotal
        shippingTax
        total
        subtotal
        totalTax
        shippingTotal
        shippingTax
        contents {
          nodes {
            key
            quantity
            total
            subtotal
            subtotalTax
            installationPrice
            installationTvaRate
            installationTvaAmount
            addInstallation
          }
        }
      }
    }
  }
`;

export const SET_RELAY_POINT = gql`
  mutation setRelayPoint(
    $relayId: String!
    $relayName: String!
    $relayAddress: String!
    $relayZip: String!
    $relayCity: String!
    $relayCountry: String!
    $relayInfo: String!
  ) {
    setRelayPoint(
      input: {
        relayId: $relayId
        relayName: $relayName
        relayAddress: $relayAddress
        relayZip: $relayZip
        relayCity: $relayCity
        relayCountry: $relayCountry
        relayInfo: $relayInfo
      }
    ) {
      success
    }
  }
`;
