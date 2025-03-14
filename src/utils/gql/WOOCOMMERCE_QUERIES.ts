import { gql } from '@apollo/client';
import { seoFields } from './SEO';

// isPro
// hasPose
// isKit

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

  regularPrice(format: RAW)
  sku
`;

// todo gérer les brands
// brands(first: 1) {
//   nodes {
//     name
//   }
// }

// isKit

export const GET_SINGLE_PRODUCT = gql`
  query Product($id: ID!) {
    product(id: $id, idType: SLUG) {
      id
      uri
      ${seoFields}
      databaseId
      averageRating
      slug
      description
      onSale
      acfProduct {
        faq {
          title
          content
        }
      }
      name
      ... on SimpleProduct {
        salePrice(format: RAW)
        regularPrice(format: RAW)
        price(format: RAW)
        id
        stockQuantity
        sku
        galleryImages {
          nodes {
            sourceUrl
          }
        }

        upsell {
          nodes {
            ... on SimpleProduct {
              ${PRODUCT_CARD_FRAGMENT}
            } 
          }
        }
        crossSell {
          nodes {
            ... on SimpleProduct {
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
export const FETCH_ALL_PRODUCTS_WITH_PAGINATION = gql`
  query FETCH_ALL_PRODUCTS_WITH_PAGINATION($first: Int!, $after: String) {
    products(first: $first, after: $after) {
      nodes {
        ... on SimpleProduct {
          uri
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

/**
 * Fetch all categories from GraphQL
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

// isKit
// isPro
// hasPose

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

          ... on SimpleProduct {
            salePrice(format: RAW)
            regularPrice(format: RAW)
            onSale
            price(format: RAW)
            id
            taxClass
            sku
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

// isKit

export const GET_RELATED_PRODUCT_SIDE_DATA = gql`
  query GET_PRODUCT_SIDE_DATA ($id: ID!, $idType: ProductIdTypeEnum = DATABASE_ID) {
    product(id: $id, idType: $idType) {
      ... on SimpleProduct {
        upsell {
          nodes {
            ... on SimpleProduct {
              ${PRODUCT_CARD_FRAGMENT}
            } 
          }
        }
      }
    }
  }
`;
// isKit

export const GET_CROSSSELL_PRODUCT_SIDE_DATA = gql`
  query GET_PRODUCT_SIDE_DATA ($id: ID!, $idType: ProductIdTypeEnum = DATABASE_ID) {
    product(id: $id, idType: $idType) {
      ... on SimpleProduct {
        crossSell {
          nodes {
            ... on SimpleProduct {
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
    taxRates(first: 100) {
      nodes {
        rate
        country
      }
    }
  }
`;
