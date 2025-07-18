import useIsMobile from '@/utils/hooks/useIsMobile';
import { formatFacets } from './utils';
import { allowedFilters } from './config';

import { useFilters } from './useFilters';
import { useGlobalFacets } from './useGlobalFacets';
import FacetSection from './FacetSection';
import CheckboxFacet from './CheckboxFacet';
import RangeFacet from './RangeFacet';
import MaxValueFacet from './MaxValueFacet';
import MinValueFacet from './MinValueFacet';
import Modal from '../Modals/Modal';
import { useState } from 'react';
import Cta from '../atoms/Cta';

const FilterSidebar = ({
  facetDistribution,
  categorySlug,
  isLoading,
}: {
  facetDistribution: any;
  categorySlug: string;
  isLoading: boolean;
}) => {
  const {
    query,
    openSections,
    toggleFilterValue,
    toggleSection,
    resetFilters,
  } = useFilters();

  const globalFacets = useGlobalFacets(categorySlug);
  const formattedFacets = formatFacets(facetDistribution);
  const formattedGlobalFacets = globalFacets ? formatFacets(globalFacets) : {};
  const isMobile = useIsMobile();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const FiltersContent = () => (
    <div className="flex flex-col gap-4 scrollbar-custom pr-4">
      <div className="flex justify-center">
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
      <div className="flex flex-col text-primary">
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
                  // Utiliser les facettes globales pour le slider de prix
                  <RangeFacet
                    values={facet.values}
                    globalValues={formattedGlobalFacets[label]?.values}
                    minValue={query[`${key}_min`] as string | undefined}
                    maxValue={query[`${key}_max`] as string | undefined}
                    onChange={handleValueChange}
                    isLoading={isLoading}
                  />
                )}

                {facet.type === 'maxValueCheckbox' && (
                  <MaxValueFacet
                    values={facet.values}
                    selectedValues={selectedValues}
                    onChange={handleValueChange}
                  />
                )}

                {facet.type === 'minValueCheckbox' && (
                  <MinValueFacet
                    values={facet.values}
                    selectedValues={selectedValues}
                    onChange={handleValueChange}
                  />
                )}
              </FacetSection>
            );
          })}
      </div>
    </div>
  );

  return (
    <>
      {isMobile ? (
        <>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-primary text-white py-3 px-4 rounded-lg mb-4 flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
              />
            </svg>
            Filtrer les produits
          </button>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            size="small"
          >
            <div className="p-6 max-md:h-[100svh] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-primary">Filtres</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <FiltersContent />
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <Cta
                  slug="#"
                  label="Voir ma sélection"
                  handleButtonClick={() => setIsModalOpen(false)}
                  variant="primary"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                  Voir ma sélection
                </Cta>
              </div>
            </div>
          </Modal>
        </>
      ) : (
        <aside className="w-full md:w-[250px] xl:w-[325px] text-primary overflow-visible shrink-0">
          <FiltersContent />
        </aside>
      )}
    </>
  );
};

export default FilterSidebar;
