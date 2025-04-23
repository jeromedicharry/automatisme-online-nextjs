import { IMeta } from '@/components/Layout/Meta';

export interface CategoryLinkProps {
  name: string;
  uri: string;
}

export interface CategoryPageProps {
  id: string;
  slug: string;
  uri: string;
  name: string;
  seo: IMeta;
  description: string;
  children: { nodes: CategoryLinkProps[] };
}

export type ParentCategoryDesktopMenuType =
  | 'default'
  | 'telecommandes'
  | 'accessoires';

export interface BrandLink {
  name: string;
  slug: string;
}
export interface CategoryMenuProps {
  name: string;
  uri: string;
  image?: {
    sourceUrl: string;
  };
  acfCategory?: {
    menuType?: ParentCategoryDesktopMenuType;
    brands?: { nodes: BrandLink[] };
  };
  children: { nodes: CategoryMenuProps[] };
}
