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

      let values = Object.entries(data).map(([name, count]) => ({ name, count }));

      // Pour les facettes qui ne sont pas de type range, on filtre les valeurs avec count > 0
      if (type !== 'range') {
        values = values.filter((v) => v.count > 0);
      }

      // Ne garder que les facettes avec des valeurs
      if (values.length > 0) {
        // Pour les ranges, on trie les valeurs par ordre numérique
        if (type === 'range') {
          values.sort((a, b) => parseFloat(a.name) - parseFloat(b.name));
        }
        result[label] = { type, values };
      }
    });

  return result;
};
