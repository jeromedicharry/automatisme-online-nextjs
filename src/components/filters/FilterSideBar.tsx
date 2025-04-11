import { useState } from 'react';
import { useRouter } from 'next/router';

import { Chevron } from '../SVG/Icons';
import useIsMobile from '@/utils/hooks/useIsMobile';

type FilterType = 'checkbox' | 'range' | 'maxValueCheckbox';
type SearchType = 'attribute' | 'taxonomy' | 'meta';

type AllowedFilter = {
  label: string;
  key: string;
  type: FilterType;
  searchType: SearchType; // Nouveau champ pour spécifier le type de recherche
  metaType?: 'number' | 'string'; // Pour les champs meta
};

type SimpleFacetValue = {
  name: string;
  count: number;
};

export const allowedFilters: AllowedFilter[] = [
  // Taxonomies
  {
    label: 'Marque',
    key: 'product_brand',
    type: 'checkbox',
    searchType: 'taxonomy',
  },
  // {
  //   label: 'Catégorie',
  //   key: 'product_cat',
  //   type: 'checkbox',
  //   searchType: 'taxonomy',
  // },

  // Attributs de type checkbox
  {
    label: 'Codage télécommande',
    key: 'codage-telecommande',
    type: 'checkbox',
    searchType: 'attribute',
  },
  {
    label: 'Couleur',
    key: 'couleur',
    type: 'checkbox',
    searchType: 'attribute',
  },
  {
    label: 'Couleur des boutons',
    key: 'couleur-des-boutons',
    type: 'checkbox',
    searchType: 'attribute',
  },
  {
    label: 'Difficulté de pose',
    key: 'difficulte-de-pose',
    type: 'checkbox',
    searchType: 'attribute',
  },
  {
    label: 'Fréquence (MHz)',
    key: 'frequence-telecommande-mhz',
    type: 'checkbox',
    searchType: 'attribute',
  },
  {
    label: 'Nombre de boutons',
    key: 'nombre-de-boutons',
    type: 'checkbox',
    searchType: 'attribute',
  },
  {
    label: 'Tension (V)',
    key: 'tension-telecommande-v',
    type: 'checkbox',
    searchType: 'attribute',
  },

  {
    label: 'Hauteur porte basculante (m)',
    key: 'hauteur-porte-basculante-m',
    type: 'checkbox',
    searchType: 'attribute',
  },
  {
    label: 'Poids max porte (kg)',
    key: 'poids-max-porte-de-garage-kg',
    type: 'checkbox',
    searchType: 'attribute',
  },
  {
    label: 'Surface porte (m²)',
    key: 'surface-porte-de-garage-m²',
    type: 'checkbox',
    searchType: 'attribute',
  },
  {
    label: 'Puissance (W)',
    key: 'puissance-w',
    type: 'checkbox',
    searchType: 'attribute',
  },
  {
    label: 'Usage',
    key: 'usage',
    type: 'checkbox',
    searchType: 'attribute',
  },
  // Attributs numériques (type range)

  // Meta (prix)
  {
    label: 'Prix',
    key: '_price',
    type: 'range',
    searchType: 'meta',
    metaType: 'number',
  },
];
export const getFacetKeyFromFilterKey = (
  key: string,
  searchType: SearchType,
): string => {
  switch (searchType) {
    case 'taxonomy':
      return `taxonomies.${key}.slug`;
    case 'meta':
      return `meta.${key}`;
    case 'attribute':
    default:
      return `attributes.${key}.slug`;
  }
};

const formatFacets = (
  facets: Record<string, Record<string, number>>,
): Record<string, { type: FilterType; values: SimpleFacetValue[] }> => {
  const result: Record<
    string,
    { type: FilterType; values: SimpleFacetValue[] }
  > = {};

  allowedFilters
    // Exclure les filtres de catégorie
    .filter((filter) => filter.key !== 'product_cat')
    .forEach(({ label, key, type, searchType }) => {
      const facetKey = getFacetKeyFromFilterKey(key, searchType);
      const data = facets[facetKey];

      if (!data) return;

      const values = Object.entries(data)
        .filter(([, count]) => count > 0)
        .map(([name, count]) => ({ name, count }));

      // Ne garder que les facettes avec des valeurs
      if (values.length > 0 && values.some((v) => v.count > 0)) {
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
  const isMobile = useIsMobile();

  const toggleFilterValue = (
    key: string,
    value: string,
    searchType: SearchType,
    filterType?: FilterType,
  ) => {
    const currentValues = (query[key] as string)?.split(',') ?? [];
    const isActive = currentValues.includes(value);

    let newValues: string[];

    // Gestion spéciale pour les filtres de type range (meta)
    if (filterType === 'range' && searchType === 'meta') {
      // Pour les ranges, on remplace complètement la valeur
      newValues = isActive ? [] : [value];
    } else {
      // Comportement standard pour les checkbox
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

    // Pour les meta de type range, on formate la valeur min-max
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
    searchType: SearchType,
    metaType?: 'number' | 'string',
  ) => {
    const isOpen =
      openSections[label] ?? (searchType === 'taxonomy' && !isMobile) ?? true; // Par défaut ouvert

    return (
      <div key={label} className="md:mb-3">
        <button
          onClick={() => toggleSection(label)}
          className="md:w-full flex items-baseline text-left gap-2"
        >
          <p className="font-bold max-md:text-sm leading-general whitespace-nowrap">
            {label}
          </p>
          <div
            className={`text-secondary w-3 h-3 flex justify-center items-center duration-300 ${
              isOpen ? 'rotate-90' : '-rotate-90'
            }`}
          >
            <Chevron />
          </div>
        </button>

        <div
          className={`mt-3 overflow-hidden duration-300 ease-in-out ${
            isOpen
              ? 'max-h-[600px] static'
              : 'absolute max-h-0 pointer-events-none opacity-85'
          } transform origin-top`}
        >
          {facet.type === 'checkbox' && (
            <ul className="space-y-2 overflow-y-auto max-h-[600px] scrollbar-custom pr-6">
              {facet.values.map(({ name, count }) => (
                <li key={name}>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="w-3 h-3 accent-primary"
                      checked={(
                        (query[key] as string)?.split(',') ?? []
                      ).includes(name)}
                      onChange={() =>
                        toggleFilterValue(key, name, searchType, facet.type)
                      }
                    />
                    <span className="whitespace-nowrap">
                      {name} ({count})
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          )}

          {facet.type === 'range' && searchType === 'meta' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fourchette de prix
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full p-2 border rounded"
                    value={query[`${key}_min`] || ''}
                    onChange={(e) =>
                      toggleFilterValue(
                        key,
                        `${e.target.value}-${query[`${key}_max`] || ''}`,
                        searchType,
                        facet.type,
                      )
                    }
                  />
                  <span>à</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full p-2 border rounded"
                    value={query[`${key}_max`] || ''}
                    onChange={(e) =>
                      toggleFilterValue(
                        key,
                        `${query[`${key}_min`] || ''}-${e.target.value}`,
                        searchType,
                        facet.type,
                      )
                    }
                  />
                </div>
              </div>
              {facet.values.length > 0 && (
                <div className="text-xs text-gray-500">
                  Valeurs disponibles:{' '}
                  {Math.min(...facet.values.map((v) => parseFloat(v.name)))}€ -
                  {Math.max(...facet.values.map((v) => parseFloat(v.name)))}€
                </div>
              )}
            </div>
          )}

          {facet.type === 'maxValueCheckbox' && searchType === 'meta' && (
            <ul className="space-y-2">
              {facet.values
                .map(({ name }) => ({ value: parseFloat(name), name }))
                .filter((v) => !isNaN(v.value))
                .sort((a, b) => a.value - b.value)
                .map(({ value, name }) => (
                  <li key={name}>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        className="w-3 h-3 accent-primary"
                        checked={(
                          (query[key] as string)?.split(',') ?? []
                        ).includes(name)}
                        onChange={() =>
                          toggleFilterValue(key, name, searchType, facet.type)
                        }
                      />
                      <span>≤ {value}</span>
                    </label>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    );
  };

  return (
    <aside className="w-full md:w-[250px] xl:w-[325px] text-primary md:sticky md:top-20 max-md:overflow-auto shrink-0">
      <div className="mb-4 flex justify-center">
        <button
          onClick={onResetFilters}
          disabled={
            Object.keys(query).filter((key) =>
              allowedFilters.some((f) => f.key === key),
            ).length === 0
          }
          className={`text-center text-primary hover:text-secondary duration-300 underline ${
            Object.keys(query).filter((key) =>
              allowedFilters.some((f) => f.key === key),
            ).length === 0
              ? 'opacity-40 cursor-not-allowed'
              : ''
          }`}
        >
          Supprimer les filtres
        </button>
      </div>
      <div className="bloc max-md:flex max-md:gap-4 overflow-x-auto scrollbar-custom max-md:items-start max-md:justify-start max-md:pb-4">
        {Object.entries(formattedFacets)
          .filter(([, facet]) => facet.values.length > 0)
          .map(([label, facet]) => {
            const filter = allowedFilters.find((f) => f.label === label);
            if (!filter) return null;
            return renderFacetFilter(
              label,
              facet,
              filter.key,
              filter.searchType,
              filter.metaType,
            );
          })}
      </div>
    </aside>
  );
};

export default FilterSidebar;
