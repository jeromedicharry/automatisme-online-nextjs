import { allowedFilters } from '@/components/filters/FilterSideBar';

export const fetchMeiliProductsByCategory = async ({
  query,
  page = 1,
  limit = 50,
  filters = {},
}: {
  query: string;
  page?: number;
  limit?: number;
  filters?: Record<string, string>;
}) => {
  const offset = (page - 1) * limit;

  const facets = allowedFilters
    .filter((filter) => filter.type === 'checkbox')
    .map((filter) => `terms.${filter.key}`);

  // Convertir les filtres au format Meilisearch
  let meiliFilters: string[] = [];

  for (const [key, value] of Object.entries(filters)) {
    // Si la valeur contient des virgules, on crée un OR pour chaque valeur
    if (value.includes(',')) {
      const values = value.split(',').map((v) => v.trim());
      const orConditions = values
        .map((v) => `terms.${key}.name = ${v}`)
        .join(' OR ');
      meiliFilters.push(`(${orConditions})`);
    } else {
      meiliFilters.push(`terms.${key}.name = ${value}`);
    }
  }

  // Combiner tous les filtres avec AND
  const filterString = meiliFilters.join(' AND ');

  const response = await fetch(
    'https://meilisearch.automatisme-online.fr/indexes/product_index/search',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.MEILISEARCH_API_KEY}`,
      },
      body: JSON.stringify({
        q: query,
        limit,
        offset,
        ...(meiliFilters.length > 0 && { filter: filterString }),
        facets,
      }),
    },
  );

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération depuis Meilisearch');
  }

  const result = await response.json();

  return {
    products: result.hits,
    facets: result.facetDistribution,
    total: result.estimatedTotalHits,
  };
};
