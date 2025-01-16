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
                uri
                ... on SimpleProduct {
                    id
                    name
                }
            }
        }
    }
    ... on AcfPageBlocsBlocConseilsFaqLayout {
        __typename
        title
        text
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
