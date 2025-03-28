import { useState } from 'react';

export interface Installer {
  title: string;
  acfContent: {
    address: string;
    geolocation: {
      latitude: number;
      longitude: number;
    };
    phone?: string;
    email?: string;
  };
}

interface GeocodingResult {
  lat: number;
  lon: number;
}

// Fonction de calcul de distance (formule de Haversine)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Calcul du barycentre d'une liste de points
function calculateBarycenter(
  points: { lat: number; lon: number }[],
): [number, number] {
  if (points.length === 0) return [46.603354, 1.888334]; // Centre de la France par défaut
  if (points.length === 1) return [points[0].lat, points[0].lon];

  const sumLat = points.reduce((sum, point) => sum + point.lat, 0);
  const sumLon = points.reduce((sum, point) => sum + point.lon, 0);

  return [sumLat / points.length, sumLon / points.length];
}

export const useInstallerSearch = (allInstallers: Installer[]) => {
  const [filteredInstallers, setFilteredInstallers] = useState<
    (Installer & { distance?: number })[]
  >([]);
  const [searchCenter, setSearchCenter] = useState<[number, number] | null>(
    null,
  );
  const [activeInstallerIndex, setActiveInstallerIndex] = useState<
    number | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchInstallers = async (query: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Utiliser l'API de géocodage Nominatim pour obtenir les coordonnées
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query + ', France',
        )}&format=json&limit=1`,
      );
      const data = await response.json();

      if (data && data[0]) {
        const searchLocation: GeocodingResult = {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
        };

        // Calculer la distance pour chaque installateur
        const installersWithDistance = allInstallers.map((installer) => {
          const distanceInKm = calculateDistance(
            searchLocation.lat,
            searchLocation.lon,
            installer.acfContent.geolocation.latitude,
            installer.acfContent.geolocation.longitude,
          );

          return {
            ...installer,
            distance: distanceInKm,
          };
        });

        // Filtrer les installateurs à moins de 50km
        const filtered = installersWithDistance
          .filter((installer) => installer.distance <= 50)
          .sort((a, b) => (a.distance || 0) - (b.distance || 0));

        // Calculer le barycentre des installateurs trouvés
        if (filtered.length > 0) {
          const points = filtered.map((installer) => ({
            lat: installer.acfContent.geolocation.latitude,
            lon: installer.acfContent.geolocation.longitude,
          }));
          const barycenter = calculateBarycenter(points);
          setSearchCenter(barycenter);
        } else {
          // Si aucun installateur trouvé, centrer sur la ville recherchée
          setSearchCenter([searchLocation.lat, searchLocation.lon]);
        }

        setFilteredInstallers(filtered);
      } else {
        setError('Aucun résultat trouvé pour cette recherche');
        setFilteredInstallers([]);
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la recherche');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    filteredInstallers,
    searchCenter,
    isLoading,
    error,
    searchInstallers,
    activeInstallerIndex,
    setActiveInstallerIndex,
  };
};
