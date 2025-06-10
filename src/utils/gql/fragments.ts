import { gql } from '@apollo/client';

export const CART_SHIPPING_FRAGMENT = gql`
  fragment CartShippingFields on Cart {
    chosenShippingMethods
    shippingTotal
    availableShippingMethods {
      rates {
        cost
        methodId
        label
        instanceId
      }
    }
  }
`;
