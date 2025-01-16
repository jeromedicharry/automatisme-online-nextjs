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
    nodes: {
      slug: string;
      uri: string;
    }[];
  };
}
export interface BlocConseilsFaqProps {
  __typename: 'AcfPageBlocsBlocConseilsFaqLayout';
  title: string;
  text: string;
}
export interface BlocAccordionFaqProps {
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
}

export type BlocType =
  | BlocWysiWygProps
  | SpacerProps
  | BlocReassuranceProps
  | BlocFeaturedCategoriesProps
  | BlocFeaturedProductsProps
  | BlocConseilsFaqProps
  | BlocAccordionFaqProps
  | BlocSeoProps
  | BlocAvisVerifiesProps;
