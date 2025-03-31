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

export const GET_CUSTOMER_PRO_INFO = gql`
  query GET_CUSTOMER_PRO_INFO($id: ID!) {
    customer(id: $id) {
      id
      siret
      billing {
        company
      }
    }
  }
`;

export const UPDATE_CUSTOMER_PRO_INFO = gql`
  mutation UPDATE_CUSTOMER_PRO_INFO(
    $id: ID!
    $company: String!
    $siret: String!
  ) {
    updateCustomer(
      input: {
        id: $id
        billing: { company: $company }
        metaData: [{ key: "siret", value: $siret }]
      }
    ) {
      customer {
        id
        siret
        billing {
          company
        }
      }
    }
  }
`;

export const UPDATE_CUSTOMER_SIRET = gql`
  mutation UPDATE_CUSTOMER_SIRET($id: ID!, $siret: String!) {
    updateCustomer(
      input: { id: $id, metaData: [{ key: "siret", value: $siret }] }
    ) {
      customer {
        id
        siret
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
                  slug
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

export const UPGRADE_TO_PRO_CUSTOMER = gql`
  mutation UPGRADE_TO_PRO_CUSTOMER($id: ID!) {
    upgradeToProCustomer(input: { id: $id }) {
      success
      customer {
        id
      }
    }
  }
`;
