import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import ErrorPage from 'next/error';

import Layout from '@/components/Layout/Layout.component';
import client from '@/utils/apollo/ApolloClient';
import {
  GET_ALL_PAGE_SLUGS,
  GET_OPTIONS,
  GET_SINGLE_PAGE,
} from '@/utils/gql/WEBSITE_QUERIES';
import { BlocType } from '@/types/blocTypes';
import FlexibleContent from '@/components/sections/FlexibleContent';
import SimpleHero from '@/components/sections/blocs/SimpleHero';

// todo typer une page

const Page = ({ page, themeSettings }: { page: any; themeSettings: any }) => {
  //todo typer theme settings et page
  const router = useRouter();
  if (!router.isFallback && !page?.title) {
    return <ErrorPage statusCode={404} />;
  }

  const hero = page?.acfPage?.hero || null;
  const pageBlocs: BlocType[] = page?.acfPage?.blocs || null;
  return (
    <Layout meta={page?.seo} uri={page?.uri}>
      <SimpleHero title={hero?.title || page?.title} subtitle={hero?.text} />
      <FlexibleContent
        blocs={pageBlocs}
        reassuranceItems={themeSettings?.reassurance}
        genericAdvices={themeSettings?.sliderAdvices}
      />
    </Layout>
  );
};

export default Page;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const page =
    (await client.query({
      query: GET_SINGLE_PAGE,
      variables: { id: params?.slug },
    })) || null;

  if (!page) {
    return {
      notFound: true,
    };
  }

  // const templateName = (await page?.acfPage?.template) || null;

  const options = await client.query({
    query: GET_OPTIONS,
  });

  const themeSettings = options?.data?.themeSettings?.optionsFields;

  return {
    props: {
      page: page?.data?.page,
      themeSettings,
    },
    revalidate: 60,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await client.query({ query: GET_ALL_PAGE_SLUGS });
  const allPages = res?.data?.pages?.nodes?.filter(
    (page: any) => !page.isFrontPage,
  );

  // On enlève la page d'accueil qui sera traitée autrement (car elle a un slug en 'accueil' et on veut '/')
  return {
    paths: allPages.map((page: any) => `/${page?.slug}/`) || [],
    fallback: 'blocking',
  };
};
