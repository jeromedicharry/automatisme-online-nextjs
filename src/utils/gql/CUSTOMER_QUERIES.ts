import { gql } from '@apollo/client';

const ADDRESS_FIELDS = `
  address1
  address2
  city
  company
  country
  firstName
  lastName
  phone
  postcode
`;

export const GET_CUSTOMER_ADDRESSES = gql` 
  query GET_CUSTOMER_ADDRESSES($id: ID!) {
    customer(id: $id ) {
        shipping {
          ${ADDRESS_FIELDS}
        }
        billing {
          ${ADDRESS_FIELDS}
          email
        }
      }
    }
`;

export const UPDATE_ADDRESS = gql`
  mutation UPDATE_ADDRESS($id: ID!, $billing: CustomerAddressInput, $shipping: CustomerAddressInput) {
    updateCustomer(input: { id: $id, billing: $billing, shipping: $shipping }) {
      customer {
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
export const UPDATE_USER_EMAIL = gql`
  mutation UPDATE_USER_EMAIL($id: ID!, $email: String!) {
    updateUser(input: { id: $id, email: $email }) {
      user {
        id
        email
      }
    }
  }
`;

export const GET_CUSTOMER_COMPANY = gql`
  query GET_CUSTOMER_COMPANY($id: ID!) {
    customer(id: $id) {
      billing {
        company
      }
    }
  }
`;

export const UPDATE_CUSTOMER_PRO_INFO = gql`
  mutation UPDATE_ADDRESS($id: ID!, $billing: CustomerAddressInput, $shipping: CustomerAddressInput) {
    updateCustomer(input: { id: $id, billing: $billing, shipping: $shipping }) {
      customer {
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

export const GET_CUSTOMER_ORDERS = gql`
  query GET_CUSTOMER_ORDERS($id: ID!, $first: Int, $after: String) {
    customer(id: $id) {
      orders(first: $first, after: $after) {
        nodes {
          orderNumber
          date
          status
          subtotal(format: RAW)
          totalTax(format: RAW)
          total(format: RAW)
          lineItems {
            nodes {
              product {
                node {
                  name
                  sku
                  featuredImage {
                    node {
                      sourceUrl(size: THUMBNAIL)
                    }
                  }
                }
              }
            }
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
`;
