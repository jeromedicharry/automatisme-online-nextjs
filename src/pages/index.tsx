// Components
import Layout from '@/components/Layout/Layout';

// Utilities
import client from '@/utils/apollo/ApolloClient';

// Types
import type { GetStaticProps } from 'next';
import { BlocType, FeaturedFaqProps } from '@/types/blocTypes';
import { SimpleFooterMenuProps } from '@/components/sections/Footer/SimpleFooterMenu';
import { FaqItemProps } from '@/types/Faq';
import { CategoryMenuProps } from '@/types/Categories';

// GraphQL

import { GET_ALL_FAQ_ITEMS, GET_HOME_PAGE } from '@/utils/gql/WEBSITE_QUERIES';
import { fetchCommonData } from '@/utils/functions/fetchCommonData';

// Blocs
import SimpleHero from '@/components/sections/blocs/SimpleHero';
import FlexibleContent from '@/components/sections/FlexibleContent';
import HomePromoSection from '@/components/sections/Home/HomePromoSection';
import { HomePageProps, ThemeSettingsProps } from '@/types/CptTypes';

const HomePage = ({
  page,
  themeSettings,
  totalProducts,
  featuredFaq,
  footerMenu1,
  footerMenu2,
  faqItems,
  categoriesMenu,
}: {
  page: HomePageProps;
  themeSettings: ThemeSettingsProps;
  totalProducts?: number;
  featuredFaq: FeaturedFaqProps;
  footerMenu1: SimpleFooterMenuProps;
  footerMenu2: SimpleFooterMenuProps;
  faqItems: FaqItemProps[];
  categoriesMenu?: CategoryMenuProps[];
}) => {
  const promoSection = page?.acfHome;
  const hero = page?.acfPage?.hero || null;
  const pageBlocs: BlocType[] = page?.acfPage?.blocs || null;

  return (
    <Layout
      meta={page?.seo}
      uri={page?.uri}
      footerMenu1={footerMenu1}
      footerMenu2={footerMenu2}
      themeSettings={themeSettings}
      categoriesMenu={categoriesMenu}
      isHome
      totalProducts={totalProducts}
    >
      {promoSection?.isShown ? (
        <>
          <HomePromoSection
            mainSlider={promoSection?.mainSlider}
            secondarySlider={promoSection?.secondarySlider}
          />
        </>
      ) : null}
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

export default HomePage;

export const getStaticProps: GetStaticProps = async () => {
  const pageData = await client.query({
    query: GET_HOME_PAGE,
  });

  const commonData = await fetchCommonData();

  const page = pageData?.data?.page;

  const featuredFaq = page?.acfPage?.blocs?.some(
    (bloc: BlocType) => bloc.__typename === 'AcfPageBlocsBlocConseilsFaqLayout',
  )
    ? commonData?.themeSettings?.featuredFaq
    : null;

  let faqItems = [];

  if (
    page?.acfPage?.blocs?.some(
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
      page,
      ...commonData, // <- On passe toutes les valeurs retournées par `fetchCommonData`
      featuredFaq,
      faqItems,
    },
    revalidate: 3600,
  };
};
