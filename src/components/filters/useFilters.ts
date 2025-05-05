import { useState } from 'react';
import { useRouter } from 'next/router';

import { allowedFilters, FilterType, SearchType } from './config';

export const useFilters = () => {
  const router = useRouter();
  const { query } = router;
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleFilterValue = (
    key: string,
    value: string,
    searchType: SearchType,
    filterType?: FilterType,
  ) => {
    const currentValues = (query[key] as string)?.split(',') ?? [];
    const isActive = currentValues.includes(value);

    let newValues: string[];

    if (filterType === 'range' && searchType === 'meta') {
      newValues = isActive ? [] : [value];
    } else {
      newValues = isActive
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
    }

    const newQuery = { ...query };

    // Supprimer d'abord tous les paramètres liés à ce filtre
    delete newQuery[key];
    delete newQuery[`${key}_min`];
    delete newQuery[`${key}_max`];

    if (newValues.length > 0) {
      // Pour les filtres de type range, utiliser uniquement les paramètres _min et _max
      if (filterType === 'range' && searchType === 'meta') {
        const [min, max] = value.split('-');
        newQuery[`${key}_min`] = min;
        newQuery[`${key}_max`] = max;
        // Ne pas ajouter le paramètre combiné pour éviter la duplication
        // newQuery[key] = newValues.join(',');
      } else {
        // Pour les autres types de filtres, utiliser le format standard
        newQuery[key] = newValues.join(',');
      }
    }

    router.push(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true },
    );
  };

  const toggleSection = (label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const resetFilters = () => {
    const newQuery = { ...query };
    allowedFilters.forEach((filter) => {
      delete newQuery[filter.key];
      // Ajouter nettoyage des paramètres _min et _max
      if (filter.type === 'range' && filter.searchType === 'meta') {
        delete newQuery[`${filter.key}_min`];
        delete newQuery[`${filter.key}_max`];
      }
    });
    setOpenSections({});
    router.push(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true },
    );
  };

  return {
    query,
    openSections,
    toggleFilterValue,
    toggleSection,
    resetFilters,
  };
};
