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
                    regularPrice
                    sku
                }
                ... on VariableProduct {
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
                    regularPrice
                    sku
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
        title
        subtitle
        accordion {
            title
            text
            picto {
                node {
                    sourceUrl
                }
            }
        }
    }
    ... on AcfPageBlocsBlocSeoLayout {
        __typename
        title
        subtitle
        seoItems {
            category(first: 1) {
                nodes {
                    name
                    slug
                    uri
                }
            }
            products {
                nodes {
                    uri
                    slug
                    ... on SimpleProduct {
                        id
                        name
                        slug
                        image {
                            sourceUrl
                        }
                    }
                }
            }
        }
    }
    ... on AcfPageBlocsBlocAvisVerifiesLayout {
        __typename
        title
        subtitle
    }
  }
  `;
