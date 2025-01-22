// Components
import Layout from '@/components/Layout/Layout';

// Utilities
import client from '@/utils/apollo/ApolloClient';

// Types
import type { GetStaticProps } from 'next';
import { BlocType, FeaturedFaqProps } from '@/types/blocTypes';
import { SimpleFooterMenuProps } from '@/components/sections/Footer/SimpleFooterMenu';

// GraphQL

import {
  GET_FOOTER_MENU_1,
  GET_FOOTER_MENU_2,
  GET_HOME_PAGE,
  GET_OPTIONS,
} from '@/utils/gql/WEBSITE_QUERIES';

// Blocs
import SimpleHero from '@/components/sections/blocs/SimpleHero';
import FlexibleContent from '@/components/sections/FlexibleContent';

const HomePage = ({
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
  const hero = page?.acfPage?.hero || null;
  const pageBlocs: BlocType[] = page?.acfPage?.blocs || null;

  console.log('pageBlocs', pageBlocs);
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

export default HomePage;

export const getStaticProps: GetStaticProps = async () => {
  const pageData = await client.query({
    query: GET_HOME_PAGE,
  });

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

  const page = pageData?.data?.page;

  const featuredFaq = page?.acfPage?.blocs?.some(
    (bloc: BlocType) => bloc.__typename === 'AcfPageBlocsBlocConseilsFaqLayout',
  )
    ? themeSettings?.featuredFaq
    : null;

  return {
    props: {
      page,
      themeSettings,
      featuredFaq,
      footerMenu1: footerMenu1?.data?.menu,
      footerMenu2: footerMenu2?.data?.menu,
    },
    revalidate: 60,
  };
};
