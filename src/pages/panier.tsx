// Components
import Layout, { DoubleLevelFooterMenuProps } from '@/components/Layout/Layout';
import CartContents from '@/components/Cart/CartContents';
import CartSummary from '@/components/Cart/CartSummary';
import DeliveryChoices from '@/components/Cart/DeliveryChoices';
import Container from '@/components/container';
import EmptyElement from '@/components/EmptyElement';
import { LargeCartSvg } from '@/components/SVG/Icons';

// Hooks
import { useCartOperations } from '@/hooks/useCartOperations';
import { useEffect, useState } from 'react';

// Types
import type { GetStaticProps } from 'next';
import { SimpleFooterMenuProps } from '@/components/sections/Footer/SimpleFooterMenu';
import { CategoryMenuProps } from '@/types/Categories';
import { fetchCommonData } from '@/utils/functions/fetchCommonData';
import { ThemeSettingsProps } from '@/types/CptTypes';
import { GET_CROSSSELL_PRODUCT_SIDE_DATA } from '@/utils/gql/WOOCOMMERCE_QUERIES';
import client from '@/utils/apollo/ApolloClient';
import { CardProductProps } from '@/types/blocTypes';
import BlocFeaturedProducts from '@/components/sections/blocs/BlocFeaturedProducts';
import InstallationVAT from '@/components/Cart/InstallationVAT';
import { GET_REDUCED_TVA_FORM } from '@/utils/gql/WEBSITE_QUERIES';

const Panier = ({
  themeSettings,
  totalProducts,
  footerMenu1,
  footerMenu2,
  footerMenu3,
  categoriesMenu,
  poseReducedTvForm,
}: {
  themeSettings: ThemeSettingsProps;
  totalProducts?: number;
  footerMenu1: SimpleFooterMenuProps;
  footerMenu2: SimpleFooterMenuProps;
  footerMenu3?: DoubleLevelFooterMenuProps;
  categoriesMenu?: CategoryMenuProps[];
  poseReducedTvForm: string;
}) => {
  const { cart } = useCartOperations();
  const [crossSellProducts, setCrossSellProducts] = useState<
    CardProductProps[]
  >([]);
  const [showInstallationVAT, setShowInstallationVAT] = useState(false);

  useEffect(() => {
    const fetchCrossSellProducts = async () => {
      if (!cart?.products?.length) return;

      // Récupérer les cross-sells pour chaque produit du panier
      const crossSellPromises = cart.products.map((product) =>
        client.query({
          query: GET_CROSSSELL_PRODUCT_SIDE_DATA,
          variables: {
            id: product.productId,
            idType: 'DATABASE_ID',
          },
        }),
      );

      try {
        const results = await Promise.all(crossSellPromises);

        // Extraire tous les produits cross-sell
        const allCrossSells = results
          .flatMap((result) => result.data.product?.crossSell?.nodes || [])
          .filter(Boolean);

        // Éliminer les doublons en utilisant le databaseId
        const uniqueCrossSells = allCrossSells.reduce(
          (acc: CardProductProps[], current: CardProductProps) => {
            const exists = acc.find(
              (item) => item.databaseId === current.databaseId,
            );
            if (!exists) {
              acc.push(current);
            }
            return acc;
          },
          [],
        );

        // Exclure les produits qui sont déjà dans le panier et limiter à 6 produits
        const cartProductIds = cart.products.map((p) => p.productId);
        const filteredCrossSells = uniqueCrossSells
          .filter(
            (product: CardProductProps) =>
              product.databaseId &&
              !cartProductIds.includes(product.databaseId),
          )
          .slice(0, 6);

        setCrossSellProducts(filteredCrossSells);
      } catch (error) {
        console.error('Erreur lors de la récupération des cross-sells:', error);
        setCrossSellProducts([]);
      }
    };

    fetchCrossSellProducts();
    const isPoseVAT =
      cart?.products?.some(
        (product) => product.installationPrice && product.installationPrice > 0,
      ) || false;
    setShowInstallationVAT(isPoseVAT);
  }, [cart?.products]);

  return (
    <Layout
      meta={{
        title: 'Mon panier',
        metaDesc: 'Panier Automatisme Online',
      }}
      footerMenu1={footerMenu1}
      footerMenu2={footerMenu2}
      footerMenu3={footerMenu3}
      themeSettings={themeSettings}
      categoriesMenu={categoriesMenu}
      totalProducts={totalProducts}
      isBg
    >
      <div className="pb-10 md:pb-16">
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
              <div className="relative flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-10 xl:gap-8 max-lg:max-w-xl mx-auto mt-6 lg:mt-12">
                {/* Conteneur principal */}
                <div className="flex-1 shrink-1 flex flex-col gap-6 lg:gap-10">
                  <CartContents />
                  {showInstallationVAT ? (
                    <InstallationVAT poseReducedTvForm={poseReducedTvForm} />
                  ) : null}
                  <DeliveryChoices />
                </div>

                {/* CartSummary en sticky à droite en desktop */}
                <aside className="w-full lg:min-w-1/4 lg:sticky lg:max-w-[300px] xxl:max-w-[440px] lg:top-20 self-start lg:shrink-1">
                  <CartSummary />
                </aside>
              </div>
            </>
          )}
        </Container>
      </div>
      <div className="py-6 lg:py-10 xl:py-16 bg-white">
        <Container>
          <BlocFeaturedProducts
            bloc={{
              __typename: 'AcfPageBlocsBlocFeaturedProductsLayout',
              title: 'Complétez votre panier',
              subtitle: '',
              image: {
                node: {
                  sourceUrl: '',
                },
              },
              products: {
                nodes: crossSellProducts,
              },
            }}
          />
        </Container>
      </div>
    </Layout>
  );
};

export default Panier;

export const getStaticProps: GetStaticProps = async () => {
  const commonData = await fetchCommonData();
  const reducedTvaFormRes = await client.query({
    query: GET_REDUCED_TVA_FORM,
  });

  const poseReducedTvForm =
    reducedTvaFormRes?.data?.themeSettings?.optionsFields?.poseReducedTvaForm
      ?.node?.mediaItemUrl || '';
  return {
    props: {
      ...commonData,
      poseReducedTvForm,
    },
    revalidate: 36000,
  };
};
