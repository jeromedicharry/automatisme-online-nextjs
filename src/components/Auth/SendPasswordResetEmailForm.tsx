import React, { useState, Dispatch, SetStateAction } from 'react';
import { useMutation, gql } from '@apollo/client';
import { FormStatusProps } from '@/hooks/useAuthModal';
import { ArrowLeft } from 'lucide-react';

export const SEND_PASSWORD_RESET_EMAIL = gql`
  mutation SendPasswordResetEmail($email: String!) {
    sendPasswordResetEmail(input: { username: $email }) {
      user {
        id
        email
      }
      success
      errors {
        message
      }
    }
  }
`;

interface SendPasswordResetEmailFormProps {
  setFormStatus: Dispatch<SetStateAction<FormStatusProps>>;
  handleCloseModal: () => void;
}

const SendPasswordResetEmailForm: React.FC<SendPasswordResetEmailFormProps> = ({
  setFormStatus,
  handleCloseModal,
}) => {
  const [email, setEmail] = useState('');
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    general?: string;
  }>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const [sendResetEmail, { loading }] = useMutation(SEND_PASSWORD_RESET_EMAIL, {
    onCompleted: (data) => {
      if (data.sendPasswordResetEmail.success) {
        setIsSuccess(true);
        setEmail('');
      } else {
        setFormErrors({
          general:
            data.sendPasswordResetEmail.errors?.message ||
            'Aucun compte trouvé avec cette adresse email.',
        });
      }
    },
    onError: (error) => {
      console.log(error);
      setFormErrors({
        general: 'Veuillez entrer une adresse email valide.',
      });
    },
  });

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Réinitialiser les erreurs lors de la saisie
    if (formErrors.email) {
      setFormErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

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

  const handleClose = () => {
    handleCloseModal();
  };

  return (
    <div className="flex w-full h-full items-center justify-center relative p-6 md:p-12">
      <div className="relative flex flex-col justify-center h-full w-full">
        {/* Bouton de fermeture */}
        <button
          onClick={handleClose}
          className="absolute top-0 left-0 text-primary hover:text-black text-xl"
          type="button"
        >
          X
        </button>

        <h2 className="text-2xl font-bold text-center text-primary mb-6">
          Mot de passe oublié
        </h2>

        {isSuccess ? (
          <div className="text-center space-y-4">
            <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded">
              Un email de réinitialisation a été envoyé à votre adresse email.
            </div>
            <p className="text-sm mt-4">
              Veuillez consulter votre boîte de réception et suivre les
              instructions pour réinitialiser votre mot de passe.
            </p>
            <button
              onClick={() => setFormStatus('login')}
              className="mt-4 w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-md"
            >
              Retour à la connexion
            </button>
          </div>
        ) : (
          <>
            <p className="text-sm text-secondary font-bold mb-6">
              Entrez votre adresse email et nous vous enverrons un lien pour
              réinitialiser votre mot de passe.
            </p>

            {/* Erreur générale */}
            {formErrors.general && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
                {formErrors.general}
              </div>
            )}

            {/* Formulaire */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-bold">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  placeholder="Votre adresse email"
                  onChange={handleEmailChange}
                  className={`mt-1 block w-full border rounded-md p-2 ${
                    formErrors.email ? 'border-red-500' : ''
                  }`}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {formErrors.email}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-md"
                disabled={loading}
              >
                {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
              </button>

              <button
                type="button"
                onClick={() => setFormStatus('login')}
                className="w-full flex items-center justify-center gap-2 text-primary hover:underline py-2"
              >
                <ArrowLeft size={16} />
                Retour à la connexion
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default SendPasswordResetEmailForm;
