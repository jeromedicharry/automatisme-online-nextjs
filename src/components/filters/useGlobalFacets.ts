import { useEffect, useState } from 'react';
import { fetchMeiliProductsByCategory } from '@/utils/functions/meilisearch';

export const useGlobalFacets = (categorySlug: string) => {
  const [globalFacets, setGlobalFacets] = useState<any>(null);

  useEffect(() => {
    const fetchGlobalFacets = async () => {
      try {
        // Récupérer les prix min et max en parallèle
        const [minResult, maxResult] = await Promise.all([
          // Récupérer le prix minimum
          fetchMeiliProductsByCategory({
            categorySlug,
            page: 1,
            limit: 1,
            filters: {},
            sort: 'meta._price:asc'
          }),
          // Récupérer le prix maximum
          fetchMeiliProductsByCategory({
            categorySlug,
            page: 1,
            limit: 1,
            filters: {},
            sort: 'meta._price:desc'
          })
        ]);

        // Récupérer les facettes normales
        const { facets } = await fetchMeiliProductsByCategory({
          categorySlug,
          page: 1,
          limit: 20,
          filters: {},
        });

        // Créer une copie des facettes
        const mergedFacets = { ...facets };

        // Récupérer les prix min et max des résultats
        if (minResult.products[0] && maxResult.products[0]) {
          const minPrice = minResult.products[0].meta._price;
          const maxPrice = maxResult.products[0].meta._price;
          console.log('Prix min/max trouvés:', { minPrice, maxPrice });

          // Créer une distribution de prix qui inclut les valeurs extrêmes
          mergedFacets['meta._price'] = {
            [minPrice]: 1,
            [maxPrice]: 1
          };
        }

        setGlobalFacets(mergedFacets);
      } catch (error) {
        console.error('Error fetching global facets:', error);
      }
    };

    if (categorySlug) {
      fetchGlobalFacets();
    }
  }, [categorySlug]);

  return globalFacets;
};
