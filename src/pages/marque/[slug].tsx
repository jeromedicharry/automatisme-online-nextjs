import { GetStaticPaths, GetStaticProps } from 'next';
import {
  FETCH_ALL_BRANDS_WITH_PAGINATION,
  FETCH_SINGLE_BRAND,
} from '@/utils/gql/WOOCOMMERCE_QUERIES';
import client from '@/utils/apollo/ApolloClient';

import Layout from '@/components/Layout/Layout';

import { fetchCommonData } from '@/utils/functions/fetchCommonData';

import { PageInfoProps, ThemeSettingsProps } from '@/types/CptTypes';
import { SimpleFooterMenuProps } from '@/components/sections/Footer/SimpleFooterMenu';
import { CategoryMenuProps } from '@/types/Categories';
import { BrandContentProps } from '@/types/Brands';
import Hero from '@/components/Brand/Hero';

const BrandPage = ({
  brand,
  themeSettings,
  totalProducts,
  footerMenu1,
  footerMenu2,
  categoriesMenu,
}: {
  brand: BrandContentProps;
  themeSettings: ThemeSettingsProps;
  totalProducts?: number;
  footerMenu1: SimpleFooterMenuProps;
  footerMenu2: SimpleFooterMenuProps;
  categoriesMenu?: CategoryMenuProps[];
}) => {
  console.log('breadcrumbs', brand.seo.breadcrumbs);
  return (
    <Layout
      meta={brand.seo}
      categoriesMenu={categoriesMenu}
      uri={brand?.uri}
      footerMenu1={footerMenu1}
      footerMenu2={footerMenu2}
      themeSettings={themeSettings}
      totalProducts={totalProducts}
      isBrand
    >
      <Hero
        title={brand.name}
        description={brand.description}
        logo={brand.thumbnailUrl}
        breadCrumbs={brand.seo?.breadcrumbs || []}
        image={brand.acfBrand.hero.image.node.sourceUrl}
        globalNote={brand.acfBrand.hero.globalNote}
        notes={brand.acfBrand.hero.notes}
      />
    </Layout>
  );
};

export default BrandPage;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const { data } = await client.query({
      query: FETCH_SINGLE_BRAND,
      variables: { id: params?.slug },
    });

    if (!data?.productBrand) {
      return {
        notFound: true,
      };
    }

    const commonData = await fetchCommonData();

    return {
      props: {
        brand: data?.productBrand,
        ...commonData,
      },
      revalidate: 3600, //  requis pour que `res.revalidate(...)` fonctionne
    };
  } catch (error) {
    console.error('Erreur Apollo:', error);
    return {
      notFound: true, // Retourne 404 si une erreur se produit
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  let allBrands: any[] = [];
  let hasNextPage = true;
  let endCursor: string | undefined | null = null;

  while (hasNextPage) {
    const {
      data,
    }: {
      data: {
        productBrands: { nodes: { uri: string }[]; pageInfo: PageInfoProps };
      };
    } = await client.query({
      query: FETCH_ALL_BRANDS_WITH_PAGINATION,
      variables: {
        first: 50, // Nombre d'éléments à récupérer par page (ajuste selon ton besoin)
        after: endCursor,
      },
    });

    if (data?.productBrands?.nodes) {
      allBrands = [...allBrands, ...data.productBrands.nodes];
    }

    hasNextPage = data?.productBrands?.pageInfo?.hasNextPage;
    endCursor = data?.productBrands?.pageInfo?.endCursor;
  }

  const paths = allBrands.map((brand) => brand.uri.replace(/\/$/, '')) || [];

  return {
    paths,
    fallback: 'blocking', // Génère la page statiquement à la première demande si elle n'est pas encore générée
  };
};
