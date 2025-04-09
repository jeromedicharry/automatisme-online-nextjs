import { useState } from 'react';
import { useRouter } from 'next/router';

import { Chevron } from '../SVG/Icons';

type FilterType = 'checkbox' | 'range' | 'maxValueCheckbox';

type AllowedFilter = {
  label: string;
  key: string; // clé brute dans facetDistribution (sans `.name`)
  type: FilterType;
};

type SimpleFacetValue = {
  name: string;
  count: number;
};

export const allowedFilters: AllowedFilter[] = [
  { label: 'Marque', key: 'product_brand', type: 'checkbox' },
  {
    label: 'Difficulté de pose',
    key: 'pa_difficulte-de-pose',
    type: 'checkbox',
  },
  { label: 'Couleur', key: 'pa_couleur', type: 'checkbox' },
  {
    label: 'Couleur des boutons',
    key: 'pa_couleur-des-boutons',
    type: 'checkbox',
  },
  { label: 'Prix', key: 'meta._price', type: 'range' },
  //   { label: 'Dimensions', key: 'dimensions', type: 'maxValueCheckbox' },
];

export const getFacetKeyFromFilterKey = (key: string): string => {
  const filter = allowedFilters.find((f) => f.key === key);

  if (!filter) return key;

  const isSpecial = ['range', 'maxValueCheckbox'].includes(filter.type);
  return isSpecial ? key : `terms.${key}.name`;
};

const formatFacets = (
  facets: Record<string, Record<string, number>>,
): Record<string, { type: FilterType; values: SimpleFacetValue[] }> => {
  const result: Record<
    string,
    { type: FilterType; values: SimpleFacetValue[] }
  > = {};

  allowedFilters.forEach(({ label, key, type }) => {
    const facetKey = getFacetKeyFromFilterKey(key);
    const data = facets[facetKey];

    if (!data) return;

    const values = Object.entries(data)
      .filter(([, count]) => count > 0)
      .map(([name, count]) => ({ name, count }));

    if (values.length > 0) {
      result[label] = { type, values };
    }
  });

  return result;
};

const FilterSidebar = ({ facetDistribution }: any) => {
  const router = useRouter();
  const { query } = router;
  const formattedFacets = formatFacets(facetDistribution);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleFilterValue = (key: string, value: string) => {
    const currentValues = (query[key] as string)?.split(',') ?? [];
    const isActive = currentValues.includes(value);

    let newValues: string[];

    if (isActive) {
      newValues = currentValues.filter((v) => v !== value);
    } else {
      newValues = [...currentValues, value];
    }

    // Créer une copie du query actuel
    const newQuery = { ...query };

    if (newValues.length > 0) {
      // Si il reste des valeurs, on met à jour
      newQuery[key] = newValues.join(',');
    } else {
      // Si plus de valeurs, on supprime complètement la clé
      delete newQuery[key];
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

  const onResetFilters = () => {
    // Créer un nouveau query sans les filtres
    const newQuery = { ...query };

    // Supprimer toutes les clés correspondant aux filtres
    allowedFilters.forEach((filter) => {
      delete newQuery[filter.key];
    });

    // Fermer toutes les sections
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

  const renderFacetFilter = (
    label: string,
    facet: { type: FilterType; values: SimpleFacetValue[] },
    key: string,
  ) => {
    const isOpen = openSections[label];

    return (
      <div key={label} className="mb-3">
        <button
          onClick={() => toggleSection(label)}
          className="w-full flex items-baseline text-left gap-2"
        >
          <p className="font-bold">{label}</p>
          <div
            className={`text-secondary w-3 h-3 flex justify-center items-center duration-300 ${isOpen ? 'rotate-90' : '-rotate-90'}`}
          >
            <Chevron />
          </div>
        </button>

        <div
          className={`mt-3 overflow-hidden duration-300 ease-in-out ${
            isOpen ? 'max-h-[1500px]' : 'max-h-0 pointer-events-none opacity-85'
          } transform origin-top`}
        >
          {' '}
          {facet.type === 'checkbox' && (
            <ul className="space-y-2">
              {facet.values.map(({ name, count }) => (
                <li key={name}>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="w-3 h-3 accent-primary"
                      checked={(
                        (query[key] as string)?.split(',') ?? []
                      ).includes(name)}
                      onChange={() => toggleFilterValue(key, name)}
                    />

                    <span>
                      {name} ({count})
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          )}
          {facet.type === 'range' &&
            (() => {
              const valuesAsNumbers = facet.values
                .map((v) => parseFloat(v.name))
                .filter((v) => !isNaN(v));
              const min = Math.min(...valuesAsNumbers);
              const max = Math.max(...valuesAsNumbers);

              return (
                <div>
                  <input type="range" min={min} max={max} className="w-full" />
                  <input
                    type="range"
                    min={min}
                    max={max}
                    className="w-full mt-2"
                  />
                  <p className="text-sm mt-1">
                    Min: {min} - Max: {max}
                  </p>
                </div>
              );
            })()}
          {facet.type === 'maxValueCheckbox' &&
            (() => {
              const sortedValues = facet.values
                .map(({ name, count }) => ({
                  value: parseFloat(name),
                  count,
                }))
                .filter((v) => !isNaN(v.value))
                .sort((a, b) => a.value - b.value);

              return (
                <ul className="space-y-2">
                  {sortedValues.map(({ value, count }) => (
                    <li key={value}>
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="w-[12px] h-[12px]" />
                        <span>
                          ≤ {value} ({count})
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              );
            })()}
        </div>
      </div>
    );
  };

  return (
    <aside className="min-w-[250px] xxl:min-w-[325px] text-primary md:sticky md:top-10">
      <div className="mb-4">
        <button
          onClick={onResetFilters}
          disabled={
            Object.keys(query).filter((key) =>
              allowedFilters.some((f) => f.key === key),
            ).length === 0
          }
          className={`w-full py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 ${
            Object.keys(query).filter((key) =>
              allowedFilters.some((f) => f.key === key),
            ).length === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-red-50 hover:bg-red-100 text-red-600'
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Supprimer les filtres
        </button>
      </div>
      {Object.entries(formattedFacets).map(([label, facet]) => {
        const filter = allowedFilters.find((f) => f.label === label);
        if (!filter) return null;
        return renderFacetFilter(label, facet, filter.key);
      })}
    </aside>
  );
};

export default FilterSidebar;
