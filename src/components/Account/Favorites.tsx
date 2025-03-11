import React from 'react';
// import BreadCrumbs from '../atoms/BreadCrumbs';
import EmptyElement from '../EmptyElement';
import BackToAccountNav from './BackToAccountNav';
import { Heart } from 'lucide-react';

const Favorites = ({
  setMobileNavClosed,
}: {
  setMobileNavClosed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // todo gérer les favoris
  return (
    <>
      <div className="md:hidden">
        <BackToAccountNav setMobileNavClosed={setMobileNavClosed} />
      </div>
      <h1 className="text-2xl leading-general font-bold mb-6 md:mb-3 max-md:mt-6">
        Mes Favoris
      </h1>

      <EmptyElement
        picto={<Heart />}
        title="Votre liste de favoris est vide"
        subtitle="Vous n'avez encore rien ajouté à vos favoris. Ajoutez vos coups de cœur dès maintenant !"
        ctaLabel="Voir les produits"
        ctaSlug="/"
        ctaType="primary"
      />
    </>
  );
};

export default Favorites;
