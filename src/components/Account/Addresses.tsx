import React from 'react';
// import BreadCrumbs from '../atoms/BreadCrumbs';
import EmptyElement from '../EmptyElement';
import BackToAccountNav from './BackToAccountNav';
import { HouseSvg } from '../SVG/Icons';

const Addresses = ({
  setMobileNavClosed,
}: {
  setMobileNavClosed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // todo gérer l'ajout d'une adresse à la volée
  return (
    <>
      <div className="md:hidden">
        <BackToAccountNav setMobileNavClosed={setMobileNavClosed} />
      </div>
      <h1 className="text-2xl leading-general font-bold mb-6 md:mb-3 max-md:mt-6">
        Mes adresses
      </h1>

      <EmptyElement
        picto={<HouseSvg />}
        title="Aucune adresse enregistrée pour l'instant"
        subtitle="Ajoutez une adresse postale pour faciliter vos prochaines commandes."
        ctaLabel="Ajouter une adresse"
        ctaSlug="/"
        ctaType="primary"
      />
    </>
  );
};

export default Addresses;
