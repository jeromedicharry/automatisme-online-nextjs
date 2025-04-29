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

  const hasActiveFilters = Object.keys(query).some((key) =>
    allowedFilters.some((f) => f.key === key),
  );

  return (
    <aside className="w-full md:w-[250px] xl:w-[325px] text-primary md:sticky md:top-20 max-md:overflow-auto shrink-0">
      <div className="mb-4 flex justify-center">
        <button
          onClick={resetFilters}
          disabled={!hasActiveFilters}
          className={`text-center text-primary underline ${
            !hasActiveFilters
              ? 'opacity-40 cursor-not-allowed'
              : 'hover:text-secondary duration-300'
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

            const { key, searchType } = filter;
            const isOpen =
              openSections[label] ??
              (searchType === 'taxonomy' && !isMobile) ??
              true;
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
                    minValue={(query[`${key}_min`] as string) || ''}
                    maxValue={(query[`${key}_max`] as string) || ''}
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
