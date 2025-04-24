import { IMeta } from '@/components/Layout/Meta';
import {
  BlocType,
  CardConseilProps,
  FeaturedFaqProps,
  PromotionSlideProps,
} from './blocTypes';

export interface PageInfoProps {
  hasNextPage: boolean;
  endCursor?: string | null | undefined;
}

export interface ThemeSettingsProps {
  contactPhone: string;
  quantityInstallers: number;
  hours: string;
  paymentPictos: {
    picto: {
      node: {
        sourceUrl: string;
      };
    };
  }[];
  reassurance: {
    label: string;
    picto: {
      node: {
        sourceUrl: string;
      };
    };
    link: string;
  }[];
  sliderAdvices: CardConseilProps[];
  featuredFaq: FeaturedFaqProps;
  contactTitle: string;
  contactText: string;
  // installationCard: INst
}

export interface PageProps {
  seo: IMeta;
  id: string;
  uri: string;
  title: string;
  status: string;
  featuredImage: {
    node: {
      sourceUrl: string;
    };
  };
  acfPage: {
    hero: {
      title: string;
      text: string;
    };
    blocs: BlocType[];
  };
}

export interface HomePageProps extends PageProps {
  acfHome: {
    isShown: boolean;
    mainSlider: PromotionSlideProps[];
    secondarySlider: PromotionSlideProps[];
  };
}
