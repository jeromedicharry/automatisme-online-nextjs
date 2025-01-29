import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Cta from '../atoms/Cta';

const REGISTER_USER = gql`
  mutation registerUser(
    $email: String!
    $firstName: String!
    $lastName: String!
  ) {
    registerUser(
      input: {
        username: $email
        email: $email
        firstName: $firstName
        lastName: $lastName
      }
    ) {
      user {
        databaseId
      }
    }
  }
`;

export default function SignUpForm({ setFormStatus, handleCloseModal }) {
  const router = useRouter();
  const [register, { data, loading, error }] = useMutation(REGISTER_USER);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  // Todo gérer la notion de CLIENT ou Professional Customer voir avec ALexandre comment il a géré le role voir à créer une méta

  const wasSignUpSuccessful = Boolean(data?.registerUser?.user?.databaseId);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await register({ variables: formData });
    } catch (err) {
      console.error(err);
    }
  }

  function handleClose() {
    if (router.pathname === '/caisse') {
      router.push('/panier');
    }
    handleCloseModal();
  }

  if (wasSignUpSuccessful) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50">
        <div className="bg-white p-12 rounded-xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-semibold mb-4">Merci !</h2>
          <p>Un lien de confirmation vous a été envoyé par email.</p>
          <Cta
            slug="#"
            label="Fermer"
            handleButtonClick={() => handleClose()}
            variant="primaryHollow"
          >
            Fermer
          </Cta>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center ">
      <div className="relative">
        {/* Bouton de fermeture */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl"
        >
          X
        </button>

        <h2 className="text-2xl font-semibold text-center mb-6">
          Créer un compte
        </h2>

        {/* Formulaire */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              Prénom
            </label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Nom
            </label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            />
          </div>

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
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm">
              {error.message.includes('already registered') ? (
                <>
                  Vous avez déjà un compte !{' '}
                  <button
                    onClick={() => setFormStatus('login')}
                    className="text-blue-500 underline"
                  >
                    Se connecter
                  </button>
                </>
              ) : (
                error.message + 'toto'
              )}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2 text-white bg-secondary rounded-md hover:bg-secondary-dark duration-300"
          >
            Créer mon compte
          </button>
        </form>

        {/* Lien vers connexion */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">Déjà un compte ?</p>
          <Cta
            label="Se connecter"
            slug="#"
            variant="secondary"
            handleButtonClick={() => setFormStatus('login')}
          >
            Me connecter
          </Cta>
        </div>

        {/* Bullet points */}
        <ul className="mt-6 space-y-2 text-sm text-gray-700">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-black rounded-full"></span>
            Des conseils personnalisés pour vos projets
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-black rounded-full"></span>
            Sauvegarder vos envies en un clic
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-black rounded-full"></span>
            Suivez facilement vos commandes
          </li>
        </ul>
      </div>
    </div>
  );
}
