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

    // Déterminer si c'est un filtre numérique
    const isNumericFilter =
      filterConfig.type === 'maxValueCheckbox' ||
      filterConfig.type === 'minValueCheckbox' ||
      filterConfig.type === 'range';

    // Construire le préfixe du champ selon le type
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
        // Pour les attributs numériques, on utilise .value au lieu de .slug
        fieldPrefix = isNumericFilter
          ? `attributes.${baseKey}.value`
          : `attributes.${baseKey}.slug`;
        break;
    }

    console.log('=== DEBUG FILTER CONSTRUCTION ===');
    console.log('filterConfig:', filterConfig);
    console.log('baseKey:', baseKey);
    console.log('fieldPrefix:', fieldPrefix);
    console.log('isNumericFilter:', isNumericFilter);
    console.log('value:', value);

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
    } else if (filterConfig.type === 'maxValueCheckbox') {
      // Pour les maxValueCheckbox, on cherche les valeurs inférieures ou égales
      // Convertir en nombre pour la comparaison
      const numericValue = parseFloat(value);
      console.log('numericValue:', numericValue);
      if (!isNaN(numericValue)) {
        meiliFilters.push(`${fieldPrefix} <= ${numericValue}`);
        console.log('meiliFilters:', meiliFilters);
      }
    } else if (filterConfig.type === 'minValueCheckbox') {
      // Pour les minValueCheckbox, on cherche les valeurs supérieures ou égales
      // Convertir en nombre pour la comparaison
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        meiliFilters.push(`${fieldPrefix} >= ${numericValue}`);
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

  console.log('=== MEILISEARCH REQUEST ===');
  console.log('Filter string:', filterString);
  console.log('Request options:', JSON.stringify(requestOptions, null, 2));

  const response = await fetch(meilisearchUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.MEILISEARCH_API_KEY}`,
    },
    body: JSON.stringify(requestOptions),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('=== MEILISEARCH ERROR ===');
    console.error('Status:', response.status);
    console.error('StatusText:', response.statusText);
    console.error('Body:', errorText);
    throw new Error(
      `Erreur Meilisearch: ${response.status} ${response.statusText}`,
    );
  }

  const result = await response.json();
  console.log('=== MEILISEARCH RESPONSE ===');
  console.log(
    'Facettes disponibles:',
    Object.keys(result.facetDistribution || {}),
  );
  console.log(
    'Distribution des facettes:',
    JSON.stringify(result.facetDistribution, null, 2),
  );
  console.log('Premier produit:', JSON.stringify(result.hits[0], null, 2));

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
