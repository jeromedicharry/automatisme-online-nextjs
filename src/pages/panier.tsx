// Components
import Layout from '@/components/Layout/Layout';
import CartContents from '@/components/Cart/CartContents';
import CartSummary from '@/components/Cart/CartSummary';
import DeliveryChoices from '@/components/Cart/DeliveryChoices';
import Container from '@/components/container';
import CartUpsellProducts from '@/components/Cart/CartUpsellProducts';
import Separator from '@/components/atoms/Separator';
import EmptyElement from '@/components/EmptyElement';
import { LargeCartSvg } from '@/components/SVG/Icons';

// Hooks
import { useCartOperations } from '@/hooks/useCartOperations';

// Types
import type { GetStaticProps } from 'next';
import { SimpleFooterMenuProps } from '@/components/sections/Footer/SimpleFooterMenu';
import { CategoryMenuProps } from '@/types/Categories';
import { fetchCommonData } from '@/utils/functions/fetchCommonData';

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
  const { cart, isPro } = useCartOperations();

  return (
    <Layout
      meta={{
        title: 'Mon panier',
      }}
      footerMenu1={footerMenu1}
      footerMenu2={footerMenu2}
      themeSettings={themeSettings}
      categoriesMenu={categoriesMenu}
    >
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
              <div className="flex-1 shrink-1 flex flex-col gap-6 lg:gap-10 xl:gap-16">
                <CartContents />
                <Separator />
                <DeliveryChoices />
                <Separator />
              </div>

              {/* CartSummary en sticky à droite en desktop */}
              <aside className="w-full lg:min-w-1/4 lg:sticky lg:max-w-[300px] lg:top-20 self-start lg:shrink-1">
                <CartSummary isProSession={isPro} />
              </aside>
            </div>
            <div className="py-6 lg:py-10 xl:py-16">
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
    revalidate: 60,
  };
};
