// pages/checkout.tsx
import Layout from '@/components/Layout/Layout';
import type { GetStaticProps } from 'next';
import { useEffect } from 'react';
import AuthModal from '@/components/Auth/AuthModal';
import useAuthModal from '@/hooks/useAuthModal';
import { fetchCommonData } from '@/utils/functions/fetchCommonData';
import { SimpleFooterMenuProps } from '@/components/sections/Footer/SimpleFooterMenu';
import { CategoryMenuProps } from '@/types/Categories';

const Caisse = ({
  themeSettings,
  footerMenu1,
  footerMenu2,
  categoriesMenu,
}: {
  themeSettings: any;
  footerMenu1: SimpleFooterMenuProps;
  footerMenu2: SimpleFooterMenuProps;
  categoriesMenu?: CategoryMenuProps[];
}) => {
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
      footerMenu1={footerMenu1}
      footerMenu2={footerMenu2}
      themeSettings={themeSettings}
      categoriesMenu={categoriesMenu}
      isBg
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

export const getStaticProps: GetStaticProps = async () => {
  const commonData = await fetchCommonData();

  return {
    props: {
      ...commonData,
    },
    revalidate: 10000,
  };
};
