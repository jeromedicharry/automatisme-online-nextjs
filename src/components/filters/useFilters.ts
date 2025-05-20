import { useState } from 'react';
import { useRouter } from 'next/router';

import { FilterType, SearchType } from './config';

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
    const newQuery = { ...query };

    // Gestion spéciale pour les filtres range
    if (filterType === 'range' && searchType === 'meta') {
      const [min, max] = value.split('-');

      // Vérifier si c'est la même plage que celle déjà sélectionnée
      const isSameRange =
        newQuery[`${key}_min`] === min && newQuery[`${key}_max`] === max;

      if (isSameRange) {
        // Désélectionner la plage
        delete newQuery[`${key}_min`];
        delete newQuery[`${key}_max`];
      } else {
        // Sélectionner la nouvelle plage
        newQuery[`${key}_min`] = min;
        newQuery[`${key}_max`] = max;
      }

      // Supprimer l'ancienne version combinée si elle existe
      delete newQuery[key];
    } else {
      // Logique originale pour les autres filtres
      const currentValues = (newQuery[key] as string)?.split(',') ?? [];
      const isActive = currentValues.includes(value);

      const newValues = isActive
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];

      delete newQuery[key];
      if (newValues.length > 0) {
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
    // Liste des paramètres à conserver (non-filtres)
    const paramsToKeep = ['page', 'sort', 'q', 'view', 'limit', 'slug'];

    // Créer un nouvel objet de requête en ne gardant que les paramètres essentiels
    const newQuery: Record<string, string | string[]> = {};

    // Ne conserver que les paramètres de la liste paramsToKeep
    paramsToKeep.forEach((param) => {
      if (query[param] !== undefined) {
        newQuery[param] = query[param];
      }
    });

    // Réinitialiser également l'état des sections ouvertes
    setOpenSections({});

    // Naviguer avec les nouveaux paramètres
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
