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
import SingleProduct from '@/components/Product/SingleProduct';
import Layout from '@/components/Layout/Layout';

const Product: NextPage = ({
  product,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <Layout meta={product.seo} title={`${product.name ? product.name : ''}`}>
      {product ? <SingleProduct product={product} /> : null}
    </Layout>
  );
};

export default Product;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  console.log('params', params);
  const { data } = await client.query({
    query: GET_SINGLE_PRODUCT,
    variables: { id: params?.slug },
  });

  return {
    props: {
      product: data?.product,
    },
    revalidate: 120,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await client.query({ query: FETCH_ALL_PRODUCTS_QUERY });
  const allProducts = res?.data?.products?.nodes;
  const paths = allProducts.map((product: any) => `${product?.uri}`) || [];

  console.log('paths', paths);

  return {
    paths,
    fallback: 'blocking', // Génère la page statiquement à la première demande si elle n'est pas encore générée
  };
};
