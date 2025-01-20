import { gql } from '@apollo/client';
import { blocsFields, sliderAdvicesFields } from './BLOCS_FRAGMENTS';
import { seoFields } from './SEO';

// Elements globaux

export const FEATURED_FAQ = `
  featuredFaq {
    title
    ctaLabel
    ctaSlug
    items {
      title
      faqItem {
        nodes {
          slug
          ... on FaqItem {
            id
            featuredImage {
              node {
                sourceUrl
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_OPTIONS = gql`
  query GET_OPTIONS {
    themeSettings {
      optionsFields {
        contactPhone
        hours
        logoFooter {
          node {
            sourceUrl
          }
        }
        logoHeader {
          node {
            sourceUrl
          }
        }
        paymentPictos {
          picto {
            node {
              sourceUrl
            }
          }
        }
        reassurance {
          label
          picto {
            node {
              sourceUrl
            }
          }
        }
        ${sliderAdvicesFields}
        ${FEATURED_FAQ}
      }
    }
  }
`;

// pages

export const GET_SINGLE_PAGE = gql` 
  query GET_SINGLE_PAGE($id: ID!) {
    page(id: $id, idType: URI ) {
        ${seoFields}
        id
        uri
        title(format: RENDERED)
        status
        featuredImage {
          node {
            sourceUrl
          }
        }
        acfPage {
          hero {
            title
            text
          }
          ${blocsFields}
        }
      }
    }
`;

export const GET_ALL_PAGE_SLUGS = gql`
  query GET_ALL_PAGE_SLUGS {
    pages(first: 100, where: { status: PUBLISH }) {
      nodes {
        slug
        isFrontPage
      }
    }
  }
`;
