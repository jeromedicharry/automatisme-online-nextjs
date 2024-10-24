// Components
import Hero from '@/components/Index/Hero.component';
import DisplayProducts from '@/components/Product/DisplayProducts.component';
import Layout from '@/components/Layout/Layout.component';

// Utilities
import client from '@/utils/apollo/ApolloClient';

// Types
import type { NextPage, GetStaticProps, InferGetStaticPropsType } from 'next';

// GraphQL
import {
  FETCH_ALL_PRODUCTS_QUERY,
  GET_SINGLE_PAGE,
} from '@/utils/gql/GQL_QUERIES';

/**
 * Main index page
 * @function Index
 * @param {InferGetStaticPropsType<typeof getStaticProps>} products
 * @returns {JSX.Element} - Rendered component
 */

const Index: NextPage = ({
  page,
  products,
}: InferGetStaticPropsType<typeof getStaticProps>) => (
  <Layout meta={page?.seo} uri="">
    <Hero />
    {products && <DisplayProducts products={products} />}
  </Layout>
);

export default Index;

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await client.query({
    query: FETCH_ALL_PRODUCTS_QUERY,
  });

  const products = data?.products?.nodes;

  const homePageSlug = 'accueil';
  const pageData = await client.query({
    query: GET_SINGLE_PAGE,
    variables: { id: homePageSlug },
  });

  const { page } = pageData.data;

  return {
    props: {
      page,
      products,
    },
    revalidate: 60,
  };
};
