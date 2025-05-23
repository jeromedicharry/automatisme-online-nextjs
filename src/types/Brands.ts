import { IMeta } from '@/components/Layout/Meta';
import { PostsList } from './Posts';

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
      showNote: boolean;
    };
  };
  posts: PostsList;
}
