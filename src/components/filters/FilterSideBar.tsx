import useIsMobile from '@/utils/hooks/useIsMobile';
import { formatFacets } from './utils';
import { allowedFilters } from './config';

import { useFilters } from './useFilters';
import FacetSection from './FacetSection';
import CheckboxFacet from './CheckboxFacet';
import RangeFacet from './RangeFacet';
import MaxValueFacet from './MaxValueFacet';

const FilterSidebar = ({ facetDistribution }: { facetDistribution: any }) => {
  const {
    query,
    openSections,
    toggleFilterValue,
    toggleSection,
    resetFilters,
  } = useFilters();

  const formattedFacets = formatFacets(facetDistribution);
  const isMobile = useIsMobile();

  // Fonction améliorée pour détecter les filtres actifs, incluant les filtres de type range
  const hasActiveFilters = () => {
    // Vérifier les filtres standard
    const hasStandardFilters = Object.keys(query).some((key) =>
      allowedFilters.some((f) => f.key === key),
    );

    // Vérifier les filtres de type range avec suffixes _min et _max
    const hasRangeFilters = Object.keys(query).some((key) => {
      // Vérifier si la clé se termine par _min ou _max
      if (key.endsWith('_min') || key.endsWith('_max')) {
        // Extraire le nom de base du filtre (sans le suffixe)
        const baseKey = key.replace(/_min$|_max$/, '');
        // Vérifier si ce filtre de base existe dans allowedFilters
        return allowedFilters.some(
          (f) => f.key === baseKey && f.type === 'range',
        );
      }
      return false;
    });

    return hasStandardFilters || hasRangeFilters;
  };

  return (
    <aside className="w-full md:w-[250px] xl:w-[325px] text-primary md:sticky md:top-20 overflow-visible max-md:overflow-auto shrink-0">
      <div className="mb-4 flex justify-center">
        <button
          onClick={resetFilters}
          disabled={!hasActiveFilters()}
          className={`text-center text-primary underline ${
            !hasActiveFilters()
              ? 'opacity-40 cursor-not-allowed'
              : 'hover:text-secondary duration-300'
          }`}
        >
          Supprimer les filtres
        </button>
      </div>
      <div className="flex flex-col max-md:flex-row max-md:gap-4 max-md:overflow-x-auto scrollbar-custom max-md:items-start max-md:justify-start max-md:pb-4">
        {Object.entries(formattedFacets)
          .filter(([, facet]) => facet.values.length > 0)
          .map(([label, facet]) => {
            const filter = allowedFilters.find((f) => f.label === label);
            if (!filter) return null;

            const { key, searchType } = filter;
            const isOpen =
              openSections[label] ??
              (facet.type === 'range' && !isMobile
                ? true
                : searchType === 'taxonomy' && !isMobile);

            const selectedValues = (query[key] as string)?.split(',') ?? [];

            const handleValueChange = (value: string) =>
              toggleFilterValue(key, value, searchType, facet.type);

            return (
              <FacetSection
                key={label}
                label={label}
                isOpen={isOpen}
                onToggle={() => toggleSection(label)}
              >
                {facet.type === 'checkbox' && (
                  <CheckboxFacet
                    values={facet.values}
                    selectedValues={selectedValues}
                    onChange={handleValueChange}
                  />
                )}

                {facet.type === 'range' && searchType === 'meta' && (
                  <RangeFacet
                    values={facet.values}
                    minValue={query[`${key}_min`] as string | undefined}
                    maxValue={query[`${key}_max`] as string | undefined}
                    onChange={handleValueChange}
                  />
                )}

                {facet.type === 'maxValueCheckbox' && searchType === 'meta' && (
                  <MaxValueFacet
                    values={facet.values}
                    selectedValues={selectedValues}
                    onChange={handleValueChange}
                  />
                )}
              </FacetSection>
            );
          })}
      </div>
    </aside>
  );
};

export default FilterSidebar;
