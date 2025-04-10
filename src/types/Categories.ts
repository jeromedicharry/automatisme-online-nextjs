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

export interface CategoryMenuProps {
  name: string;
  uri: string;
  children: { nodes: CategoryMenuProps[] };
}
