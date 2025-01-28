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
      image {
        id
        uri
        title
        srcSet
        sourceUrl
      }
      name
      ... on SimpleProduct {
        salePrice
        regularPrice
        price
        id
        stockQuantity
      }

      ... on ExternalProduct {
        price
        id
        externalUrl
      }
      ... on GroupProduct {
        products {
          nodes {
            ... on SimpleProduct {
              id
              price
            }
          }
        }
        id
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
        uri
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
