export type FilterType = 'checkbox' | 'range' | 'maxValueCheckbox';
export type SearchType = 'attribute' | 'taxonomy' | 'meta';

export type AllowedFilter = {
  label: string;
  key: string;
  type: FilterType;
  searchType: SearchType; // Nouveau champ pour spécifier le type de recherche
  metaType?: 'number' | 'string'; // Pour les champs meta
};

export const perPage = 50;

export const allowedFilters: AllowedFilter[] = [
  // Taxonomies
  {
    label: 'Marque',
    key: 'product_brand',
    type: 'checkbox',
    searchType: 'taxonomy',
  },
  // {
  //   label: 'Catégorie',
  //   key: 'product_cat',
  //   type: 'checkbox',
  //   searchType: 'taxonomy',
  // },

  // Attributs de type checkbox
  {
    label: 'Codage télécommande',
    key: 'codage-telecommande',
    type: 'checkbox',
    searchType: 'attribute',
  },
  {
    label: 'Couleur',
    key: 'couleur',
    type: 'checkbox',
    searchType: 'attribute',
  },
  {
    label: 'Couleur des boutons',
    key: 'couleur-des-boutons',
    type: 'checkbox',
    searchType: 'attribute',
  },
  {
    label: 'Difficulté de pose',
    key: 'difficulte-de-pose',
    type: 'checkbox',
    searchType: 'attribute',
  },
  {
    label: 'Fréquence (MHz)',
    key: 'frequence-telecommande-mhz',
    type: 'checkbox',
    searchType: 'attribute',
  },
  {
    label: 'Nombre de boutons',
    key: 'nombre-de-boutons',
    type: 'checkbox',
    searchType: 'attribute',
  },
  {
    label: 'Tension (V)',
    key: 'tension-telecommande-v',
    type: 'checkbox',
    searchType: 'attribute',
  },

  {
    label: 'Hauteur porte basculante (m)',
    key: 'hauteur-porte-basculante-m',
    type: 'checkbox',
    searchType: 'attribute',
  },
  {
    label: 'Poids max porte (kg)',
    key: 'poids-max-porte-de-garage-kg',
    type: 'checkbox',
    searchType: 'attribute',
  },
  {
    label: 'Surface porte (m²)',
    key: 'surface-porte-de-garage-m²',
    type: 'checkbox',
    searchType: 'attribute',
  },
  {
    label: 'Puissance (W)',
    key: 'puissance-w',
    type: 'checkbox',
    searchType: 'attribute',
  },
  {
    label: 'Usage',
    key: 'usage',
    type: 'checkbox',
    searchType: 'attribute',
  },
  // Attributs numériques (type range)

  // Meta (prix)
  {
    label: 'Prix',
    key: '_price',
    type: 'range',
    searchType: 'meta',
    metaType: 'number',
  },
];

export type sortingOption = {
  label: string;
  value: string;
};

export const sortingOptions: sortingOption[] = [
  { label: 'Pertinence', value: '' },
  { label: 'Prix croissant', value: 'meta._price:asc' },
  { label: 'Prix décroissant', value: 'meta._price:desc' },
];

export const meilisearchUrl =
  'https://meilisearch.automatisme-online.fr/indexes/product/search';
export const meilisearchStatsUrl =
  'https://meilisearch.automatisme-online.fr/indexes/product/stats';
