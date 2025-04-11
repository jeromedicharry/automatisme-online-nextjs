import { allowedFilters, FilterType, SearchType } from './config';

export type SimpleFacetValue = {
  name: string;
  count: number;
};

export const getFacetKeyFromFilterKey = (
  key: string,
  searchType: SearchType,
): string => {
  switch (searchType) {
    case 'taxonomy':
      return `taxonomies.${key}.slug`;
    case 'meta':
      return `meta.${key}`;
    case 'attribute':
    default:
      return `attributes.${key}.slug`;
  }
};

export const formatFacets = (
  facets: Record<string, Record<string, number>>,
): Record<string, { type: FilterType; values: SimpleFacetValue[] }> => {
  const result: Record<
    string,
    { type: FilterType; values: SimpleFacetValue[] }
  > = {};

  allowedFilters
    // Exclure les filtres de catégorie
    .filter((filter) => filter.key !== 'product_cat')
    .forEach(({ label, key, type, searchType }) => {
      const facetKey = getFacetKeyFromFilterKey(key, searchType);
      const data = facets[facetKey];

      if (!data) return;

      const values = Object.entries(data)
        .filter(([, count]) => count > 0)
        .map(([name, count]) => ({ name, count }));

      // Ne garder que les facettes avec des valeurs
      if (values.length > 0 && values.some((v) => v.count > 0)) {
        result[label] = { type, values };
      }
    });

  return result;
};
