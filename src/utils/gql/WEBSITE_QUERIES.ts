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
          link
        }
        ${sliderAdvicesFields}
        ${FEATURED_FAQ}
      }
    }
  }
`;

// Elements de menu
export const GET_FOOTER_MENU_1 = gql`
  query GET_FOOTER_MENU_1 {
    menu(id: "menu-footer-1", idType: SLUG) {
      menuItems(first: 100) {
        nodes {
          label
          uri
        }
      }
      submenu {
        label
      }
    }
  }
`;
export const GET_FOOTER_MENU_2 = gql`
  query GET_FOOTER_MENU_2 {
    menu(id: "menu-footer-2", idType: SLUG) {
      menuItems(first: 100) {
        nodes {
          label
          uri
        }
      }
      submenu {
        label
      }
    }
  }
`;
export const GET_FOOTER_MENU_3 = gql`
  query GET_FOOTER_MENU_3 {
    menu(id: "menu-footer-3", idType: SLUG) {
      menuItems(where: { parentId: null }) {
        nodes {
          label
          uri
          parentId
          childItems {
            nodes {
              label
              uri
            }
          }
        }
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

// spécifique à la page d'accueil

export const PromotionSlide = `
  slug
  imageMobile {
    node {
      sourceUrl(size: MEDIUM_LARGE)
    }
  }
  imageLaptop {
    node {
      sourceUrl(size: LARGE)
    }
  }
`;

export const GET_HOME_PAGE = gql`
  query GET_HOME_PAGE {
    page(id: "/", idType: URI) {
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
      acfHome {
        isShown
        mainSlider {
          ${PromotionSlide}
        }
        secondarySlider {
          ${PromotionSlide}
        }
      }
    }
  }
`;
