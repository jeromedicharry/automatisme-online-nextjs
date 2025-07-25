import client from '@/utils/apollo/ApolloClient';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import ErrorPage from 'next/error';

import Layout, { DoubleLevelFooterMenuProps } from '@/components/Layout/Layout';
import {
  GET_ALL_FAQ_ITEMS,
  GET_ALL_PAGE_SLUGS,
  GET_SINGLE_PAGE,
} from '@/utils/gql/WEBSITE_QUERIES';
import { BlocType, FeaturedFaqProps } from '@/types/blocTypes';
import FlexibleContent from '@/components/sections/FlexibleContent';
import SimpleHero from '@/components/sections/blocs/SimpleHero';
import { SimpleFooterMenuProps } from '@/components/sections/Footer/SimpleFooterMenu';
import { FaqItemProps } from '@/types/Faq';
import { fetchCommonData } from '@/utils/functions/fetchCommonData';
import { CategoryMenuProps } from '@/types/Categories';
import { PageProps, ThemeSettingsProps } from '@/types/CptTypes';

const Page = ({
  page,
  themeSettings,
  totalProducts,
  featuredFaq,
  footerMenu1,
  footerMenu2,
  footerMenu3,
  faqItems,
  categoriesMenu,
}: {
  page: PageProps;
  themeSettings: ThemeSettingsProps;
  totalProducts?: number;
  featuredFaq: FeaturedFaqProps;
  footerMenu1: SimpleFooterMenuProps;
  footerMenu2: SimpleFooterMenuProps;
  footerMenu3?: DoubleLevelFooterMenuProps;
  faqItems: FaqItemProps[];
  categoriesMenu?: CategoryMenuProps[];
}) => {
  const router = useRouter();
  if (!router.isFallback && !page?.title) {
    return <ErrorPage statusCode={404} />;
  }

  const hero = page?.acfPage?.hero || null;
  const pageBlocs: BlocType[] = page?.acfPage?.blocs || null;

  return (
    <Layout
      meta={page?.seo}
      footerMenu1={footerMenu1}
      footerMenu2={footerMenu2}
      footerMenu3={footerMenu3}
      themeSettings={themeSettings}
      categoriesMenu={categoriesMenu}
      totalProducts={totalProducts}
    >
      <SimpleHero title={hero?.title || page?.title} subtitle={hero?.text} />
      <FlexibleContent
        blocs={pageBlocs}
        reassuranceItems={themeSettings?.reassurance}
        reassuranceAccordion={themeSettings?.reassuranceAccordion}
        genericAdvices={themeSettings?.sliderAdvices}
        featuredFaq={featuredFaq}
        faqItems={faqItems}
        categories={categoriesMenu}
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

  if (!page?.data?.page) {
    return {
      notFound: true,
    };
  }

  const commonData = await fetchCommonData();

  const featuredFaq = page?.data?.page?.acfPage?.blocs?.some(
    (bloc: BlocType) => bloc.__typename === 'AcfPageBlocsBlocConseilsFaqLayout',
  )
    ? commonData.themeSettings?.featuredFaq
    : null;

  let faqItems = [];

  if (
    page?.data?.page?.acfPage?.blocs?.some(
      (bloc: BlocType) => bloc.__typename === 'AcfPageBlocsBlocFaqLayout',
    )
  ) {
    const faqRes = await client.query({
      query: GET_ALL_FAQ_ITEMS,
    });

    faqItems = faqRes?.data?.faqItems?.nodes || [];
  }

  return {
    props: {
      page: page?.data?.page,
      ...commonData,
      featuredFaq,
      faqItems,
    },
    revalidate: 300, //  requis pour que `res.revalidate(...)` fonctionne
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await client.query({ query: GET_ALL_PAGE_SLUGS });
  const allPages = res?.data?.pages?.nodes?.filter(
    (page: any) => !page.isFrontPage,
  );

  // On enlève la page d'accueil qui sera traitée autrement (car elle a un slug en 'accueil' et on veut '/')
  return {
    paths: allPages.map((page: any) => `/${page?.slug}`) || [],
    fallback: 'blocking',
  };
};
