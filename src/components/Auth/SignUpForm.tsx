import { useMutation, gql } from '@apollo/client';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Cta from '../atoms/Cta';
import { AuthFormProps } from '@/types/auth';
import { CheckMedalSvg } from '../SVG/Icons';
import ToggleSwitch from '../atoms/ToggleSwitch';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

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
  registerType,
  setRegisterType,
}: AuthFormProps) {
  const router = useRouter();
  const [register, { data, error }] = useMutation(REGISTER_USER);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

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

    // Vérifier qu'il contient au moins un caractère spécial
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>-]/;
    if (!specialCharRegex.test(formData.password)) {
      setValidationError(
        'Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*...).',
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
  function handleCloseAfterSuccess() {
    setFormStatus('login');
  }

  if (wasSignUpSuccessful) {
    return (
      <div className="flex h-full w-full items-center justify-center relative p-6 md:p-12">
        <div className="relative flex flex-col justify-center h-full w-full">
          <button
            onClick={handleClose}
            className="absolute top-0 left-0 text-primary hover:text-black text-xl"
          >
            X
          </button>
          <div className="bg-white rounded-xl max-w-md w-full flex flex-col gap-4">
            <h2 className="text-2xl font-semibold mb-4 text-primary text-center">
              Votre inscription a bien été prise en compte !
            </h2>
            <p>Un lien de confirmation vous a été envoyé par email.</p>
            <div className="mb-10">
              <strong className="text-secondary">
                {
                  "Pensez à bien renseigner vos adresses de livraison sur l'onglet 'Gérer mes adresses'."
                }
              </strong>
              {registerType === 'pro_customer' && (
                <strong className=" text-primary block mt-2">
                  {
                    "Pensez à bien renseigner votre SIRET et numéro de TVA dans l'onglet 'Pour les pros'"
                  }
                </strong>
              )}
            </div>
            <Cta
              slug="#"
              label="Fermer"
              handleButtonClick={() => handleCloseAfterSuccess()}
              variant="primaryHollow"
            >
              je me connecte
            </Cta>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center relative p-6 md:p-12">
      <div className="relative flex flex-col justify-center h-full w-full">
        {/* Bouton de fermeture */}
        <button
          onClick={handleClose}
          className="absolute top-0 left-0 text-primary hover:text-black text-xl"
        >
          X
        </button>

        <h2 className="text-2xl font-bold mb-1 text-primary">
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
              className="block text-sm font-medium text-primary"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Adresse email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-primary"
            >
              Mot de passe
            </label>

            <div className="relative">
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full border"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-[50%] transform -translate-y-1/2 duration-300 text-breadcrumb-grey hover:text-primary"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ToggleSwitch
              id="isPro"
              checked={registerType === 'pro_customer'}
              onChange={(checked) =>
                setRegisterType(checked ? 'pro_customer' : 'customer')
              }
              label="Compte pro ?"
            />
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

          <ul className="mt-6 text-xs text-primary">
            <li className="flex items-center gap-2">
              <span className="w-6 h-6 flex items-center text-primary">
                <CheckMedalSvg />
              </span>
              8 caractères minimum
            </li>
            <li className="flex items-center gap-2">
              <span className="w-6 h-6 flex items-center text-primary">
                <CheckMedalSvg />
              </span>
              1 caractère spécial
            </li>
          </ul>

          <div className="mt-8 space-y-1">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="stayLogged"
                className="accent-primary w-5 h-5 rounded-[3px]"
              />
              <label htmlFor="stayLogged">
                <span className=" text-primary">Restez connecté(e)</span>
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="newsletter"
                className="accent-primary w-5 h-5 rounded-[3px]"
              />
              <label htmlFor="newsletter">
                Recevez des{' '}
                <span className=" font-bold">
                  bons conseils et des promotions{' '}
                </span>
              </label>
            </div>
          </div>

          <div>
            <div className="text-xs mb-2">
              {'En cliquant sur ”Créer monte compte”, vous acceptez nos '}
              <Link
                href="/conditions-generales-de-vente"
                className="underline duration-300 hover:text-secondary"
              >
                {'Conditions générales d’utilisation'}
              </Link>
              .
            </div>

            <button
              type="submit"
              className="w-full font-bold min-h-[43px] flex justify-center items-center py-2 text-white bg-secondary hover:bg-secondary-dark duration-300 rounded-lg"
            >
              Créer mon compte {registerType === 'pro_customer' && 'pro'}
            </button>
          </div>
        </form>

        {/* Lien vers connexion */}
        <div className="text-center mt-10 md:mt-16">
          <p className="text-primary font-bold mb-2">
            {"J'ai déjà un compte ?"}
          </p>
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
      </div>
    </div>
  );
}
