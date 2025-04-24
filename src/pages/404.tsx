// Components
import Layout from '@/components/Layout/Layout';

// Types
import type { GetStaticProps } from 'next';
import Container from '@/components/container';
import { fetchCommonData } from '@/utils/functions/fetchCommonData';
import { SimpleFooterMenuProps } from '@/components/sections/Footer/SimpleFooterMenu';
import { CategoryMenuProps } from '@/types/Categories';
import EmptyElement from '@/components/EmptyElement';
import { OrderSvg } from '@/components/SVG/Icons';
import { ThemeSettingsProps } from '@/types/CptTypes';
// import { CardProductProps } from '@/types/blocTypes';

const NotFound = ({
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
  return (
    <Layout
      meta={{ title: 'NotFound - Automatisme Online' }}
      uri={'/NotFound'}
      footerMenu1={footerMenu1}
      footerMenu2={footerMenu2}
      themeSettings={themeSettings}
      categoriesMenu={categoriesMenu}
      isBg
      excludeSeo
      totalProducts={totalProducts}
    >
      <Container>
        <div className="mt-10">
          <EmptyElement
            picto={<OrderSvg />}
            title={'Page introuvable'}
            subtitle={
              "La page ou le produit que vous recherchez n'existe pas ou n'existe plus"
            }
            ctaLabel={"Retourner à l'accueil"}
            ctaSlug={'/'}
            ctaType={'secondary'}
          />
        </div>
      </Container>
    </Layout>
  );
};

export default NotFound;

export const getStaticProps: GetStaticProps = async () => {
  const commonData = await fetchCommonData();

  return {
    props: {
      ...commonData,
    },
    revalidate: 3600000,
  };
};
