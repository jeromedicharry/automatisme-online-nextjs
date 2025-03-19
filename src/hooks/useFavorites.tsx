import React, { createContext, useContext, useEffect, useState } from 'react';
import { ApolloError, useQuery } from '@apollo/client';
import { GET_FAVORITE_IDS } from '@/utils/gql/FAVORITES_QUERIES';
import useAuth from './useAuth';

// Définition du type des favoris
interface FavoriteItem {
  databaseId: number;
}

interface FavoritesContextProps {
  favorites: number[]; // Un tableau contenant les `databaseId`
  setFavorites: (favorites: number[]) => void;
  loading: boolean;
  error: ApolloError | undefined;
  loggedIn: boolean;
}

const DEFAULT_STATE: FavoritesContextProps = {
  setFavorites: () => {},
  favorites: [],
  loading: false,
  loggedIn: false,
  error: undefined,
};

const FavoritesContext = createContext<FavoritesContextProps>(DEFAULT_STATE);

export const FavoritesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { loggedIn } = useAuth(); // l'état de connexion
  const [favorites, setFavorites] = useState<number[]>([]);

  // Ne lance la requête que si l'utilisateur est connecté
  const { data, loading, error } = useQuery<{ favorites: FavoriteItem[] }>(
    GET_FAVORITE_IDS,
    {
      skip: !loggedIn, // ⬅️ Empêche l'exécution de la requête
    },
  );

  useEffect(() => {
    if (data) {
      setFavorites(data.favorites.map((fav) => fav.databaseId));
    }
  }, [data]);

  return (
    <FavoritesContext.Provider
      value={{ favorites, setFavorites, loading, error, loggedIn }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
