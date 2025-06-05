import { IMeta } from '@/components/Layout/Meta';
import { PostsList } from './Posts';
import { CardProductProps } from './blocTypes';

export interface BrandContentProps {
  slug: string;
  uri: string;
  name: string;
  seo: IMeta;
  description: string;
  thumbnailUrl: string;
  acfBrand: {
    hero: {
      globalNote: number;
      image: {
        node: {
          sourceUrl: string;
        };
      };
      notes: {
        label: string;
        note: number;
      }[];
    };
    bolcSav: {
      title: string;
      text: string;
      isImageLeft: boolean;
      image: {
        node: {
          sourceUrl: string;
        };
      };
      savNote: number;
    };
    featuredProducts: {
      nodes: CardProductProps[];
    };
  };
  posts: PostsList;
}
