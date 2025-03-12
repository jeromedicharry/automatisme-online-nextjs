import React from 'react';
// import BreadCrumbs from '../atoms/BreadCrumbs';
import BackToAccountNav from './BackToAccountNav';
import useAuth from '@/hooks/useAuth';

const Profile = ({
  setMobileNavClosed,
}: {
  setMobileNavClosed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // todo gérer la mise à jour des infos à la volée
  const { user } = useAuth();

  console.log({ user });

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
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
    </>
  );
};

export default Profile;
