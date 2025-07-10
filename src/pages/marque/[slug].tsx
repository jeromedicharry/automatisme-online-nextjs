import { GetStaticPaths, GetStaticProps } from 'next';
import {
  FETCH_ALL_BRANDS_WITH_PAGINATION,
  FETCH_SINGLE_BRAND,
} from '@/utils/gql/WOOCOMMERCE_QUERIES';
import client from '@/utils/apollo/ApolloClient';

import Layout from '@/components/Layout/Layout';

import { fetchCommonData } from '@/utils/functions/fetchCommonData';

import { PageInfoProps, ThemeSettingsProps } from '@/types/CptTypes';
import { SimpleFooterMenuProps } from '@/components/sections/Footer/SimpleFooterMenu';
import { CategoryMenuProps } from '@/types/Categories';
import { BrandContentProps } from '@/types/Brands';
import Hero from '@/components/Brand/Hero';
import BlocSAV from '@/components/Brand/BlocSav';
import { PostCard } from '@/types/Posts';
import BlocIntroSmall from '@/components/atoms/BlocIntroSmall';
import Container from '@/components/container';
// import Cta from '@/components/atoms/Cta';
import BlocFeaturedProducts from '@/components/sections/blocs/BlocFeaturedProducts';
import Cta from '@/components/atoms/Cta';
// import RelatedBrands from './RelatedBrands';

const BrandPage = ({
  brand,
  themeSettings,
  totalProducts,
  footerMenu1,
  footerMenu2,
  categoriesMenu,
}: {
  brand: BrandContentProps;
  themeSettings: ThemeSettingsProps;
  totalProducts?: number;
  footerMenu1: SimpleFooterMenuProps;
  footerMenu2: SimpleFooterMenuProps;
  categoriesMenu?: CategoryMenuProps[];
}) => {
  const FeaturedProductsData = {
    title: `L'univers produit de ${brand.name}`,
    subtitle: '',
    products: brand.acfBrand.featuredProducts || [],
    __typename: 'AcfPageBlocsBlocFeaturedProductsLayout' as const,
    image: {
      node: {
        sourceUrl: '',
      },
    },
  };

  return (
    <Layout
      meta={brand.seo}
      categoriesMenu={categoriesMenu}
      footerMenu1={footerMenu1}
      footerMenu2={footerMenu2}
      themeSettings={themeSettings}
      totalProducts={totalProducts}
      isBrand
    >
      <Hero
        title={brand.name}
        description={brand.description}
        logo={brand.thumbnailUrl}
        breadCrumbs={brand.seo?.breadcrumbs || []}
        image={brand.acfBrand.hero.image?.node?.sourceUrl}
        globalNote={brand.acfBrand.hero.globalNote}
        notes={brand.acfBrand.hero.notes}
      />
      <div className="space-y-8 mb-10 md:mb-16">
        {brand.acfBrand.bolcSav &&
          brand.acfBrand.bolcSav.text &&
          brand.acfBrand.bolcSav.image && (
            <BlocSAV bloc={brand.acfBrand.bolcSav} />
          )}

        {brand?.posts?.nodes?.length > 0 && (
          <>
            <Container>
              <BlocIntroSmall
                title={`Les derniers articles de ${brand.name}`}
              />
            </Container>
            <div className="space-y-8">
              {brand.posts.nodes.map((post: PostCard) => {
                const bloc = {
                  title: post.title,
                  text: post.excerpt,
                  image: {
                    node: {
                      sourceUrl: post.featuredImage?.node?.sourceUrl,
                    },
                  },
                  slug: post.slug,
                  isImageLeft: true,
                  showNote: false,
                  date: post.date,
                  brand: brand.name,
                };

                return <BlocSAV key={post.slug} bloc={bloc} slug={post.slug} />;
              })}
            </div>
            <Container>
              <Cta
                variant="primary"
                label={`Tous les articles de ${brand.name}`}
                slug={`/bibliotheque?type=articles&search=${brand.slug}`}
              >
                Voir tous les articles de {brand.name}
              </Cta>
            </Container>
          </>
        )}
      </div>
      <BlocFeaturedProducts bloc={FeaturedProductsData} />
      {/* <RelatedBrands brands={brand.acfBrand.relatedBrands?.nodes} /> */}
    </Layout>
  );
};

export default BrandPage;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const { data } = await client.query({
      query: FETCH_SINGLE_BRAND,
      variables: { id: params?.slug },
    });

    if (!data?.productBrand) {
      return {
        notFound: true,
      };
    }

    const commonData = await fetchCommonData();

    return {
      props: {
        brand: data?.productBrand,
        ...commonData,
      },
      revalidate: 3600, //  requis pour que `res.revalidate(...)` fonctionne
    };
  } catch (error) {
    console.error('Erreur Apollo:', error);
    return {
      notFound: true, // Retourne 404 si une erreur se produit
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  let allBrands: any[] = [];
  let hasNextPage = true;
  let endCursor: string | undefined | null = null;

  while (hasNextPage) {
    const {
      data,
    }: {
      data: {
        productBrands: { nodes: { uri: string }[]; pageInfo: PageInfoProps };
      };
    } = await client.query({
      query: FETCH_ALL_BRANDS_WITH_PAGINATION,
      variables: {
        first: 50, // Nombre d'éléments à récupérer par page (ajuste selon ton besoin)
        after: endCursor,
      },
    });

    if (data?.productBrands?.nodes) {
      allBrands = [...allBrands, ...data.productBrands.nodes];
    }

    hasNextPage = data?.productBrands?.pageInfo?.hasNextPage;
    endCursor = data?.productBrands?.pageInfo?.endCursor;
  }

  const paths = allBrands.map((brand) => brand.uri.replace(/\/$/, '')) || [];

  return {
    paths,
    fallback: 'blocking', // Génère la page statiquement à la première demande si elle n'est pas encore générée
  };
};
