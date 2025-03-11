import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Cta from '../atoms/Cta';
import { AuthFormProps } from '@/types/auth';
import { CheckMedalSvg } from '../SVG/Icons';

const REGISTER_USER = gql`
  mutation registerUser(
    $username: String!
    $email: String!
    $password: String!
    $registerType: String!
  ) {
    registerUser(
      input: {
        username: $username
        email: $email
        password: $password
        registerType: $registerType
      }
    ) {
      user {
        databaseId
      }
    }
  }
`;

export default function SignUpForm({
  setFormStatus,
  handleCloseModal,
}: AuthFormProps) {
  const router = useRouter();
  const [register, { data, error }] = useMutation(REGISTER_USER);
  const [registerType, setRegisterType] = useState('customer');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [validationError, setValidationError] = useState('');

  const wasSignUpSuccessful = Boolean(data?.registerUser?.user?.databaseId);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Effacer le message d'erreur quand l'utilisateur modifie des champs
    if (validationError) {
      setValidationError('');
    }
  }

  // Fonction pour générer un nom d'utilisateur à partir de l'email
  function generateUsername(email: string): string {
    // Vérifier si l'email contient un @
    if (!email.includes('@')) {
      // Si pas de @, utiliser l'email entier comme base
      return `${email}${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0')}`;
    }

    // Extraire la partie avant le @
    const localPart = email.split('@')[0];

    // S'assurer que la partie locale n'est pas vide
    if (localPart.length === 0) {
      // Générer un nom d'utilisateur par défaut si la partie locale est vide
      return `user${Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, '0')}`;
    }

    // Générer un nombre aléatoire entre 0 et 999
    const randomNum = Math.floor(Math.random() * 1000);

    // Formater le nombre avec des zéros devant si nécessaire (000-999)
    const formattedNum = randomNum.toString().padStart(3, '0');

    // Retourner la combinaison
    return `${localPart}${formattedNum}`;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Réinitialiser l'erreur de validation
    setValidationError('');

    // Vérifier que l'email est valide
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setValidationError('Veuillez entrer une adresse email valide.');
      return;
    }

    // Vérifier que le mot de passe a une longueur minimale
    if (formData.password.length < 8) {
      setValidationError(
        'Le mot de passe doit contenir au moins 8 caractères.',
      );
      return;
    }

    try {
      // Générer le username à partir de l'email
      const username = generateUsername(formData.email);

      // Soumettre le formulaire avec le username généré et le registerType venant du state
      await register({
        variables: {
          username,
          email: formData.email,
          password: formData.password,
          registerType: registerType,
        },
      });
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
        <div className="bg-white p-12 rounded-xl shadow-card max-w-md w-full text-center">
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
    <div className="flex h-full items-center justify-center relative p-6 md:p-12">
      <div className="relative flex flex-col justify-center h-full">
        {/* Bouton de fermeture */}
        <button
          onClick={handleClose}
          className="absolute top-0 left-0 text-gray-500 hover:text-black text-xl"
        >
          X
        </button>

        <h2 className="text-2xl font-semibold mb-1 text-primary">
          Vous êtes nouveau ?!
        </h2>
        <strong className="text-secondary font-bold mb-6">
          Bienvenue ! Maintenant faisons connaissance !
        </strong>

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
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            />
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="isPro"
              type="checkbox"
              name="isPro"
              checked={registerType === 'pro_customer'}
              onChange={(e) =>
                setRegisterType(e.target.checked ? 'pro_customer' : 'customer')
              }
              className=""
            />
            <label
              htmlFor="isPro"
              className="block text-sm font-medium text-gray-700"
            >
              Compte pro ?
            </label>
          </div>

          {/* Affichage des erreurs de validation du formulaire */}
          {validationError && (
            <div className="text-red-500 text-sm">{validationError}</div>
          )}

          {/* Affichage des erreurs retournées par l'API */}
          {error && (
            <div className="text-red-500 text-sm">
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
                <div dangerouslySetInnerHTML={{ __html: error.message }} />
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 text-white bg-secondary rounded-md hover:bg-secondary-dark duration-300"
          >
            Créer mon compte {registerType === 'pro_customer' && 'pro'}
          </button>
        </form>

        {/* Lien vers connexion */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">Déjà un compte ?</p>
          <Cta
            label="Se connecter"
            slug="#"
            variant="secondaryHollow"
            isFull
            handleButtonClick={() => setFormStatus('login')}
          >
            Me connecter
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
