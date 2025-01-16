// Components
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
} from '@/utils/gql/WOOCOMMERCE_QUERIES';
import FlexibleContent from '@/components/sections/FlexibleContent';

/**
 * Main index page
 * @function Index
 * @param {InferGetStaticPropsType<typeof getStaticProps>} products
 * @returns {JSX.Element} - Rendered component
 */

const Index: NextPage = ({
  page,
}: InferGetStaticPropsType<typeof getStaticProps>) => (
  <Layout meta={page?.seo} uri="">
    <FlexibleContent blocs={page?.acfPage?.blocs} />
  </Layout>
);

export default Index;

export const getStaticProps: GetStaticProps = async () => {
  // todo create getProducts separate functions
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
