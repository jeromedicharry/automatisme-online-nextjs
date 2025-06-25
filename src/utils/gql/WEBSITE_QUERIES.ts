import { gql } from '@apollo/client';
import { blocsFields, sliderAdvicesFields } from './BLOCS_FRAGMENTS';
import { seoFields } from './SEO';
import { POST_CARD_FRAGMENT } from './WOOCOMMERCE_QUERIES';

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
            databaseId
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
        quantityInstallers
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
        reassuranceAccordion {
          title
          text
          accordion {
            label
            picto {
              node {
                sourceUrl
              }
            }
            text
          }
        }
        sliderAdviceTitle
        sliderAdviceText
        ${sliderAdvicesFields}
        ${FEATURED_FAQ}
        contactTitle
        contactText
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

const PAGE_STANDARD_FIELDS = `
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
`;

// pages
export const GET_SINGLE_PAGE = gql` 
  query GET_SINGLE_PAGE($id: ID!) {
    page(id: $id, idType: URI ) {
        ${PAGE_STANDARD_FIELDS}
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
      ${PAGE_STANDARD_FIELDS}
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

export const GET_ALL_FAQ_ITEMS = gql`
  query GET_ALL_FAQ_ITEMS {
    faqItems(
      where: { status: PUBLISH, orderby: { field: MENU_ORDER, order: ASC } }
    ) {
      nodes {
        title(format: RENDERED)
        databaseId
        content(format: RENDERED)
      }
    }
  }
`;

export const GET_ALL_LEVEL_1_CATEGORIES = gql`
  query GET_ALL_LEVEL_1_CATEGORIES {
    productCategories(
      where: { parent: null, exclude: "dGVybToxNQ==" }
      first: 100
    ) {
      nodes {
        name
        uri
        acfCategory {
          menuType
          brands(first: 100) {
            nodes {
              name
              slug
            }
          }
        }
        image {
          sourceUrl
        }

        children(first: 100) {
          nodes {
            name
            uri
            image {
              sourceUrl
            }
            children(first: 100) {
              nodes {
                uri
                name
                children(first: 100) {
                  nodes {
                    uri
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_INSTALLATION_CTA = gql`
  query GET_INSTALLATION_CTA {
    themeSettings {
      optionsFields {
        installationCtaCard {
          title
          image {
            node {
              sourceUrl
            }
          }
          ctaLabel
          ctaSlug
        }
      }
    }
  }
`;

export const GET_INSTALLERS = gql`
  query GET_INSTALLERS($cursor: String) {
    installateurs(first: 100, after: $cursor) {
      nodes {
        databaseId
        title
        acfContent {
          address
          geolocation {
            latitude
            longitude
          }
          email
          phone
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_SINGLE_POST = gql`
  query GET_SINGLE_POST($id: ID!) {
    post(id: $id, idType: SLUG) {
      
      title
      slug
      ${seoFields}
      date
      content
      featuredImage {
        node {
          sourceUrl
        }
      }
      productBrands {
        nodes {
          name
          posts(first: 3) {
            nodes {
              ${POST_CARD_FRAGMENT}
            }
          }
        }
      }
    }
  }
`;

export const FETCH_ALL_POSTS_WITH_PAGINATION = gql`
  query FETCH_ALL_POSTS_WITH_PAGINATION($first: Int!, $after: String) {
    posts(first: $first, after: $after) {
      nodes {
        slug
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// Bibliothèque
export const GET_LIBRARY_DOCUMENTS = gql`
  query GetLibraryDocuments($search: String, $first: Int!, $after: String) {
    products(
      first: $first
      after: $after
      where: { orderby: { field: DATE, order: DESC }, search: $search }
    ) {
      nodes {
        name
        slug
        ... on SimpleProduct {
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
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

export const GET_LIBRARY_VIDEOS = gql`
  query GetLibraryVideos {
    themeSettings {
      optionsFields {
        videoContent {
          title
          videoId
          image {
            node {
              sourceUrl
            }
          }
        }
      }
    }
  }
`;

export const GET_LIBRARY_ARTICLES = gql`
  query GetLibraryArticles($search: String, $first: Int!, $after: String) {
    posts(
      first: $first
      after: $after
      where: { orderby: { field: DATE, order: DESC }, search: $search }
    ) {
      nodes {
        title
        slug
        excerpt
        productBrands {
          nodes {
            name
          }
        }
        date
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_LIBRARY_BRANDS = gql`
  query GetLibraryBrands($search: String, $first: Int!, $after: String) {
    productBrands(
      first: $first
      after: $after
      where: { search: $search }
    ) {
      nodes {
        name
        slug
        thumbnailUrl
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
