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
import { useQuery } from '@apollo/client';
import { GET_CART } from '@/utils/gql/WOOCOMMERCE_QUERIES';
import { getFormattedCart } from '@/utils/functions/functions';

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
  const { cart, setCart } = useContext(CartContext);

  const { isPro } = useAuth();

  // Déplacer la logique GET_CART ici
  const { refetch } = useQuery(GET_CART, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      const updatedCart = getFormattedCart(data, isPro);
      if (!updatedCart || !updatedCart.products.length) {
        localStorage.removeItem('woocommerce-cart');
        setCart(null);
        return;
      }
      localStorage.setItem('woocommerce-cart', JSON.stringify(updatedCart));
      setCart(updatedCart);
    },
  });

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
            <div className="relative flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-10 xl:gap-16 max-lg:max-w-xl mx-auto mt-6 lg:mt-12">
              {/* Conteneur principal */}
              <div className="flex-1 shrink-1 flex flex-col gap-6 lg:gap-10 xl:gap-16">
                <CartContents isProSession={isPro} refetch={refetch} />
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
    revalidate: 10000,
  };
};
