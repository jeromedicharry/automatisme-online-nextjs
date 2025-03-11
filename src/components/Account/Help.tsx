import React from 'react';
// import BreadCrumbs from '../atoms/BreadCrumbs';
import BackToAccountNav from './BackToAccountNav';
import HelpCard from './HelpCard';
import { HeadPhonesSvg, HelpSvg, OrderSvg } from '../SVG/Icons';
import { TabType } from './TabLink';

const Help = ({
  setMobileNavClosed,
  setActiveTab,
}: {
  setMobileNavClosed: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
}) => {
  return (
    <>
      <div className="md:hidden">
        <BackToAccountNav setMobileNavClosed={setMobileNavClosed} />
      </div>
      <h1 className="text-2xl leading-general font-bold mb-6 md:mb-3 max-md:mt-6">
        {"Besoin d'aide ?"}
      </h1>
      <div className="flex flex-col gap-6">
        <HelpCard
          title="Mes commandes"
          text="Suivre mes livraisons, retourner ou annuler une commande etc..."
          picto={<OrderSvg />}
          switchTab={() => setActiveTab('orders')} // On passe directement la fonction ici
        />
        <HelpCard
          title="Notre Foire à questions"
          text="Les réponses à vos questions se trouvent ici !"
          picto={<HelpSvg />}
          slug="/questions-les-plus-frequentes"
        />
        <HelpCard
          title="Besoin de l’assistance d’un expert ?"
          text="Contactez nous par mail ou via notre hotline."
          picto={<HeadPhonesSvg />}
          slug="/contact"
        />
      </div>
    </>
  );
};

export default Help;
