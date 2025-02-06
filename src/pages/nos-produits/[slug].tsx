import {
  GetStaticPaths,
  GetStaticProps,
  InferGetStaticPropsType,
  NextPage,
} from 'next';
import {
  FETCH_ALL_PRODUCTS_WITH_PAGINATION,
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
import { PageInfoProps } from '@/types/CptTypes';

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
  let allProducts: any[] = [];
  let hasNextPage = true;
  let endCursor: string | undefined | null = null;

  while (hasNextPage) {
    const {
      data,
    }: {
      data: { products: { nodes: { uri: string }[]; pageInfo: PageInfoProps } };
    } = await client.query({
      query: FETCH_ALL_PRODUCTS_WITH_PAGINATION,
      variables: {
        first: 50, // Nombre d'éléments à récupérer par page (ajuste selon ton besoin)
        after: endCursor,
      },
    });

    if (data?.products?.nodes) {
      allProducts = [...allProducts, ...data.products.nodes];
    }

    hasNextPage = data?.products?.pageInfo?.hasNextPage;
    endCursor = data?.products?.pageInfo?.endCursor;
  }

  const paths = allProducts.map((product) => product.uri) || [];

  return {
    paths,
    fallback: 'blocking', // Génère la page statiquement à la première demande si elle n'est pas encore générée
  };
};
