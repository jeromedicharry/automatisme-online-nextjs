// pages/checkout.tsx
import Layout from '@/components/Layout/Layout';
import type { NextPage } from 'next';
import { useEffect } from 'react';
import AuthModal from '@/components/Auth/AuthModal';
import useAuthModal from '@/hooks/useAuthModal';

const Caisse: NextPage = () => {
  const {
    isModalOpen,
    formStatus,
    setFormStatus,
    openModal,
    closeModal,
    loading,
    user,
  } = useAuthModal();

  // Ouvrir automatiquement la modale si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!loading && !user) {
      openModal('login');
    }
  }, [loading, user, openModal]);

  if (loading) return <div>Loading...</div>;

  return (
    <Layout
      meta={{ title: 'Caisse' }}
      title="Caisse"
      uri="/checkout"
      excludeSeo
    >
      <div>
        <h1 className="text-4xl md:text-5xl font-bold leading-general text-center text-balance">
          Page de caisse
        </h1>
        <pre>{JSON.stringify(user, null, 2)}</pre>

        <AuthModal
          isOpen={isModalOpen}
          onClose={closeModal}
          formStatus={formStatus}
          setFormStatus={setFormStatus}
          isNotClosable={true}
        />
      </div>
      {/* <CheckoutForm /> */}
    </Layout>
  );
};

export default Caisse;
