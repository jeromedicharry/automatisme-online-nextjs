// Components
import Layout, { DoubleLevelFooterMenuProps } from '@/components/Layout/Layout';
import Container from '@/components/container';
import { useRouter } from 'next/router';
import React from 'react';
import { useEffect } from 'react';
import { useOrderDataLayer } from '@/hooks/useOrderDataLayer';
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
  footerMenu3,
  categoriesMenu,
}: {
  themeSettings: ThemeSettingsProps;
  totalProducts?: number;
  footerMenu1: SimpleFooterMenuProps;
  footerMenu2: SimpleFooterMenuProps;
  footerMenu3?: DoubleLevelFooterMenuProps;
  categoriesMenu?: CategoryMenuProps[];
}) => {
  const router = useRouter();
  const { order_id, payment_status } = router.query;
  const { loading, error, data } = useQuery(GET_ORDER_BY_ID, {
    variables: { id: order_id },
    skip: !order_id,
  });

  const { trackPurchase } = useOrderDataLayer();

  useEffect(() => {
    if (data?.order) {
      // Calculer le total TTC des produits (sans frais de livraison)
      const orderTotalHT = parseFloat(data.order.subtotal);
      const orderTVA = data.order.taxLines?.nodes?.[0]?.taxTotal
        ? parseFloat(data.order.taxLines.nodes[0].taxTotal)
        : 0;
      const orderTotalTTC = orderTotalHT + orderTVA;

      const orderData = {
        id: data.order.orderNumber,
        items: data.order.lineItems.nodes.map((item: any) => {
          // Prix unitaire TTC = Prix total HT / quantité * (1 + taux TVA)
          const itemSubtotalHT = parseFloat(item.subtotal);
          const priceUnitHT = itemSubtotalHT / item.quantity;
          const priceUnitTTC = priceUnitHT * (1 + orderTVA / orderTotalHT);

          return {
            id: item.product?.node?.globalUniqueId || '',
            name: item.product?.node?.name || '',
            quantity: item.quantity,
            price: priceUnitTTC,
            brand: item.product?.node?.productBrands?.nodes?.[0]?.name || '',
            category: item.product?.node?.seo?.breadcrumbs?.[1]?.text || '',
            variant: item.product?.node?.oldProductId || '',
            // Champs additionnels
            item_id: item.product?.node?.globalUniqueId || '',
            item_name: item.product?.node?.name || '',
            item_brand:
              item.product?.node?.productBrands?.nodes?.[0]?.name || '',
            item_category:
              item.product?.node?.seo?.breadcrumbs?.[1]?.text || '',
            item_variant: item.product?.node?.oldProductId || '',
            affiliation:
              item.product?.node?.productBrands?.nodes?.[0]?.name || '',
          };
        }),
        total: orderTotalTTC, // Total TTC des produits uniquement
        tax: parseFloat(data.order.totalTax),
        shipping: parseFloat(data.order.shippingTotal),
        currency: 'EUR',
      };
      trackPurchase(orderData);
    }
  }, [data, trackPurchase]);

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

        <ul className="hidden">
          <li id="ao-gtm-email">{data.order?.customer?.email}</li>
          <li id="ao-gtm-phone">{data.order?.customer?.billing?.phone}</li>
          <li id="ao-gtm-lastname">{data.order?.customer?.lastName}</li>
          <li id="ao-gtm-firstname">{data.order?.customer?.firstName}</li>
          <li id="ao-gtm-street">{data.order?.customer?.billing?.address1}</li>
          <li id="ao-gtm-city">{data.order?.customer?.billing?.city}</li>
          <li id="ao-gtm-zip">{data.order?.customer?.billing?.postcode}</li>
          <li id="ao-gtm-country">{data.order?.customer?.billing?.country}</li>
        </ul>

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
      footerMenu3={footerMenu3}
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
