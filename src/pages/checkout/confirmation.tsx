// Components
import Layout from '@/components/Layout/Layout';
import Container from '@/components/container';
import { useRouter } from 'next/router';
import React from 'react';
import AccountLoader from '@/components/Account/AccountLoader';
import { useQuery } from '@apollo/client';
import { GET_ORDER_BY_ID } from '@/utils/gql/CUSTOMER_QUERIES';
import OrdersList from '@/components/Account/orders/OrdersList';
import EmptyElement from '@/components/EmptyElement';
import { OrderSvg } from '@/components/SVG/Icons';

import { SimpleFooterMenuProps } from '@/components/sections/Footer/SimpleFooterMenu';
import { CategoryMenuProps } from '@/types/Categories';
import { ThemeSettingsProps } from '@/types/CptTypes';
import Cta from '@/components/atoms/Cta';
import type { GetServerSideProps } from 'next';
import { fetchCommonData } from '@/utils/functions/fetchCommonData';

const ConfirmationPage = ({
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
  const router = useRouter();
  const { order_id, payment_status } = router.query;
  const { loading, error, data } = useQuery(GET_ORDER_BY_ID, {
    variables: { id: order_id },
    skip: !order_id,
  });

  const renderContent = () => {

    if (loading) {
      return <AccountLoader text="Chargement de votre commande..." />;
    }

    if (error) {
      const errorMessage = error?.message || 'Erreur inconnue';
      return (
        <EmptyElement
          picto={<OrderSvg />}
          title="Erreur"
          subtitle={`Une erreur est survenue : ${errorMessage}`}
          ctaLabel="Retour à la boutique"
          ctaSlug="/"
          ctaType="primary"
        />
      );
    }

    if (!data?.order) {
      return (
        <EmptyElement
          picto={<OrderSvg />}
          title="Commande introuvable"
          subtitle="Cette commande n'existe pas"
          ctaLabel="Retour à la boutique"
          ctaSlug="/"
          ctaType="primary"
        />
      );
    }

    return (
      <div className="py-8">
        {payment_status === 'success' && (
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-center">
            <p className="text-lg font-medium">Merci pour votre commande !</p>
            <p>
              Votre paiement a été accepté et votre commande est en cours de
              traitement.
            </p>
          </div>
        )}
        <div className="w-fit mx-auto">
          <OrdersList orders={[data.order]} />
        </div>

        <div className="mt-4 md:mt-8 flex justify-center gap-4 max-md:flex-col w-fit mx-auto">
          <Cta label="Voir mes commandes" slug="/" variant="primary">
            Voir mes commandes
          </Cta>
          <Cta
            label="Effectuer une nouvelle commande"
            slug="/"
            variant="secondary"
          >
            Effectuer une nouvelle commande
          </Cta>
        </div>
      </div>
    );
  };

  return (
    <Layout
      meta={{ title: 'Confirmation de commande - Automatisme Online' }}
      footerMenu1={footerMenu1}
      footerMenu2={footerMenu2}
      themeSettings={themeSettings}
      categoriesMenu={categoriesMenu}
      isBg
      excludeSeo
      totalProducts={totalProducts}
    >
      <Container>{renderContent()}</Container>
    </Layout>
  );
};

export default ConfirmationPage;

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { order_id } = query;

  if (!order_id) {
    return {
      notFound: true, // Redirige vers la page 404
    };
  }

  const commonData = await fetchCommonData();

  return {
    props: {
      ...commonData,
    },
  };
};


