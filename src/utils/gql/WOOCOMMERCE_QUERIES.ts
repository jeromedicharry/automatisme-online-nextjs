import { gql } from '@apollo/client';
import { seoFields } from './SEO';

export const PRODUCT_CARD_FRAGMENT = `
  databaseId
  name
  onSale
  featured
  featuredImage {
    node {
        sourceUrl(size: MEDIUM)
    }
  }
  price(format: RAW)
  salePrice(format: RAW)
  isProProduct
  hasProDiscount
  regularPrice(format: RAW)
  sku
  isKit
`;

export const GET_SINGLE_PRODUCT = gql`
  query Product($id: ID!) {
    product(id: $id, idType: SLUG) {
      id
      ${seoFields}
      databaseId
      averageRating
      slug
      description
      onSale
      
      name
      ... on SimpleProduct {
        salePrice(format: RAW)
        regularPrice(format: RAW)
        price(format: RAW)
        id
        stockQuantity
        sku
        isKit
        galleryImages {
          nodes {
            sourceUrl
          }
        }
        brands(first: 1) {
          nodes {
            name
          }
        }

        upsell {
          nodes {
            ... on SimpleProduct {
              isKit
              ${PRODUCT_CARD_FRAGMENT}
            } 
          }
        }
        crossSell {
          nodes {
            ... on SimpleProduct {
              isKit
              ${PRODUCT_CARD_FRAGMENT}
            } 
          }
        }
      }
    }
  }
`;

/**
 * Fetch first 200 Woocommerce products from GraphQL
 */
export const FETCH_ALL_PRODUCTS_QUERY = gql`
  query MyQuery {
    products(first: 10) {
      nodes {
        ... on SimpleProduct {
          uri
        }
      }
    }
  }
`;

/**
 * Fetch first 20 categories from GraphQL
 */
export const GET_ALL_CATEGORIES_QUERY = gql`
  query GET_ALL_CATEGORIES_QUERY($first: Int!, $after: String) {
    productCategories(first: $first, after: $after) {
      nodes {
        uri
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_SINGLE_CATEGORY = gql`
  query GET_PRODUCTS_FROM_CATEGORY($id: ID!) {
    singleCategory: productCategory(id: $id, idType: URI) {
      id
      uri
      name
      ${seoFields}
    }
  }
`;

export const GET_PRODUCTS_FROM_CATEGORY = gql`
  query GET_PRODUCTS_FROM_CATEGORY(
    $after: String
    $id: ID!
    $first: Int = 20
    $filters: [ProductTaxonomyFilterInput]
  ) {
    productCategory(id: $id, idType: URI) {
      products(
        first: $first
        after: $after
        where: { taxonomyFilter: { filters: $filters } }
      ) {
        nodes {
          databaseId
          name
          onSale
          featured
          featuredImage {
            node {
              sourceUrl(size: MEDIUM)
            }
          }
          isProProduct
          hasProDiscount
          ... on SimpleProduct {
            salePrice(format: RAW)
            regularPrice(format: RAW)
            onSale
            price(format: RAW)
            id
            taxClass
            sku
            isKit
            uri
            slug
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

export const GET_CART = gql`
  query GET_CART {
    cart {
      contents {
        nodes {
          key
          product {
            node {
              id
              databaseId
              name
              description
              type
              onSale
              slug
              averageRating
              reviewCount
              image {
                id
                sourceUrl
                srcSet
                altText
                title
              }
              galleryImages {
                nodes {
                  id
                  sourceUrl
                  srcSet
                  altText
                  title
                }
              }
              upsell {
                nodes {
                  ... on SimpleProduct {
                    ${PRODUCT_CARD_FRAGMENT}
                  } 
                }
              }
            }
          }
          variation {
            node {
              id
              databaseId
              name
              description
              type
              onSale
              price
              regularPrice
              salePrice
              image {
                id
                sourceUrl
                srcSet
                altText
                title
              }
              attributes {
                nodes {
                  id
                  name
                  value
                }
              }
            }
          }
          quantity
          total
          subtotal
          subtotalTax
        }
      }

      subtotal
      subtotalTax
      shippingTax
      shippingTotal
      total
      totalTax
      feeTax
      feeTotal
      discountTax
      discountTotal
    }
  }
`;

export const GET_CUSTOMER = gql`
  query GetCustomer {
    customer {
      id
      firstName
      lastName
      email
      shipping {
        address1
        city
        postcode
      }
      billing {
        address1
        city
        postcode
      }
    }
  }
`;

export const GET_RELATED_PRODUCT_SIDE_DATA = gql`
  query GET_PRODUCT_SIDE_DATA ($id: ID!, $idType: ProductIdTypeEnum = DATABASE_ID) {
    product(id: $id, idType: $idType) {
      ... on SimpleProduct {
        upsell {
          nodes {
            ... on SimpleProduct {
              isKit
              ${PRODUCT_CARD_FRAGMENT}
            } 
          }
        }
      }
    }
  }
`;

export const GET_CROSSSELL_PRODUCT_SIDE_DATA = gql`
  query GET_PRODUCT_SIDE_DATA ($id: ID!, $idType: ProductIdTypeEnum = DATABASE_ID) {
    product(id: $id, idType: $idType) {
      ... on SimpleProduct {
        crossSell {
          nodes {
            ... on SimpleProduct {
              isKit
              ${PRODUCT_CARD_FRAGMENT}
            } 
          }
        }
      }
    }
  }
`;

export const GET_TAX_RATES = gql`
  query GET_TAX_RATES {
    taxRates {
      nodes {
        rate
        country
      }
    }
  }
`;
