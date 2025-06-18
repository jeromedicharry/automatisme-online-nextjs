import React from 'react';
import BlocIntroSmall from '../atoms/BlocIntroSmall';

const InstallationVAT = () => {
  return (
    <div className="">
      <BlocIntroSmall
        title="TVA réduite à 10% sur les frais d'installation"
        subtitle="Veuillez cocher cette case et nous retourner le formulaire si vous êtes éligible "
      />
      <form action="">
        <label htmlFor="">
          {
            'Je certifie bénéficier de la TVA réduite de 10%, je télécharge ce formulaire et vous le renvoie complété (cette installation concerne une maison d’habitation construite il y a plus de deux ans)'
          }
        </label>
        <input type="checkbox" name="" />
      </form>
    </div>
  );
};

export default InstallationVAT;
