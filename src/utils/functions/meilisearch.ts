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
  sort?: string[];
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

  const meiliFilters: string[] = [
    `taxonomies.product_cat.slug = ${categorySlug} AND meta._visibility = visible`,
  ];
  const alreadyHandled = new Set<string>();

  for (const [key, value] of Object.entries(filters)) {
    const filterConfig = allowedFilters.find(
      (f) => f.key === key.replace(/_min$|_max$/, ''),
    );
    if (!filterConfig) continue;

    const baseKey = key.replace(/_min$|_max$/, '');
    if (alreadyHandled.has(baseKey)) continue;

    let fieldPrefix = '';
    switch (filterConfig.searchType) {
      case 'taxonomy':
        fieldPrefix = `taxonomies.${baseKey}.slug`;
        break;
      case 'meta':
        fieldPrefix = `meta.${baseKey}`;
        break;
      case 'attribute':
      default:
        fieldPrefix = `attributes.${baseKey}.slug`;
    }

    if (filterConfig.type === 'range' && filterConfig.searchType === 'meta') {
      const min = filters[`${baseKey}_min`];
      const max = filters[`${baseKey}_max`];

      if (min && max) {
        meiliFilters.push(
          `${fieldPrefix} >= ${min} AND ${fieldPrefix} <= ${max}`,
        );
      } else if (min) {
        meiliFilters.push(`${fieldPrefix} >= ${min}`);
      } else if (max) {
        meiliFilters.push(`${fieldPrefix} <= ${max}`);
      }
    } else if (value.includes(',')) {
      const values = value
        .split(',')
        .map((v) => `${fieldPrefix} = ${v.trim()}`);
      meiliFilters.push(`(${values.join(' OR ')})`);
    } else if (!key.endsWith('_min') && !key.endsWith('_max')) {
      meiliFilters.push(`${fieldPrefix} = ${value}`);
    }

    alreadyHandled.add(baseKey);
  }

  const filterString = meiliFilters.join(' AND ');

  const requestOptions: MeiliRequestOptions = {
    q: '',
    limit,
    offset,
    filter: filterString,
    facets: ['*'],
  };

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
