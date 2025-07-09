import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  GET_CUSTOMER_PRO_INFO,
  UPDATE_CUSTOMER_PRO_INFO,
} from '@/utils/gql/CUSTOMER_QUERIES';
import useAuth from '@/hooks/useAuth';
import Cta from '@/components/atoms/Cta';
import BlocIntroSmall from '../atoms/BlocIntroSmall';

type ProData = {
  company: string;
  siret: string;
};

const CheckoutProInfos = ({
  setIsProInfosComplete,
}: {
  setIsProInfosComplete: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { user, loggedIn, isPro } = useAuth();

  const [isEditing, setIsEditing] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_CUSTOMER_PRO_INFO, {
    variables: { id: user?.id },
    skip: !loggedIn,
  });

  const [updateProInfo] = useMutation(UPDATE_CUSTOMER_PRO_INFO);

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

  const hasProInfo = data?.customer?.billing?.company && data?.customer?.siret;

  useEffect(() => {
    // Les infos pro sont complètes si :
    // - L'utilisateur n'est pas pro (pas besoin d'infos)
    // - OU si l'utilisateur est pro ET a rempli ses infos
    setIsProInfosComplete(!isPro || hasProInfo);
  }, [isPro, hasProInfo, setIsProInfosComplete]);

  if (!isPro) return null;

  const renderForm = () => (
    <div className="border rounded-lg p-6 bg-white shadow-card">
      <h3 className="text-lg font-semibold mb-4">
        Informations professionnelles requises
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

        <div className="flex justify-between gap-4 mt-10 w-fit ml-auto">
          <Cta
            handleButtonClick={() => setIsEditing(false)}
            variant="primaryHollow"
            label="Annuler"
            slug="#"
          >
            Annuler
          </Cta>
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
      <p className="mt-1 font-medium mb-1 underline">Entreprise :</p>
      <p className="mb-2">{data?.customer?.billing?.company}</p>
      <p className="mt-1 font-medium mb-1 underline">N° de SIRET :</p>
      <p>{data?.customer?.siret}</p>
    </div>
  );

  return (
    <section className="mt-8 md:mt-6">
      <BlocIntroSmall
        title="Informations Professionnelles"
        subtitle="En tant que professionnel, vos informations (SIRET etc..) sont obligatoires pour le traitement de vos commandes."
      />

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
    </section>
  );
};

export default CheckoutProInfos;
