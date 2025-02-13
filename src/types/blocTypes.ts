export interface PromotionSlideProps {
  slug: string;
  imageMobile: {
    node: {
      sourceUrl: string;
    };
  };
  imageLaptop: {
    node: {
      sourceUrl: string;
    };
  };
}

export interface HomeAcfProps {
  isShown: boolean;
  mainSlider: PromotionSlideProps[];
  secondarySlider: PromotionSlideProps[];
}

export interface BlocWysiWygProps {
  __typename: 'AcfPageBlocsBlocWysiwygLayout';
  title: string;
  subtitle: string;
  text: string;
}

export interface SpacerProps {
  __typename: 'AcfPageBlocsBlocSpacerLayout';
  height: number;
  heightMobile: number;
}

export interface BlocReassuranceProps {
  __typename: 'AcfPageBlocsBlocReassuranceLayout';
  type: 'Fond blanc' | 'Fond bleu clair';
  isAvis: boolean;
}
export interface BlocFeaturedCategoriesProps {
  __typename: 'AcfPageBlocsBlocFeaturedCategoriesLayout';
  title: string;
  subtitle: string;
  categories: {
    nodes: {
      name: string;
      slug: string;
      image?: {
        sourceUrl: string;
      };
    }[];
  };
}

export interface CardProductProps {
  name: string;
  id: string;
  databaseId?: string;
  onSale: boolean;
  featured: boolean;
  slug: string;
  featuredImage: {
    node: {
      sourceUrl: string;
    };
  };
  isKit?: boolean;
  price: string;
  salePrice: string;
  isProProduct: boolean;
  hasProDiscount: boolean;
  regularPrice: string;
  sku: string;
  uri: string;
}

export interface BlocFeaturedProductsProps {
  __typename: 'AcfPageBlocsBlocFeaturedProductsLayout';
  title: string;
  subtitle: string;
  image: {
    node: {
      sourceUrl: string;
    };
  };
  products: {
    nodes: CardProductProps[];
  };
}

export interface CardConseilProps {
  bgColor: 'Bleu clair' | 'Orange clair';
  title: string;
  subtitle: string;
  isImageLeft: boolean;
  cta: {
    label: string;
    slug: string;
  };
  image: {
    node: {
      sourceUrl: string;
    };
  };
}

export interface CardFaqProps {
  title: string;
  faqItem: {
    nodes: {
      id: string;
      databaseId: number;
      featuredImage: {
        node: {
          sourceUrl: string;
        };
      };
    }[];
  };
}

export interface FeaturedFaqProps {
  title: string;
  ctaLabel: string;
  ctaSlug: string;
  items: CardFaqProps[];
}
export interface BlocConseilsFaqProps {
  __typename: 'AcfPageBlocsBlocConseilsFaqLayout';
  title: string;
  text: string;
  isSpecificContent: boolean;
  sliderAdvices: CardConseilProps[];
  featuredFaq: FeaturedFaqProps;
}
export interface BlocAccordionProps {
  __typename: 'AcfPageBlocsBlocAccordionLayout';
  title: string;
  subtitle: string;
  accordion: {
    title: string;
    text: string;
    picto: {
      node: {
        sourceUrl: string;
      };
    };
  }[];
}
export interface BlocSeoProps {
  __typename: 'AcfPageBlocsBlocSeoLayout';
  title: string;
  subtitle: string;

  seoItems: {
    category: {
      nodes: {
        name: string;
        slug: string;
        uri: string;
      }[];
    };
    products: {
      nodes: {
        uri: string;
        slug: string;
      }[];
    };
  }[];
}
export interface BlocAvisVerifiesProps {
  __typename: 'AcfPageBlocsBlocAvisVerifiesLayout';
  title: string;
  subtitle: string;
}

export interface ReassuranceItemProps {
  label: string;
  picto: {
    node: {
      sourceUrl: string;
    };
  };
  link: string;
}

export interface PictoAnchorBlocProps {
  picto: {
    node: {
      sourceUrl: string;
    };
  };
  text: string;
  targetSection: {
    title: string;
    subTitle: string;
    image: {
      node: {
        sourceUrl: string;
      };
    };
    advantages: {
      title: string;
      text: string;
    }[];
  };
}
export interface BlocAnchorsPictosProps {
  __typename: 'AcfPageBlocsBlocPictosAnchorLinksLayout';
  items: PictoAnchorBlocProps[];
  cta: {
    label: string;
    slug: string;
  };
  infoBloc: {
    picto: {
      node: {
        sourceUrl: string;
      };
    };
    text: string;
  };
  infoText: string;
}

export interface QuestionCtaCardProps {
  image: {
    node: {
      sourceUrl: string;
    };
  };
  title: string;
  subtitle: string;
  isPhone: boolean;
  label: string;
  slug: string;
  phone: string;
}

export interface BlocQuestionsProps {
  __typename: 'AcfPageBlocsBlocDoubleCtaLayout';
  ctas: QuestionCtaCardProps[];
}
export interface BlocArticleProps {
  __typename: 'AcfPageBlocsBlocArticleLayout';
  anchorId: string;
  image: {
    node: {
      sourceUrl: string;
    };
  };
  title: string;
  text: string;
  isImageLeft: boolean;
  bgColor?: 'Bleu clair' | 'Orange clair';
}
export interface BlocFaqProps {
  __typename: 'AcfPageBlocsBlocFaqLayout';
  isFaq: boolean;
}

export interface BlocVideoProps {
  __typename: 'AcfPageBlocsBlocVideoLayout';
  title: string;
  videoId: string;
  image: {
    node: {
      sourceUrl: string;
    };
  };
}
export interface BlocMosaiqueProps {
  __typename: 'AcfPageBlocsBlocMosaique3ImagesLayout';
  title: string;
  mosaique: {
    title: string;
    image: {
      node: {
        sourceUrl: string;
      };
    };
  }[];
}

export type BlocType =
  | BlocWysiWygProps
  | SpacerProps
  | BlocReassuranceProps
  | BlocFeaturedCategoriesProps
  | BlocFeaturedProductsProps
  | BlocConseilsFaqProps
  | BlocAccordionProps
  | BlocSeoProps
  | BlocAvisVerifiesProps
  | BlocAnchorsPictosProps
  | BlocQuestionsProps
  | BlocArticleProps
  | BlocFaqProps
  | BlocVideoProps
  | BlocMosaiqueProps;
