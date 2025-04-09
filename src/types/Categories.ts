import { IMeta } from '@/components/Layout/Meta';

export interface CategoryPageProps {
  id: string;
  uri: string;
  name: string;
  seo: IMeta;
  description: string;
}

export interface CategoryMenuProps {
  name: string;
  uri: string;
  children: { nodes: CategoryMenuProps[] };
}
