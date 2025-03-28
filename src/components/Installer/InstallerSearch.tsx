import React, { useState, useEffect } from 'react';
import { SearchSvg } from '../sections/blocs/BlocFaq';
import useDebounce from '@/hooks/useDebounce';

interface City {
  nom: string;
  code: string;
  codesPostaux: string[];
}

interface InstallerSearchProps {
  onSearch: (query: string) => void;
}

const InstallerSearch = ({ onSearch }: InstallerSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const fetchCities = async () => {
      if (debouncedSearch.length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `https://geo.api.gouv.fr/communes?nom=${debouncedSearch}&boost=population&limit=5`,
        );
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error('Error fetching cities:', error);
        setSuggestions([]);
      }
    };

    fetchCities();
  }, [debouncedSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    setShowSuggestions(false);
  };

  const handleCitySelect = (city: City) => {
    const cityWithPostalCode = `${city.nom} (${city.codesPostaux[0]})`;
    setSearchQuery(cityWithPostalCode);
    onSearch(cityWithPostalCode);
    setShowSuggestions(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 relative">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Entrez votre ville ou code postal"
          className="w-full h-12 border border-primary rounded-full pl-4 pr-12 placeholder:text-placeholder-grey"
        />
        <button
          type="submit"
          className="absolute right-1 top-1 text-white w-10 h-10 flex items-center justify-center bg-secondary hover:bg-secondary-dark rounded-full duration-300"
        >
          <SearchSvg />
        </button>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          {suggestions.map((city) => (
            <button
              key={`${city.nom}-${city.code}`}
              type="button"
              onClick={() => handleCitySelect(city)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 flex flex-col"
            >
              <span className="font-medium">{city.nom}</span>
              <span className="text-sm text-gray-600">
                {city.codesPostaux[0]}
              </span>
            </button>
          ))}
        </div>
      )}
    </form>
  );
};

export default InstallerSearch;
