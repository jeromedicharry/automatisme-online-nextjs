import React from 'react';
// import BreadCrumbs from '../atoms/BreadCrumbs';
import BackToAccountNav from './BackToAccountNav';

const Profile = ({
  setMobileNavClosed,
}: {
  setMobileNavClosed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // todo gérer la mise à jour des infos à la volée
  return (
    <>
      <div className="md:hidden">
        <BackToAccountNav setMobileNavClosed={setMobileNavClosed} />
      </div>
      <h1 className="text-2xl leading-general font-bold mb-6 md:mb-3 max-md:mt-6">
        Profil
      </h1>
      <div className="shadow-card p-6 rounded-[7px] bg-white">
        <h2 className="font-medium text-xl leading-general mb-6">
          Informations du compte
        </h2>
      </div>
    </>
  );
};

export default Profile;
