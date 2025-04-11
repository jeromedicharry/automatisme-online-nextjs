import { allowedFilters, perPage } from '@/components/filters/config';

export const fetchMeiliProductsByCategory = async ({
  categorySlug,
  page = 1,
  limit = perPage,
  filters = {},
}: {
  categorySlug: string;
  page?: number;
  limit?: number;
  filters?: Record<string, string>;
}) => {
  const offset = (page - 1) * limit;

  // Ajouter la catégorie comme filtre principal
  let meiliFilters = [`taxonomies.product_cat.slug = ${categorySlug}`];

  // Convertir les autres filtres au format Meilisearch
  for (const [key, value] of Object.entries(filters)) {
    const filterConfig = allowedFilters.find((f) => f.key === key);
    if (!filterConfig) continue;

    let filterCondition: string;

    // Déterminer le préfixe en fonction du type
    let fieldPrefix: string;
    switch (filterConfig.searchType) {
      case 'taxonomy':
        fieldPrefix = `taxonomies.${key}.slug`;
        break;
      case 'meta':
        fieldPrefix = `meta.${key}`;
        break;
      case 'attribute':
      default:
        fieldPrefix = `attributes.${key}.slug`;
    }

    // Gestion spéciale pour les ranges de meta
    if (filterConfig.type === 'range' && filterConfig.searchType === 'meta') {
      const [min, max] = value.split('-');
      filterCondition = `${fieldPrefix} >= ${min} AND ${fieldPrefix} <= ${max}`;
    }
    // Gestion des valeurs multiples (OR)
    else if (value.includes(',')) {
      const values = value.split(',').map((v) => v.trim());
      filterCondition = values.map((v) => `${fieldPrefix} = ${v}`).join(' OR ');
      filterCondition = `(${filterCondition})`;
    }
    // Cas standard (égalité simple)
    else {
      filterCondition = `${fieldPrefix} = ${value}`;
    }

    meiliFilters.push(filterCondition);
  }

  // Combiner tous les filtres avec AND
  const filterString = meiliFilters.join(' AND ');

  const response = await fetch(
    'https://meilisearch.automatisme-online.fr/indexes/product/search',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.MEILISEARCH_API_KEY}`,
      },
      body: JSON.stringify({
        q: '', // On ne fait pas de recherche textuelle ici
        limit,
        offset,
        filter: filterString,
        facets: ['*'], // Spécifiez les champs pour lesquels vous voulez des facettes
      }),
    },
  );

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération depuis Meilisearch');
  }

  const result = await response.json();

  return {
    products: result.hits,
    facets: result.facetDistribution || {},
    total: result.estimatedTotalHits,
  };
};
