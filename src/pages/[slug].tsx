import client from '@/utils/apollo/ApolloClient';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import ErrorPage from 'next/error';

import Layout from '@/components/Layout/Layout';
import {
  GET_ALL_PAGE_SLUGS,
  GET_FOOTER_MENU_1,
  GET_FOOTER_MENU_2,
  // GET_FOOTER_MENU_3,
  GET_OPTIONS,
  GET_SINGLE_PAGE,
} from '@/utils/gql/WEBSITE_QUERIES';
import { BlocType, FeaturedFaqProps } from '@/types/blocTypes';
import FlexibleContent from '@/components/sections/FlexibleContent';
import SimpleHero from '@/components/sections/blocs/SimpleHero';
import { SimpleFooterMenuProps } from '@/components/sections/Footer/SimpleFooterMenu';

// todo typer une page

const Page = ({
  page,
  themeSettings,
  featuredFaq,
  footerMenu1,
  footerMenu2,
}: {
  page: any;
  themeSettings: any;
  featuredFaq: FeaturedFaqProps;
  footerMenu1: SimpleFooterMenuProps;
  footerMenu2: SimpleFooterMenuProps;
}) => {
  //todo typer theme settings et page
  const router = useRouter();
  if (!router.isFallback && !page?.title) {
    return <ErrorPage statusCode={404} />;
  }

  const hero = page?.acfPage?.hero || null;
  const pageBlocs: BlocType[] = page?.acfPage?.blocs || null;

  return (
    <Layout
      meta={page?.seo}
      uri={page?.uri}
      footerMenu1={footerMenu1}
      footerMenu2={footerMenu2}
      themeSettings={themeSettings}
    >
      <SimpleHero title={hero?.title || page?.title} subtitle={hero?.text} />
      <FlexibleContent
        blocs={pageBlocs}
        reassuranceItems={themeSettings?.reassurance}
        genericAdvices={themeSettings?.sliderAdvices}
        featuredFaq={featuredFaq}
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

  const footerMenu1 = await client.query({
    query: GET_FOOTER_MENU_1,
  });
  const footerMenu2 = await client.query({
    query: GET_FOOTER_MENU_2,
  });

  const themeSettings = options?.data?.themeSettings?.optionsFields;

  const featuredFaq = page?.data?.page?.acfPage?.blocs?.some(
    (bloc: BlocType) => bloc.__typename === 'AcfPageBlocsBlocConseilsFaqLayout',
  )
    ? themeSettings?.featuredFaq
    : null;

  return {
    props: {
      page: page?.data?.page,
      themeSettings,
      featuredFaq,
      footerMenu1: footerMenu1?.data?.menu,
      footerMenu2: footerMenu2?.data?.menu,
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
