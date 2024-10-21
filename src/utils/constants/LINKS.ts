interface ILinks {
  id: number;
  title: string;
  href: string;
}

const LINKS: ILinks[] = [
  {
    id: 0,
    title: 'Accueil',
    href: '/',
  },
  {
    id: 1,
    title: 'Produits',
    href: '/produits',
  },
  {
    id: 2,
    title: 'Catégories',
    href: '/categories',
  },
];

export default LINKS;
