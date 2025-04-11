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

    if (newValues.length > 0) {
      newQuery[key] = newValues.join(',');
    } else {
      delete newQuery[key];
    }

    if (
      filterType === 'range' &&
      searchType === 'meta' &&
      newValues.length > 0
    ) {
      const [min, max] = value.split('-');
      newQuery[`${key}_min`] = min;
      newQuery[`${key}_max`] = max;
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
