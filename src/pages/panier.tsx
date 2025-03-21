// Components
import Layout from '@/components/Layout/Layout';
import CartContents from '@/components/Cart/CartContents';

// Types
import type { GetStaticProps } from 'next';
import CartSummary from '@/components/Cart/CartSummary';
import DeliveryChoices from '@/components/Cart/DeliveryChoices';
import Container from '@/components/container';
import { useContext } from 'react';
import { CartContext } from '@/stores/CartProvider';
import { fetchCommonData } from '@/utils/functions/fetchCommonData';
import { SimpleFooterMenuProps } from '@/components/sections/Footer/SimpleFooterMenu';
import { CategoryMenuProps } from '@/types/Categories';
import CartUpsellProducts from '@/components/Cart/CartUpsellProducts';
import Separator from '@/components/atoms/Separator';
import EmptyElement from '@/components/EmptyElement';
import { LargeCartSvg } from '@/components/SVG/Icons';
import useAuth from '@/hooks/useAuth';
// import { CardProductProps } from '@/types/blocTypes';

const Panier = ({
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
  const { cart } = useContext(CartContext);

  const { isPro } = useAuth();
  // const upsellProducts: CardProductProps[] = [];
  //todo revoir quels prix on affiche + logique des produits upsell + logique des livraison + regrouper ici la logique d'update du panier
  return (
    <Layout
      meta={{ title: 'Panier - Automatisme Online' }}
      uri={'/panier'}
      footerMenu1={footerMenu1}
      footerMenu2={footerMenu2}
      themeSettings={themeSettings}
      categoriesMenu={categoriesMenu}
      isBg
      excludeSeo
    >
      <Container>
        {!cart || cart.totalProductsCount === 0 ? (
          <EmptyElement
            picto={<LargeCartSvg />}
            title={'Votre panier est vide'}
            subtitle={'Aucun produit dans votre panier'}
            ctaLabel={'Voir nos produits'}
            ctaSlug={'/'}
            ctaType={'primary'}
          />
        ) : (
          <>
            <div className="relative flex flex-col md:flex-row md:items-start gap-6 md:gap-10 xl:gap-16 max-md:max-w-md mx-auto mt-6 md:mt-12">
              {/* Conteneur principal */}
              <div className="flex-1 shrink-1 flex flex-col gap-6 md:gap-10 xl:gap-16">
                <CartContents isProSession={isPro} />
                <Separator />
                <DeliveryChoices />
                <Separator />
              </div>

              {/* CartSummary en sticky à droite en desktop */}
              <aside className="w-full md:min-w-1/4 md:sticky md:max-w-[300px] md:top-20 self-start md:shrink-1">
                <CartSummary isProSession={isPro} />
              </aside>
            </div>
            <div className="py-6 md:py-10 xl:py-16">
              <CartUpsellProducts />
            </div>
          </>
        )}
      </Container>
    </Layout>
  );
};

export default Panier;

export const getStaticProps: GetStaticProps = async () => {
  const commonData = await fetchCommonData();

  return {
    props: {
      ...commonData,
    },
    revalidate: 10000,
  };
};
