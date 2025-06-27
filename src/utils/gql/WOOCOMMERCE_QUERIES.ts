import { gql } from '@apollo/client';
import { seoFields } from './SEO';
import { CART_SHIPPING_FRAGMENT } from './fragments';

export interface IImage {
  __typename: string;
  id: string;
  sourceUrl?: string;
  srcSet?: string;
  altText: string;
  title: string;
}

export interface IGalleryImages {
  __typename: string;
  nodes: IImage[];
}

export interface IProduct {
  __typename: string;
  node: IProductNode;
}

export const PRODUCT_CARD_FRAGMENT = `
  databaseId
  slug
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
  stockQuantity
  backorders
  restockingLeadTime
  productRef
  acfFeatured {
    isFeatured
  }
`;

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
      acfFeatured {
        isFeatured
      }
      name
      ... on SimpleProduct {
        salePrice(format: RAW)
        regularPrice(format: RAW)
        price(format: RAW)
        id
        stockQuantity
        backorders
        restockingLeadTime
        sku
        installationPrice
        productRef
        isPro
        hasPose
        poseCategory
        isKit
        stockQuantity
        galleryImages {
          nodes {
            sourceUrl
          }
        }

        ecoTaxValue

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
  query GET_SINGLE_CATEGORY($id: ID!) {
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

export interface IProductNode {
  __typename: string;
  id: string;
  databaseId: number;
  name: string;
  type: string;
  slug: string;
  image: IImage;
  galleryImages: IGalleryImages;
  productId: number;
  price: string;
  upsell: { nodes: IProduct[] };
  hasPose?: boolean;
  stockQuantity?: number;
  backorders?: 'YES' | 'NO';
  restockingLeadTime?: number;
}

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
      hasPose
      stockQuantity
      backorders
      restockingLeadTime
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
          installationPrice
          installationTvaRate
          installationTvaAmount
          addInstallation
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
      discountTotalRaw: discountTotal(format: RAW)
      discountTaxRaw: discountTax(format: RAW)
      appliedCoupons {
        code
        discountAmount(format: RAW)
        discountTax(format: RAW)
      }
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
        hasPose
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

export const POST_CARD_FRAGMENT = `
  featuredImage {
    node {
      sourceUrl(size: MEDIUM)
    }
  }
  title
  date
  excerpt
  slug
`;

//todo remetre
// relatedBrands {
//   nodes {
//     name
//     slug
//   }
// }

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
          savNote
        }

        featuredProducts {
          nodes {
            ... on SimpleProduct {
            ${PRODUCT_CARD_FRAGMENT}
            }
          }
        }

        

        
      }
      posts(first: 2) {
        nodes {
          ${POST_CARD_FRAGMENT}
        }
      }
    }
  }
`;

// export const GET_ALL_PRODUCTS_REDIRECTS = gql`
//   query GET_ALL_PRODUCTS_REDIRECTS {
//     products(first: 100) {
//       nodes {
//         uri

//       }
//     }
//   }
// `;

export const GET_CART_SHIPPING_METHODS = gql`
  query GetCartShippingMethods {
    cart {
      ...CartShippingFields
    }
  }
  ${CART_SHIPPING_FRAGMENT}
`;

export const GET_CART_SHIPPING_INFO = gql`
  query GetCartShippingInfo {
    cart {
      ...CartShippingFields
    }
  }
  ${CART_SHIPPING_FRAGMENT}
`;
