import { PRODUCT_CARD_FRAGMENT } from './WOOCOMMERCE_QUERIES';

export const sliderAdvicesFields = `

sliderAdvices {
    bgColor
    title
    subtitle
    cta {
        label
        slug
    }
    isImageLeft
    image {
        node {
            sourceUrl
        }
    }
}`;

export const blocsFields = `
  blocs {

    ... on AcfPageBlocsBlocWysiwygLayout {
        __typename
        title
        subtitle
        text
    }
    ... on AcfPageBlocsBlocSpacerLayout {
        __typename
        height
        heightMobile
    }

    ... on AcfPageBlocsBlocReassuranceLayout {
        __typename
        type
        isAvis
    }
    ... on AcfPageBlocsBlocFeaturedCategoriesLayout {
        __typename
        title
        subtitle
        categories {
            nodes {
                name
                slug
                ... on ProductCategory {
                    image {
                        sourceUrl
                    }
                }
            }
        }
    }
    ... on AcfPageBlocsBlocFeaturedProductsLayout {
        __typename
        title
        subtitle
        image {
            node {
                sourceUrl
            }
        }
        products {
            nodes {
                slug
             
                ... on SimpleProduct {
                    ${PRODUCT_CARD_FRAGMENT}
                    sku
                    isKit
                }
            }
        }
    }
    ... on AcfPageBlocsBlocConseilsFaqLayout {
        __typename
         title
        text
        isSpecificContent
        ${sliderAdvicesFields}
        
    }
    ... on AcfPageBlocsBlocAccordionLayout {
        __typename
        isShown
    }
    ... on AcfPageBlocsBlocSeoLayout {
        __typename
        title
        subtitle
    }
    ... on AcfPageBlocsBlocAvisVerifiesLayout {
        __typename
        title
        subtitle
    }
    ... on AcfPageBlocsBlocPictosAnchorLinksLayout {
        __typename
        items {
            picto {
              node {
                sourceUrl
              }
            }
            text
            targetSection {
              title
              subTitle
              image {
                node {
                  sourceUrl
                }
              }
              advantages {
                title
                text
              }
            }
        }
        cta {
            label
            slug
        }
        infoBloc {
            picto {
                node {
                sourceUrl
                }
            }
            text
        }
        infoText
    }

    ... on AcfPageBlocsBlocDoubleCtaLayout {
        __typename
        ctas {
            image {
                node {
                sourceUrl(size: MEDIUM_LARGE)
                }
            }
            title
            subtitle
            isPhone
            label
            slug
            phone
        }
    }

    ... on AcfPageBlocsBlocArticleLayout {
        __typename
        anchorId
        image {
            node {
                sourceUrl
            }
        }
        title
        text
        isImageLeft
        bgColor
    }
    ... on AcfPageBlocsBlocFaqLayout {
        __typename
        isFaq
    }

    ... on AcfPageBlocsBlocVideoLayout {
        __typename
        title
        videoId
        image {
            node {
            sourceUrl
            }
        }
    }
    ... on AcfPageBlocsBlocMosaique3ImagesLayout {
        __typename
        title
        mosaique {
            title
            image {
                node {
                    sourceUrl
                }
            }
        }
    }
  }
  `;
