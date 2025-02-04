import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next';
import {
  FETCH_ALL_PRODUCTS_QUERY,
  GET_SINGLE_PRODUCT,
} from '@/utils/gql/WOOCOMMERCE_QUERIES';
import client from '@/utils/apollo/ApolloClient';
import ProductContent from '@/components/Product/ProductContent';
import Layout from '@/components/Layout/Layout';
import Container from '@/components/container';
import BreadCrumbs from '@/components/atoms/BreadCrumbs';
import { fetchCommonData } from '@/utils/functions/fetchCommonData';
import ProductUpsells from '@/components/Product/ProductUpsells';
import ProductCrossSells from '@/components/Product/ProductCrossSells';

const Product: NextPage = ({
  product,
  themeSettings,
  footerMenu1,
  footerMenu2,
  categoriesMenu,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <Layout
      meta={product.seo}
      categoriesMenu={categoriesMenu}
      uri={product?.uri}
      footerMenu1={footerMenu1}
      footerMenu2={footerMenu2}
      themeSettings={themeSettings}
    >
      <Container>
        <BreadCrumbs breadCrumbs={product.seo.breadcrumbs} />
        <ProductContent
          product={product}
          paymentPictos={themeSettings?.paymentPictos}
        />
      </Container>
      <ProductUpsells upsellProducts={product?.upsell?.nodes} />
      <Container>
        <ProductCrossSells crossSellProducts={product?.crossSell?.nodes} />
      </Container>
    </Layout>
  );
};

export default Product;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const { data } = await client.query({
      query: GET_SINGLE_PRODUCT,
      variables: { id: params?.slug },
    });

    if (!data?.product) {
      return {
        notFound: true,
      };
    }

    const commonData = await fetchCommonData();

    return {
      props: {
        product: data?.product,
        ...commonData,
      },
      revalidate: 120,
    };
  } catch (error) {
    console.error('Erreur Apollo:', error);
    return {
      notFound: true, // Retourne 404 si une erreur se produit
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await client.query({ query: FETCH_ALL_PRODUCTS_QUERY });
  const allProducts = res?.data?.products?.nodes;
  const paths = allProducts.map((product: any) => `${product?.uri}`) || [];

  return {
    paths,
    fallback: 'blocking', // Génère la page statiquement à la première demande si elle n'est pas encore générée
  };
};
