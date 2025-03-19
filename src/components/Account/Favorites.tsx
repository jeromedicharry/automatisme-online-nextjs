import React, { useCallback, useEffect, useState } from 'react';
import { Heart } from '../SVG/Icons';
import { useFavorites } from '@/hooks/useFavorites';
import { useQuery } from '@apollo/client';
import { GET_FAVORITES } from '@/utils/gql/FAVORITES_QUERIES';
import EmptyElement from '../EmptyElement';
import BackToAccountNav from './BackToAccountNav';
import Cardproduct from '../cards/CardProduct';
import Container from '../container';

const Favorites = ({
  setMobileNavClosed,
}: {
  setMobileNavClosed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { favorites } = useFavorites();
  const [favoriteProducts, setFavoriteProducts] = useState<any[]>([]);

  // Exécute la requête GraphQL pour récupérer les favoris
  const { data, loading, error, refetch } = useQuery(GET_FAVORITES);

  // Mise à jour des produits favoris à partir de la réponse de la requête GraphQL
  useEffect(() => {
    if (data) {
      setFavoriteProducts(data.favorites); // Mise à jour de l'état avec les produits favoris
    }
  }, [data]);

  /// Fonction stable pour rafraîchir les favoris
  const refreshFavorites = useCallback(async () => {
    await refetch(); // Rafraîchit les données après une mutation
  }, [refetch]); // La fonction change seulement si `refetch` change

  useEffect(() => {
    if (favorites?.length) {
      refreshFavorites(); // Rafraîchit dès qu'on a des favoris
    }
  }, [favorites, refreshFavorites]); // Ajout de refreshFavorites dans les dépendances

  return (
    <>
      <div className="md:hidden">
        <BackToAccountNav setMobileNavClosed={setMobileNavClosed} />
      </div>
      <h1 className="text-2xl leading-general font-bold mb-6 md:mb-3 max-md:mt-6 max-md:text-center">
        Mes Favoris
      </h1>

      {loading && (
        <p className="max-md:text-center my-6 text-xl lg:text-2xl">
          Chargement des produits favoris...
        </p>
      )}

      {error && (
        <p className="text-red-500 p-6 border border-red-500 max-md:text-center w-fit mx-auto mb-6">
          {
            "Une erreur s'est produite lors de la chargement de vos produits favoris."
          }
        </p>
      )}

      {favorites?.length === 0 && (
        <EmptyElement
          picto={<Heart />}
          title="Votre liste de favoris est vide"
          subtitle="Vous n'avez encore rien ajouté à vos favoris. Ajoutez vos coups de cœur dès maintenant !"
          ctaLabel="Voir les produits"
          ctaSlug="/"
          ctaType="primary"
        />
      )}

      {favoriteProducts.length > 0 && (
        <div className="flex flex-wrap justify-start max-md:justify-center  lg:grid lg:grid-cols-3 gap-6">
          {favoriteProducts.map((product: any) => (
            <div key={product.databaseId} className="lg:w-full">
              <Cardproduct product={product} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Favorites;
