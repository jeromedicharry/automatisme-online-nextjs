// pages/checkout.tsx
import Layout from '@/components/Layout/Layout';
import type { GetStaticProps } from 'next';
import { useEffect } from 'react';
import AuthModal from '@/components/Auth/AuthModal';
import useAuthModal from '@/hooks/useAuthModal';
import { fetchCommonData } from '@/utils/functions/fetchCommonData';
import { SimpleFooterMenuProps } from '@/components/sections/Footer/SimpleFooterMenu';
import { CategoryMenuProps } from '@/types/Categories';
import { useCartOperations } from '@/hooks/useCartOperations';
import Container from '@/components/container';
import EmptyElement from '@/components/EmptyElement';
import { LargeCartSvg } from '@/components/SVG/Icons';
import CartSummary from '@/components/Cart/CartSummary';
import CheckoutSteps from '@/components/Checkout';
import BlocIntroLarge from '@/components/atoms/BlocIntroLarge';
import { ThemeSettingsProps } from '@/types/CptTypes';

const Caisse = ({
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
  const {
    isModalOpen,
    formStatus,
    setFormStatus,
    openModal,
    closeModal,
    loading,
    user,
  } = useAuthModal();

  const { cart } = useCartOperations();

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
      uri="/panier"
      footerMenu1={footerMenu1}
      footerMenu2={footerMenu2}
      themeSettings={themeSettings}
      categoriesMenu={categoriesMenu}
      totalProducts={totalProducts}
    >
      <AuthModal
        isOpen={isModalOpen}
        onClose={closeModal}
        formStatus={formStatus}
        setFormStatus={setFormStatus}
        isNotClosable={true}
      />
      <BlocIntroLarge title="Finalisez votre commande" isH1 />
      <div className="mb-10 md:mb-16">
        <Container>
          {!cart?.products?.length ? (
            <EmptyElement
              picto={<LargeCartSvg />}
              title="Votre panier est vide"
              subtitle="Ajoutez des produits à votre panier pour passer commande"
              ctaLabel="Voir nos produits"
              ctaSlug="/"
              ctaType="primary"
            />
          ) : (
            <>
              <div className="relative flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-10 xl:gap-16 max-lg:max-w-xl mx-auto mt-6 lg:mt-12">
                {/* Conteneur principal */}
                <div className="flex-1 shrink-1 flex flex-col gap-6 lg:gap-10">
                  <CheckoutSteps />
                </div>

                {/* CartSummary en sticky à droite en desktop */}
                <aside className="w-full lg:min-w-1/4 lg:sticky lg:max-w-[300px] xxl:max-w-[440px] lg:top-20 self-start lg:shrink-1">
                  <CartSummary isCheckout />
                </aside>
              </div>
            </>
          )}
        </Container>
      </div>
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
    revalidate: 36000,
  };
};
