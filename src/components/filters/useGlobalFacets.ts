import { useEffect, useState } from 'react';
import { fetchMeiliProductsByCategory } from '@/utils/functions/meilisearch';

export const useGlobalFacets = (categorySlug: string) => {
  const [globalFacets, setGlobalFacets] = useState<any>(null);

  useEffect(() => {
    const fetchGlobalFacets = async () => {
      try {
        // Récupérer toutes les facettes sans filtre
        const { facets } = await fetchMeiliProductsByCategory({
          categorySlug,
          page: 1,
          limit: 1,
          filters: {}, // Aucun filtre pour avoir toutes les valeurs possibles
        });

        // Stocker les facettes brutes
        setGlobalFacets(facets);
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
