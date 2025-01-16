import {
  GetStaticProps,
  GetStaticPaths,
  InferGetStaticPropsType,
  NextPage,
} from 'next';
import { GET_SINGLE_PRODUCT } from '@/utils/gql/WOOCOMMERCE_QUERIES';
import client from '@/utils/apollo/ApolloClient';
import SingleProduct from '@/components/Product/SingleProduct.component';

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = []; //todo récupérer tous les produits d'une catégorie
  return {
    paths,
    fallback: 'blocking', // Génère la page statiquement à la première demande si elle n'est pas encore générée
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { data } = await client.query({
    query: GET_SINGLE_PRODUCT,
    variables: { id: params?.id },
  });

  return {
    props: {
      product: data?.product,
    },
    revalidate: 120,
  };
};

const Product: NextPage = ({
  product,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <Layout title={`${product.name ? product.name : ''}`}>
      {product ? <SingleProduct product={product} /> : null}
    </Layout>
  );
};

export default Product;
