import { useEffect, useState } from 'react';
import { fetchMeiliProductsByCategory } from '@/utils/functions/meilisearch';

export const useGlobalValues = (categorySlug: string, attributeKey: string) => {
  const [globalValues, setGlobalValues] = useState<{ min: number; max: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGlobalValues = async () => {
      try {
        setIsLoading(true);
        // Récupérer les valeurs min et max en parallèle
        const [minResult, maxResult] = await Promise.all([
          // Récupérer la valeur minimum
          fetchMeiliProductsByCategory({
            categorySlug,
            page: 1,
            limit: 1,
            filters: {},
            sort: `attributes.${attributeKey}.value:asc`
          }),
          // Récupérer la valeur maximum
          fetchMeiliProductsByCategory({
            categorySlug,
            page: 1,
            limit: 1,
            filters: {},
            sort: `attributes.${attributeKey}.value:desc`
          })
        ]);

        if (minResult.products[0] && maxResult.products[0]) {
          const minValue = parseFloat(minResult.products[0].attributes[attributeKey].value);
          const maxValue = parseFloat(maxResult.products[0].attributes[attributeKey].value);

          setGlobalValues({
            min: minValue,
            max: maxValue
          });
        }
      } catch (error) {
        console.error('Error fetching global values:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (categorySlug && attributeKey) {
      fetchGlobalValues();
    }
  }, [categorySlug, attributeKey]);

  return { globalValues, isLoading };
};
