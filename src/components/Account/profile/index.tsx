import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import BackToAccountNav from '../BackToAccountNav';
import useAuth from '@/hooks/useAuth';
import { UPDATE_USER_EMAIL } from '@/utils/gql/CUSTOMER_QUERIES';
import EditableField from './EditableField';

const Profile = ({
  setMobileNavClosed,
}: {
  setMobileNavClosed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { user } = useAuth();
  const [updateEmail] = useMutation(UPDATE_USER_EMAIL);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleEmailSubmit = async (newEmail: string) => {
    if (newEmail !== user?.email) {
      try {
        await updateEmail({
          variables: { id: user?.id, email: newEmail },
        });
        setErrorMessage(null); // Réinitialise l'erreur si la mutation est réussie
      } catch (error) {
        setErrorMessage(error);
      }
    }
  };

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

        {/* Affichage de l'erreur si elle existe */}
        {errorMessage && (
          <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
        )}

        {/* Utilisation du composant EditableField pour l'email */}
        <EditableField
          label="Email"
          value={user?.email || ''}
          onSubmit={handleEmailSubmit}
        />
      </div>
    </>
  );
};

export default Profile;
