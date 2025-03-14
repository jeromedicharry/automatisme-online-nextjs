import React, { useState } from 'react';
import Cta from '@/components/atoms/Cta';
import { Chevron } from '@/components/SVG/Icons';
import { useMutation } from '@apollo/client';
import { SEND_PASSWORD_RESET_EMAIL } from '@/components/Auth/SendPasswordResetEmailForm';

const SendResetPasswordField = ({ email }: { email: string }) => {
  const [formErrors, setFormErrors] = useState<{
    email?: string | undefined;
    general?: string;
  }>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const [sendResetEmail, { loading }] = useMutation(SEND_PASSWORD_RESET_EMAIL, {
    onCompleted: () => {
      setIsSuccess(true);
    },
    onError: (error) => {
      setFormErrors({
        general:
          error.message || 'Une erreur est survenue. Veuillez réessayer.',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation basique
    const errors: { email?: string; general?: string } = {};
    if (!email) {
      errors.email = "L'adresse email est requise";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "L'adresse email n'est pas valide";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    sendResetEmail({ variables: { email } });
  };

  const handleCancel = () => {
    setIsEditing(false); // Ferme le mode édition
  };

  return (
    <div className="">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-sm leading-general mb-2">Mot de passe</p>
          <p className="text-dark-grey text-sm leading-general">
            {'**********'}
          </p>
        </div>
        <div className="w-fit">
          <button
            onClick={handleEditToggle}
            className="font-bold text-sm leading-general flex gap-1 items-center"
          >
            {'Modifier'}
            <div
              className={`flex items-center justify-center w-3 h-3 text-secondary duration-300 rotate-180 ${isEditing ? 'rotate-90' : ''}`}
            >
              <Chevron />
            </div>
          </button>
        </div>
      </div>

      <form
        className={`mt-2 flex items-start justify-between gap-4 transition-all transform duration-300 ease-out ${isEditing ? 'max-h-[300px]' : 'opacity-0 pointer-events-none max-h-0'}`}
      >
        <div>
          <p>Changer le mot de passe pour le compte de :</p>
          <strong> {email}</strong>
          {loading && (
            <p className="text-lg p-4 border border-primary text-balance mt-5">
              Demande en cours...
            </p>
          )}
          {isSuccess && (
            <p className="text-lg p-4 border border-primary font-medium text-balance mt-5">
              Votre demande de réinitialisation de mot de passe a été envoyée
              avec succès. Vous allez recevoir un email vous invitant à le
              réinitaliser.
            </p>
          )}
          {formErrors?.general && (
            <p className="text-lg p-4 border text-red-500 border-red-500 text-balance mt-5">
              {formErrors.general}
            </p>
          )}
          {formErrors?.email && (
            <p className="text-lg p-4 border text-red-500 border-red-500 text-balance mt-5">
              {formErrors.email}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Cta handleButtonClick={handleSubmit} slug="#" label="Confirmer">
            Confirmer
          </Cta>
          <Cta
            handleButtonClick={handleCancel}
            variant="primaryHollow"
            slug="#"
            label="Annuler"
          >
            Annuler / Fermer
          </Cta>
        </div>
      </form>
    </div>
  );
};

export default SendResetPasswordField;
