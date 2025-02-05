import React from 'react';
import BlocIntroLarge from '../atoms/BlocIntroLarge';
import Cta from '../atoms/Cta';

const EmptyCart = () => {
  return (
    <section className="p-8 lg:p-20 bg-white flex flex-col gap-10">
      <BlocIntroLarge
        title="Votre panier est vide"
        subtitle="Aucun produit dans votre panier."
      />
      <Cta
        label="Retour à l'accueil"
        slug="/"
        size="default"
        variant="secondary"
        isFull={false}
      >
        {"Retourner à l'accueil"}
      </Cta>
    </section>
  );
};

export default EmptyCart;
