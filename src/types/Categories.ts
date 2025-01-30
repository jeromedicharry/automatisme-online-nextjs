export interface CategoryPageProps {
  id: string;
  uri: string;
  name: string;
  seo: {
    metaDesc: string;
    title: string;
    fullHead: string;
  };
}

export interface CategoryMenuProps {
  name: string;
  uri: string;
  children: { nodes: CategoryMenuProps[] };
}
