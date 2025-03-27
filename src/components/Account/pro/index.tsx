import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_CUSTOMER_PRO_INFO,
  UPDATE_CUSTOMER_PRO_INFO,
  UPGRADE_TO_PRO_CUSTOMER,
} from '@/utils/gql/CUSTOMER_QUERIES';
import useAuth from '@/hooks/useAuth';
import BackToAccountNav from '../BackToAccountNav';
import Cta from '@/components/atoms/Cta';

type ProData = {
  company: string;
  siret: string;
};

const Pro = ({
  setMobileNavClosed,
}: {
  setMobileNavClosed: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { user, loggedIn, isPro } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [upgradeError, setUpgradeError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_CUSTOMER_PRO_INFO, {
    variables: { id: user?.id },
    skip: !loggedIn,
  });

  const [updateProInfo] = useMutation(UPDATE_CUSTOMER_PRO_INFO);
  const [upgradeToProCustomer] = useMutation(UPGRADE_TO_PRO_CUSTOMER);

  const handleSubmit = async (proData: ProData) => {
    if (!user?.id) return;

    try {
      await updateProInfo({
        variables: {
          id: user.id,
          siret: proData.siret,
          company: proData.company,
        },
      });

      await refetch();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating pro info', error);
    }
  };

  const handleUpgradeToPro = async () => {
    if (!user?.databaseId) return;

    try {
      setUpgradeError(null);
      const { data } = await upgradeToProCustomer({
        variables: {
          id: user.databaseId, // Utilisez databaseId directement
        },
      });

      if (data?.upgradeToProCustomer?.success) {
        await refetch();
        // Recharger la page pour mettre à jour le contexte d'authentification
        setSuccessMessage(
          'Votre passage en pro a été réussi nous allons recharger la page dans quelques secondes pour rafraichir vos données.',
        );
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (error: any) {
      console.error('Error upgrading to pro', error);
      setUpgradeError(error.message);
    }
  };

  const hasProInfo = data?.customer?.billing?.company && data?.customer?.siret;

  if (!loggedIn) {
    return (
      <div className="p-4">
        <p>
          Veuillez vous connecter pour accéder à votre espace professionnel.
        </p>
      </div>
    );
  }

  const renderForm = () => (
    <div className="border rounded-lg p-6 bg-white shadow-card">
      <h3 className="text-lg font-semibold mb-4">
        {isPro
          ? 'Modifier vos informations professionnelles'
          : 'Informations professionnelles requises'}
      </h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          handleSubmit({
            company: formData.get('company') as string,
            siret: formData.get('siret') as string,
          });
        }}
      >
        <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="company" className="block mb-1">
              {"Nom de l'entreprise"}
            </label>
            <input
              type="text"
              name="company"
              id="company"
              defaultValue={data?.customer?.billing?.company || ''}
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="siret" className="block mb-1">
              Numéro SIRET
            </label>
            <input
              type="text"
              name="siret"
              id="siret"
              pattern="[0-9]{14}"
              title="Le numéro SIRET doit contenir 14 chiffres"
              defaultValue={data?.customer?.siret || ''}
              required
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 w-fit ml-auto mt-10">
          {isEditing && (
            <Cta
              slug="#"
              handleButtonClick={() => setIsEditing(false)}
              variant="primaryHollow"
              label="Annuler"
            >
              Annuler
            </Cta>
          )}
          <button
            type="submit"
            className="text-base leading-general px-4 py-2 gap-2 bg-primary duration-300 hover:bg-primary-dark text-white min-h-[43px] rounded-[5px] min-w-[170px]"
          >
            {isEditing ? 'Mettre à jour' : 'Enregistrer les informations'}
          </button>
        </div>
      </form>
    </div>
  );

  const renderInfo = () => (
    <div className="border rounded-lg py-4 px-5 mb-4 relative bg-white shadow-card">
      <h3 className="font-semibold mb-4">Informations professionnelles</h3>
      {isPro && (
        <div className="absolute max-sm:bottom-4 sm:top-4 right-5">
          <Cta
            handleButtonClick={() => setIsEditing(true)}
            variant="primary"
            size="small"
            label="Modifier"
            slug="#"
          >
            Modifier
          </Cta>
        </div>
      )}
      <p className="mt-1 font-medium mb-1 underline">Entreprise :</p>
      <p className="mb-2">{data?.customer?.billing?.company}</p>
      <p className="mt-1 font-medium mb-1 underline">N° de SIRET :</p>
      <p>{data?.customer?.siret}</p>

      <div className="space-y-4">
        {!isPro && (
          <div className="border-t pt-4 mt-4">
            <p className="mb-4 text-sm text-gray-600">
              Vos informations professionnelles ont été enregistrées. Vous
              pouvez maintenant faire une demande de passage en compte
              professionnel.
            </p>
            {upgradeError && (
              <p className="mb-4 text-sm text-red-600">{upgradeError}</p>
            )}
            {successMessage && (
              <p className="mb-4 p-4 border border-primary text-sm text-primary">
                {successMessage}
              </p>
            )}
            <div className="flex justify-end space-x-3 w-fit ml-auto">
              <Cta
                slug="#"
                handleButtonClick={() => setIsEditing(true)}
                variant="primaryHollow"
                label="Modifier les informations"
                isFull={false}
                additionalClass="items-start"
              >
                Modifier les informations
              </Cta>

              <Cta
                slug="#"
                handleButtonClick={handleUpgradeToPro}
                variant="primary"
                label="Passer en pro"
                isFull={false}
              >
                Passer en pro
              </Cta>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="md:hidden">
        <BackToAccountNav setMobileNavClosed={setMobileNavClosed} />
      </div>

      <h1 className="text-2xl leading-general font-bold mb-6 md:mb-3 max-md:mt-6">
        Espace Professionnel
      </h1>

      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p>Une erreur est survenue</p>
      ) : isEditing ? (
        renderForm()
      ) : hasProInfo ? (
        renderInfo()
      ) : (
        renderForm()
      )}
    </>
  );
};

export default Pro;
