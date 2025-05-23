import { IMeta } from '@/components/Layout/Meta';
import { BrandLink } from './Categories';

export interface PostCard {
  featuredImage: {
    node: {
      sourceUrl: string;
    };
  };
  title: string;
  date: string;
  excerpt: string;
  slug: string;
  productBrands?: {
    nodes: {
      name: string;
      posts: {
        nodes: {
          featuredImage: {
            node: {
              sourceUrl: string;
            };
          };
          title: string;
          date: string;
          excerpt: string;
          slug: string;
        }[];
      };
    }[];
  };
}

export interface PostsList {
  nodes: PostCard[];
}

export interface PostContentProps extends PostCard {
  seo: IMeta;
  content: string;
  brands: { nodes: BrandLink[] };
}
