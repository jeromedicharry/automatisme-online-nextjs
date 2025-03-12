import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import { GET_USER } from '@/hooks/useAuth';
import React, { useState } from 'react';
import Cta from '../atoms/Cta';
import { AuthFormProps } from '@/types/auth';
import { CheckMedalSvg, Chevron } from '../SVG/Icons';
import { Eye, EyeOff } from 'lucide-react';

const LOG_IN = gql`
  mutation logIn($login: String!, $password: String!) {
    loginWithCookies(input: { login: $login, password: $password }) {
      status
    }
  }
`;

export default function LogInForm({
  setFormStatus,
  handleCloseModal,
  setRegisterType,
}: AuthFormProps) {
  const router = useRouter();
  const [logIn, { loading }] = useMutation(LOG_IN, {
    refetchQueries: [{ query: GET_USER }],
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Nettoyer l'erreur d'email quand l'utilisateur tape
    setFormErrors((prev) => ({
      ...prev,
      email: undefined,
      general: undefined,
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    // Nettoyer l'erreur de mot de passe quand l'utilisateur tape
    setFormErrors((prev) => ({
      ...prev,
      password: undefined,
      general: undefined,
    }));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Réinitialiser les erreurs
    setFormErrors({});

    // Validation côté client
    if (!email) {
      setFormErrors((prev) => ({ ...prev, email: 'Email requis' }));
      return;
    }

    if (!password) {
      setFormErrors((prev) => ({ ...prev, password: 'Mot de passe requis' }));
      return;
    }

    try {
      const result = await logIn({
        variables: { login: email, password },
      });

      if (result.data?.loginWithCookies?.status === 'SUCCESS') {
        // Connexion réussie
        if (handleCloseModal) handleCloseModal();
      }
    } catch (err: any) {
      console.log('Erreur de connexion:', err);

      // Afficher le message d'erreur
      const errorMessage = err.message || '';

      // Gérer les différents types d'erreurs
      if (
        errorMessage.includes('empty_email') ||
        errorMessage.includes('invalid_email') ||
        errorMessage.includes('empty_username') ||
        errorMessage.includes('invalid_username')
      ) {
        setFormErrors((prev) => ({ ...prev, email: 'Email invalide' }));
      } else if (errorMessage.includes('empty_password')) {
        setFormErrors((prev) => ({ ...prev, password: 'Mot de passe requis' }));
      } else if (errorMessage.includes('incorrect_password')) {
        setFormErrors((prev) => ({
          ...prev,
          password: 'Mot de passe incorrect',
        }));
      }
      // Ajouter cette condition pour capturer les erreurs génériques
      else {
        setFormErrors((prev) => ({
          ...prev,
          general:
            'Identifiants invalides. Veuillez vérifier votre email et mot de passe.',
        }));
      }
    }
  }

  function handleClose() {
    if (router.pathname === '/caisse') {
      router.push('/panier');
      return;
    }
    if (router.pathname === '/compte') {
      router.push('/');
      return;
    }
    if (handleCloseModal) handleCloseModal();
  }

  return (
    <div className="flex w-full h-full items-center justify-center relative p-6 md:p-12">
      {/* Bouton de fermeture */}
      <div className="relative flex flex-col justify-center h-full w-full">
        <button
          onClick={handleClose}
          className="absolute top-0 left-0 text-primary hover:text-black text-xl"
          type="button"
        >
          X
        </button>
        <h2 className="text-2xl font-bold text-center mb-6">Se connecter</h2>

        {/* Erreur générale */}
        {formErrors.general && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
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
              placeholder="Adresse email"
              onChange={handleEmailChange}
              className={`mt-1 block w-full border rounded-md ${
                formErrors.email ? 'border-red-500' : ''
              }`}
            />
            {formErrors.email && (
              <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-bold">
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                placeholder="Mot de passe"
                onChange={handlePasswordChange}
                className={`mt-1 block w-full border rounded-md pr-10 ${
                  formErrors?.password ? 'border-red-500' : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-[50%] transform -translate-y-1/2 duration-300 text-breadcrumb-grey hover:text-primary"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {formErrors.password && (
              <p className="text-red-500 text-sm mt-1">{formErrors.password}</p>
            )}
            <button
              type="button"
              onClick={() => setFormStatus('forgot-password')}
              className="text-sm text-blue-link hover:underline leading-general block text-right mt-1 ml-auto"
            >
              Mot de passe oublié ?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-primary duration-300 hover:bg-primary-dark text-white py-2 rounded-md"
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Me connecter'}
          </button>
        </form>

        {/* Lien de création de compte */}
        <div className="text-center mt-10 md:mt-16">
          <p className="text-primary font-bold mb-2">
            Pas de compte ? Créez-en un en quelques clics !
          </p>
          <Cta
            slug="#"
            label="Créer un compte"
            variant="secondary"
            handleButtonClick={(e) => {
              e.preventDefault();
              setRegisterType('customer');
              setFormStatus('register');
            }}
          >
            Créer un compte Automatisme Online
          </Cta>
        </div>

        <ul className="mt-6 space-y-2 text-sm text-primary">
          <li className="flex items-center gap-2">
            <span className="w-6 h-6 flex items-center text-primary">
              <CheckMedalSvg />
            </span>
            Des conseils personnalisés pour vos projets
          </li>
          <li className="flex items-center gap-2">
            <span className="w-6 h-6 flex items-center text-primary">
              <CheckMedalSvg />
            </span>
            Sauvegarder vos envies en un clic
          </li>
          <li className="flex items-center gap-2">
            <span className="w-6 h-6 flex items-center text-primary">
              <CheckMedalSvg />
            </span>
            Suivez facilement vos commandes
          </li>
        </ul>

        <div className="text-center mt-10 md:mt-16">
          <button
            onClick={(e) => {
              e.preventDefault();
              setRegisterType('pro_customer');
              setFormStatus('register');
            }}
            className="flex gap-2 items-center justify-start text-secondary"
          >
            <span className="underline">Je crée un compte professionnel</span>{' '}
            <div className="w-[6px] h-[6px] flex items-center rotate-180">
              <Chevron />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
