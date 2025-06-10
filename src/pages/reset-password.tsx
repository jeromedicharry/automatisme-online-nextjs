import Layout from '@/components/Layout/Layout';
import Container from '@/components/container';
import { fetchCommonData } from '@/utils/functions/fetchCommonData';
import { SimpleFooterMenuProps } from '@/components/sections/Footer/SimpleFooterMenu';
import { CategoryMenuProps } from '@/types/Categories';
import { ThemeSettingsProps } from '@/types/CptTypes';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Cta from '@/components/atoms/Cta';
import { Eye, EyeOff } from 'lucide-react';

const PasswordReset = ({
  themeSettings,
  totalProducts,
  footerMenu1,
  footerMenu2,
  categoriesMenu,
}: {
  themeSettings: ThemeSettingsProps;
  totalProducts?: number;
  footerMenu1: SimpleFooterMenuProps;
  footerMenu2: SimpleFooterMenuProps;
  categoriesMenu?: CategoryMenuProps[];
}) => {
  const { query, isReady } = useRouter();
  const { key, login } = query;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!isReady) return;

    if (typeof key !== 'string' || typeof login !== 'string') {
      setError('Lien de réinitialisation invalide.');
    }
  }, [isReady, key, login]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Réinitialiser les messages
    setError('');
    setMessage('');

    // Vérifications
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>-]/;
    if (!specialCharRegex.test(password)) {
      setError(
        'Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*...).',
      );
      return;
    }

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, login, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Une erreur est survenue.');
      } else {
        setMessage(
          'Votre mot de passe a bien été réinitialisé. Vous pouvez maintenant vous connecter.',
        );
      }
    } catch (err) {
      setError(`Erreur réseau: ${err} Veuillez réessayer.`);
    }
  };

  return (
    <Layout
      meta={{ title: 'Modifiez votre mot de passe' }}
      uri={'/password-reset'}
      footerMenu1={footerMenu1}
      footerMenu2={footerMenu2}
      themeSettings={themeSettings}
      categoriesMenu={categoriesMenu}
      isBg
      excludeSeo
      totalProducts={totalProducts}
    >
      <Container>
        <div className="md:max-w-[700px] mx-auto">
          <div className="mt-10 relative z-0 overflow-hidden bg-primary-light-alt rounded-2xl p-4 md:p-8 lg:p-16">
            <div className="flex gap-4 items-center mb-4 max-md:justify-center md:mb-10">
              <div className="w-6 md:w-10">🔐</div>
              <h1 className="text-lg md:text-2xl font-bold">
                Réinitialisation du mot de passe
              </h1>
            </div>

            {error && <p className="text-red-600 mb-4">{error}</p>}
            {message && (
              <p className="text-green-600 mb-10 p-6 border border-green-600 text-balance mx-auto text-center">
                {message}
              </p>
            )}

            {!message ? (
              <form onSubmit={handleSubmit} className="space-y-3 contact">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nouveau mot de passe *"
                    className="py-2 px-4 border rounded-sm bg-white w-full placeholder:text-placeholder-grey"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label="Afficher le mot de passe"
                    tabIndex={-1} // Exclut de la navigation au clavier
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirmez le mot de passe *"
                    className="py-2 px-4 border rounded-sm bg-white w-full placeholder:text-placeholder-grey"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label="Afficher le mot de passe"
                    tabIndex={-1} // Exclut de la navigation au clavier
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-secondary py-2 px-4 rounded-sm text-white text-sm font-bold"
                  >
                    Réinitialiser le mot de passe
                  </button>
                </div>
              </form>
            ) : (
              <Cta
                slug="/compte"
                label="Me connecter à mon compte"
                size="default"
                variant="primary"
              >
                Je me connecte
              </Cta>
            )}
          </div>
        </div>
      </Container>
    </Layout>
  );
};

export default PasswordReset;

import type { GetStaticProps } from 'next';
export const getStaticProps: GetStaticProps = async () => {
  const commonData = await fetchCommonData();

  return {
    props: {
      ...commonData,
    },
    revalidate: 36000,
  };
};
