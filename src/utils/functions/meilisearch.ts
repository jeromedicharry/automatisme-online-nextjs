import {
  allowedFilters,
  meilisearchStatsUrl,
  meilisearchUrl,
  perPage,
} from '@/components/filters/config';

type MeiliRequestOptions = {
  q: string;
  limit: number;
  offset: number;
  filter: string;
  facets: string[];
  sort?: string[]; // Propriété optionnelle
};

export const fetchMeiliProductsByCategory = async ({
  categorySlug,
  page = 1,
  limit = perPage,
  filters = {},
  sort = '',
}: {
  categorySlug: string;
  page?: number;
  limit?: number;
  filters?: Record<string, string>;
  sort?: string;
}) => {
  const offset = (page - 1) * limit;

  // Ajouter la catégorie comme filtre principal + seulement les produits visibles
  let meiliFilters = [
    `taxonomies.product_cat.slug = ${categorySlug} AND meta._visibility = visible`,
  ];

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

  let requestOptions: MeiliRequestOptions = {
    q: '', // On ne fait pas de recherche textuelle ici
    limit,
    offset,
    filter: filterString,
    facets: ['*'], // Spécifiez les champs pour lesquels vous voulez des facettes
  };

  // Ajouter le tri uniquement s'il est défini et non vide
  if (sort && sort.trim() !== '') {
    requestOptions.sort = [sort];
  }

  const response = await fetch(meilisearchUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.MEILISEARCH_API_KEY}`,
    },
    body: JSON.stringify(requestOptions),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération depuis Meilisearch');
  }

  const result = await response.json();

  const hasPose = !!Object.keys(
    result.facetDistribution['meta._has_pose'] || {},
  ).length;

  return {
    products: result.hits,
    facets: result.facetDistribution || {},
    total: result.estimatedTotalHits,
    hasPose,
  };
};

export const getTotalProductsMeili = async () => {
  const response = await fetch(meilisearchStatsUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.MEILISEARCH_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération depuis Meilisearch');
  }

  const result = await response.json();

  return result.numberOfDocuments;
};
