import React from 'react';
// import BreadCrumbs from '../atoms/BreadCrumbs';
import EmptyElement from '../EmptyElement';
import { OrderSvg } from '../SVG/Icons';
import BackToAccountNav from './BackToAccountNav';

const Orders = ({
  setMobileNavClosed,
}: {
  setMobileNavClosed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // todo gérer les commandes
  return (
    <>
      <div className="md:hidden">
        {/* <BreadCrumbs
          breadCrumbs={[
            { text: 'Compte', url: '/compte' },
            { text: 'Mes commandes' },
          ]}
        /> */}
        <BackToAccountNav setMobileNavClosed={setMobileNavClosed} />
      </div>
      <h1 className="text-2xl leading-general font-bold mb-6 md:mb-3 max-md:mt-6">
        Mes commandes
      </h1>

      <EmptyElement
        picto={<OrderSvg />}
        title="Oups, rien à afficher ici..."
        subtitle="Faites votre premier achat et vos commandes apparaîtront ici."
        ctaLabel="Je découvre les produits"
        ctaSlug="/"
        ctaType="primary"
      />
    </>
  );
};

export default Orders;
