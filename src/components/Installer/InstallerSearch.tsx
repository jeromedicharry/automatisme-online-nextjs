import React, { useState, useEffect } from 'react';
import { SearchSvg } from '../sections/blocs/BlocFaq';
import useDebounce from '@/hooks/useDebounce';
import LoadingSpinner from '../atoms/LoadingSpinner';
// import LoadingSpinner from '...'; // À compléter avec ton chemin

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
  const [loading, setLoading] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const fetchCities = async () => {
      const trimmedSearch = debouncedSearch.trim();

      if (trimmedSearch.length === 0) {
        setSuggestions([]);
        setInfoMessage('');
        return;
      }

      const isPostalCode = /^\d+$/.test(trimmedSearch);

      if (isPostalCode && trimmedSearch.length < 5) {
        setSuggestions([]);
        setInfoMessage('La recherche par code postal nécessite 5 chiffres');
        return;
      }

      if (!isPostalCode && trimmedSearch.length < 2) {
        setSuggestions([]);
        setInfoMessage('Veuillez taper au moins deux lettres');
        return;
      }

      try {
        setLoading(true);
        let url = isPostalCode
          ? `https://geo.api.gouv.fr/communes?codePostal=${trimmedSearch}&boost=population&limit=5`
          : `https://geo.api.gouv.fr/communes?nom=${trimmedSearch}&boost=population&limit=5`;

        const response = await fetch(url);
        const data = await response.json();
        setSuggestions(data);
        setInfoMessage('');
      } catch (error) {
        console.error('Error fetching cities:', error);
        setSuggestions([]);
        setInfoMessage('');
      } finally {
        setLoading(false);
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

  useEffect(() => {
    const handleClick = () => setShowSuggestions(false);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div onClick={(e) => e.stopPropagation()} className="mb-6 relative">
      <form onSubmit={handleSubmit}>
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
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          {loading ? (
            <div className="p-4 text-center">
              <LoadingSpinner />
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((city) => (
              <button
                key={`${city.nom}-${city.code}`}
                type="button"
                onClick={() => handleCitySelect(city)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex flex-col first:rounded-t-lg last:rounded-b-lg"
              >
                <span className="font-medium">{city.nom}</span>
                <span className="text-sm text-gray-600">
                  {city.codesPostaux.join(', ')}
                </span>
              </button>
            ))
          ) : (
            infoMessage && (
              <div className="p-4 text-gray-500 text-center">{infoMessage}</div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default InstallerSearch;
