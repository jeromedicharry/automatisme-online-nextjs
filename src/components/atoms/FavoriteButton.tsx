import { useFavorites } from '@/hooks/useFavorites';
import { Heart, HeartFilled } from '../SVG/Icons';
import {
  ADD_TO_FAVORITES,
  REMOVE_FROM_FAVORITES,
} from '@/utils/gql/FAVORITES_QUERIES';
import { useMutation } from '@apollo/client';

const FavoriteButton = ({ productId }: { productId: number }) => {
  const { favorites, setFavorites } = useFavorites(); // Accéder aux favoris via le contexte

  const [addToFavorites, { loading: adding }] = useMutation(ADD_TO_FAVORITES, {
    onCompleted: (data) => {
      if (data.addToFavorites.success) {
        setFavorites([...favorites, productId]);
      }
    },
  });

  const [removeFromFavorites, { loading: removing }] = useMutation(
    REMOVE_FROM_FAVORITES,
    {
      onCompleted: (data) => {
        if (data.removeFromFavorites.success) {
          setFavorites(favorites.filter((id) => id !== productId));
        }
      },
    },
  );

  const isFavorite = favorites.includes(productId);
  const isLoading = adding || removing;

  const toggleFavorite = async () => {
    if (isFavorite) {
      await removeFromFavorites({ variables: { productId } });
    } else {
      await addToFavorites({ variables: { productId } });
    }
  };

  return (
    <button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`favorite-button ${isFavorite ? 'is-favorite' : ''}`}
      title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      {isFavorite ? <HeartFilled /> : <Heart />}
    </button>
  );
};

export default FavoriteButton;
