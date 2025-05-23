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
  regularPrice(format: RAW)
  sku
  isPro
  hasPose
  isKit
`;

// todo gérer les brands
// brands(first: 1) {
//   nodes {
//     name
//   }
// }

// isKit

// restockingLeadTime

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
        isPro
        hasPose
        isKit
        backorders
        stockQuantity
        galleryImages {
          nodes {
            sourceUrl
          }
        }

        productBrands {
          nodes {
            name
            thumbnailUrl
          }
        }

        acfProductDocs {
          productNotice {
            node {
              mediaItemUrl
            }
          }
          noticeTech {
            node {
              mediaItemUrl
            }
          }
        }
        acfProduct {
          faq {
            title
            content
          }
        }

        upsell {
          nodes {
            ... on SimpleProduct {
              ${PRODUCT_CARD_FRAGMENT}
              isPro
              hasPose
              isKit
            } 
          }
        }
        crossSell {
          nodes {
            ... on SimpleProduct {
              ${PRODUCT_CARD_FRAGMENT}
              isPro
              hasPose
              isKit
            } 
          }
        }
      }
    }
  }
`;

/**
 * Fetch first all Woocommerce products from GraphQL
 */
export const FETCH_ALL_PRODUCTS_WITH_PAGINATION = gql`
  query FETCH_ALL_PRODUCTS_WITH_PAGINATION($first: Int!, $after: String) {
    products(
      first: $first
      after: $after
      where: { productVisibilityIn: "visible" }
    ) {
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
      slug
      name
      description
      ${seoFields}
      children(first: 50, where: {parent: null}) {
        nodes {
          name
          uri
        }
      }
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
            isPro
            hasPose
            isKit
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

export const PRODUCT_CART_ITEM = `product {
  node {
    id
    databaseId
    name
    slug
    image {
      sourceUrl
    }
    ... on SimpleProduct {
      price(format: RAW)
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
          ${PRODUCT_CART_ITEM}
          quantity
          total(format: RAW)
          subtotal(format: RAW)
          subtotalTax(format: RAW)
        }
      }

      subtotal(format: RAW)
      subtotalTax(format: RAW)
      shippingTax(format: RAW)
      shippingTotal(format: RAW)
      total(format: RAW)
      totalTax(format: RAW)
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
              ${PRODUCT_CARD_FRAGMENT}
              isKit
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
              isKit
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

/**
 * Fetch first all Woocommerce products from GraphQL
 */
export const FETCH_ALL_BRANDS_WITH_PAGINATION = gql`
  query FETCH_ALL_BRANDS_WITH_PAGINATION($first: Int!, $after: String) {
    productBrands(first: $first, after: $after) {
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

export const FETCH_SINGLE_BRAND = gql`
  query FETCH_SINGLE_BRAND($id: ID!, $idType: ProductBrandIdType = SLUG) {
    productBrand(id: $id, idType: $idType) {
      slug
      uri
      name
      ${seoFields}
      description
      thumbnailUrl
      acfBrand {
        hero {
          globalNote
          image {
            node {
              sourceUrl
            }
          }
          notes {
            label
            note
          }
        }
        bolcSav {
          title
          text
          isImageLeft
          image {
            node {
              sourceUrl
            }
          }
          showNote
        }
      }
      posts(first: 2) {
        nodes {
          featuredImage {
            node {
              sourceUrl(size: MEDIUM)
            }
          }
          title
          date
          excerpt
          slug
        }
      }
    }
  }
`;
