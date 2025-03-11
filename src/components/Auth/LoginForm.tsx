import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import { GET_USER } from '@/hooks/useAuth';
import React, { useState } from 'react';
import Cta from '../atoms/Cta';
import { AuthFormProps } from '@/types/auth';
import { CheckMedalSvg } from '../SVG/Icons';

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
}: AuthFormProps) {
  const router = useRouter();
  const [logIn, { loading, error }] = useMutation(LOG_IN, {
    refetchQueries: [{ query: GET_USER }],
  });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const errorMessage = error?.message || '';
  const isEmailValid =
    !errorMessage.includes('empty_email') &&
    !errorMessage.includes('empty_username') &&
    !errorMessage.includes('invalid_email') &&
    !errorMessage.includes('invalid_username');
  const isPasswordValid =
    !errorMessage.includes('empty_password') &&
    !errorMessage.includes('incorrect_password');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await logIn({ variables: { login: email, password } });
      // router.push('/');
    } catch (err) {
      console.error(err);
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
    handleCloseModal();
  }

  return (
    <div className="flex h-full items-center justify-center relative p-6 md:px-12">
      {/* Bouton de fermeture */}
      <div className="relative flex flex-col justify-center h-full">
        <button
          onClick={handleClose}
          className="absolute top-0 left-0 text-gray-500 hover:text-black text-xl"
        >
          X
        </button>
        <h2 className="text-2xl font-semibold text-center mb-6">
          Se connecter
        </h2>

        {/* Formulaire */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            />
            {!isEmailValid && (
              <p className="text-red-500 text-sm mt-1">Email invalide.</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            />
            {!isPasswordValid && (
              <p className="text-red-500 text-sm mt-1">
                Mot de passe incorrect.
              </p>
            )}
            <button
              type="button"
              onClick={() => setFormStatus('reset')}
              className="text-sm text-blue-link hover:underline leading-general block text-right mt-1 ml-auto"
            >
              Mot de passe oublié ?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white py-2 rounded-md"
            disabled={loading || !isEmailValid || !isPasswordValid}
          >
            Me connecter
          </button>
        </form>

        {/* Lien de création de compte */}
        <div className="text-center mt-10">
          <p className="text-primary font-bold mb-2">
            Pas de compte ? Créez-en un en quelques clics !
          </p>
          <Cta
            slug="#"
            label="Créer un compte"
            variant="secondary"
            handleButtonClick={(e) => {
              e.preventDefault();
              setFormStatus('register');
            }}
          >
            Créer un compte Automatisme Online
          </Cta>
        </div>

        <ul className="mt-6 space-y-2 text-sm text-gray-700">
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
      </div>
    </div>
  );
}
