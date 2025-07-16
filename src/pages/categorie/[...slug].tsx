// Imports nécessaires
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import {
  GET_ALL_CATEGORIES_QUERY,
  GET_SINGLE_CATEGORY,
} from '@/utils/gql/WOOCOMMERCE_QUERIES';
import client from '@/utils/apollo/ApolloClient';
import Layout, { DoubleLevelFooterMenuProps } from '@/components/Layout/Layout';

import Container from '@/components/container';
import React, { useEffect, useState } from 'react';
import Cta from '@/components/atoms/Cta';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';
import { CategoryMenuProps, CategoryPageProps } from '@/types/Categories';
import { fetchCommonData } from '@/utils/functions/fetchCommonData';
import { SimpleFooterMenuProps } from '@/components/sections/Footer/SimpleFooterMenu';
import BreadCrumbs from '@/components/atoms/BreadCrumbs';
import { ThemeSettingsProps } from '@/types/CptTypes';
import { fetchMeiliProductsByCategory } from '@/utils/functions/meilisearch';
import CardProductMeilisearch, {
  CardProductMeilisearchProps,
} from '@/components/cards/CardProductMeilisearch';
import FilterSidebar from '@/components/filters/FilterSideBar';
import BlocIntroLarge from '@/components/atoms/BlocIntroLarge';
import SubcategoriesNav from '@/components/ProductCategory/SubcategoriesNav';
import { perPage, sortingOptions } from '@/components/filters/config';
import CardInstallation from '@/components/cards/CardInstallation';
import { installationData } from '@/stores/IntermediateCartContext';
import { GET_INSTALLATION_CTA } from '@/utils/gql/WEBSITE_QUERIES';
import EmptyElement from '@/components/EmptyElement';
import { SearchSvg } from '@/components/sections/blocs/BlocFaq';
import BlocReassurance from '@/components/sections/blocs/BlocReassurance';
import { BlocReassuranceProps } from '@/types/blocTypes';
import Script from 'next/script';
import BlocConseilFAQ from '@/components/sections/blocs/BlocConseilFAQ';

interface Filters {
  [key: string]: string;
}

const CategoryPage = ({
  products,
  category,
  total,
  themeSettings,
  totalProducts,
  footerMenu1,
  footerMenu2,
  footerMenu3,
  categoriesMenu,
  initialFacets,
  initialHasPose,
  installationData,
}: {
  products: CardProductMeilisearchProps[];
  category: CategoryPageProps;
  total: number;
  themeSettings: ThemeSettingsProps;
  totalProducts: number;
  footerMenu1: SimpleFooterMenuProps;
  footerMenu2: SimpleFooterMenuProps;
  footerMenu3?: DoubleLevelFooterMenuProps;
  categoriesMenu?: CategoryMenuProps[];
  initialFacets: any;
  initialHasPose: boolean;
  installationData: installationData;
}) => {
  const router = useRouter();
  const [productSelection, setProductSelection] = useState(products || []);
  const [currentTotal, setCurrentTotal] = useState(total);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(products.length < total);
  const [facets, setFacets] = useState(initialFacets);
  const [hasPose, setHasPose] = useState(initialHasPose);

  const blocReassuranceFix = {
    __typename: 'AcfPageBlocsBlocReassuranceLayout',
    type: 'Fond blanc',
    isAvis: true,
  };

  useEffect(() => {
    if (!router.isReady) return;

    const fetchFilteredProducts = async () => {
      setIsLoading(true);

      // Extraire uniquement les filtres valides de l'URL
      const validFilters: Filters = {};
      // Récupérer le tri directement de l'URL chaque fois qu'on en a besoin
      const sortValue = (router.query.sort as string) || ''; // récupère directement la valeur de tri ou '' par défaut

      Object.entries(router.query).forEach(([key, value]) => {
        if (
          !['slug', 'page', 'search', 'sort'].includes(key) && // on exclut 'sort' car on l'a déjà traité
          typeof value === 'string'
        ) {
          validFilters[key] = value;
        }
      });

      try {
        const result = await fetchMeiliProductsByCategory({
          categorySlug: category?.slug || '',
          page: 1,
          limit: perPage,
          filters: validFilters,
          sort: sortValue,
        });

        setProductSelection(result.products);
        setFacets(result.facets);
        setCurrentTotal(result.total);
        setCurrentPage(1);
        setHasMore(result.products.length < result.total);
      } catch (error) {
        console.error(
          'Erreur lors de la récupération des produits filtrés :',
          error,
        );
      }

      setIsLoading(false);
    };

    fetchFilteredProducts();
  }, [router.isReady, router.asPath, router.query, category]);

  useEffect(() => {
    setProductSelection(products);
    setCurrentPage(1);
    setHasMore(products.length < total);
    setFacets(initialFacets);
    setHasPose(initialHasPose);
    setCurrentTotal(total);
  }, [products, total, initialFacets, initialHasPose]);

  if (router.isFallback) {
    return <p>Chargement...</p>;
  }

  const handleLoadMore = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    setIsLoading(true);
    const nextPage = currentPage + 1;

    // Extraire les filtres actuels de l'URL
    const validFilters: Filters = {};
    const sortValue = (router.query.sort as string) || ''; // récupère directement la valeur de tri ou '' par défaut

    Object.entries(router.query).forEach(([key, value]) => {
      if (
        !['slug', 'page', 'search', 'sort'].includes(key) && // on exclut 'sort' car on l'a déjà traité
        typeof value === 'string'
      ) {
        validFilters[key] = value;
      }
    });

    try {
      const categorySlug = category?.slug;
      const result = await fetchMeiliProductsByCategory({
        categorySlug,
        page: nextPage,
        limit: perPage,
        filters: validFilters,
        sort: sortValue,
      });

      setProductSelection((prev) => [...prev, ...result.products]);
      setCurrentPage(nextPage);
      setHasMore(
        productSelection.length + result.products.length < result.total,
      );
    } catch (error) {
      console.error('Erreur lors du chargement de plus de produits :', error);
    }

    setIsLoading(false);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;

    // Construire une nouvelle URL avec le tri sélectionné
    const currentQuery = { ...router.query };

    if (selectedValue) {
      currentQuery.sort = selectedValue;
    } else {
      delete currentQuery.sort; // Supprimer le paramètre si pas de tri
    }

    // Réinitialiser la page à 1 lors d'un changement de tri
    delete currentQuery.page;

    // Naviguer vers la nouvelle URL avec le paramètre de tri
    router.push(
      {
        pathname: router.pathname,
        query: currentQuery,
      },
      undefined,
      { shallow: true },
    );
  };

  return (
    <Layout
      meta={category?.seo}
      categoriesMenu={categoriesMenu}
      footerMenu1={footerMenu1}
      footerMenu2={footerMenu2}
      footerMenu3={footerMenu3}
      themeSettings={themeSettings}
      totalProducts={totalProducts}
      isBg
    >
      <Container>
        <div className="mb-12 md:mb-16">
          <BreadCrumbs breadCrumbs={category?.seo?.breadcrumbs} />
        </div>
        <BlocIntroLarge
          title={category?.name}
          subtitle={category?.description}
          isH1
          isDescriptionFontNormal
        />
        <div className="flex flex-col items-start md:flex-row gap-4 mb-10 md:mb-16">
          <FilterSidebar
            facetDistribution={facets}
            categorySlug={category.slug}
          />
          <section className="max-md:w-full lg:flex-grow overflow-hidden">
            <div className="flex justify-between mb-6 md:mb-4">
              <p className="text-sm md:text-base leading-general text-dark-grey">
                {currentTotal} produits trouvés
              </p>
              <form className="flex items-center gap-4 sortForm">
                <label htmlFor="sort" className="whitespace-nowrap">
                  Trier par:
                </label>
                <select
                  name="sort"
                  id="sort"
                  value={(router.query.sort as string) || ''}
                  onChange={handleSortChange}
                >
                  {sortingOptions.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </form>
            </div>
            <SubcategoriesNav subCategories={category?.children?.nodes} />
            {productSelection?.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mx-auto w-fit items-stretch">
                {productSelection?.map(
                  (product: CardProductMeilisearchProps, index) => (
                    <React.Fragment key={product?.id}>
                      <CardProductMeilisearch
                        key={product.id}
                        product={product}
                        discountRate={themeSettings?.prosDiscountRate}
                      />
                      {hasPose && index === 1 && (
                        <CardInstallation installation={installationData} />
                      )}
                    </React.Fragment>
                  ),
                )}
              </div>
            ) : (
              <>
                <EmptyElement
                  picto={<SearchSvg />}
                  title="Aucun produit correspondant"
                  subtitle="Supprimez les filtres et faites une nouvelle recherche"
                />
                <div className="text-xl md:text-2xl text-center text-secondary font-bold mt-6 md:mt-10">
                  Vous ne trouvez pas ce que vous recherchez ?
                </div>
                <div className="flex mt-6 mb:mt-10 items-center">
                  <Cta
                    label="Contactez-nous pour une demande spécifique"
                    slug="/contact?configurator=true"
                    variant="primary"
                    additionalClass="w-fit mx-auto"
                  >
                    Demandez-nous un conseil
                  </Cta>
                </div>
              </>
            )}
            {isLoading && <LoadingSpinner />}

            {hasMore && !isLoading ? (
              <Cta
                label="Voir plus de produits"
                slug="#"
                variant="primary"
                additionalClass="w-fit mx-auto mt-10"
                handleButtonClick={(e) => handleLoadMore(e)}
              >
                Voir plus de produits
              </Cta>
            ) : null}
          </section>
        </div>
        <BlocReassurance
          reassuranceItems={themeSettings?.reassurance}
          bloc={blocReassuranceFix as BlocReassuranceProps}
        />
        <BlocConseilFAQ
          bloc={{
            __typename: 'AcfPageBlocsBlocConseilsFaqLayout',
            title: themeSettings?.sliderAdviceTitle,
            text: themeSettings?.sliderAdviceText,

            isSpecificContent: false,
            sliderAdvices: [],
            featuredFaq: themeSettings?.featuredFaq,
          }}
          featuredFaq={themeSettings?.featuredFaq}
          genericAdvices={themeSettings?.sliderAdvices}
        />
      </Container>
      <Script
        defer
        strategy="afterInteractive"
        src="https://widgets.rr.skeepers.io/product/076a2ab0-6d91-8ec4-1dc0-ff5c0501b805/14849b72-094b-478b-a7a8-23978e2bb2de.js"
        charSet="utf-8"
      />
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = Array.isArray(params?.slug)
    ? `${params.slug.join('/')}`
    : params?.slug || '';

  try {
    const categoryData = await client.query({
      query: GET_SINGLE_CATEGORY,
      variables: {
        id: '/categorie/' + slug,
      },
    });

    if (!categoryData?.data?.singleCategory) {
      return {
        notFound: true,
      };
    }

    const commonData = await fetchCommonData();

    const installationDataRes = await client.query({
      query: GET_INSTALLATION_CTA,
    });

    const installationData =
      installationDataRes?.data?.themeSettings?.optionsFields
        ?.installationCtaCard;

    const categorySlug = categoryData?.data?.singleCategory?.slug || '';

    try {
      const { products, total, facets, hasPose } =
        await fetchMeiliProductsByCategory({
          categorySlug,
          page: 1,
          limit: perPage,
        });

      console.log('Meilisearch facets:', facets);
      console.log('Category slug:', categorySlug);

      return {
        props: {
          category: categoryData.data.singleCategory,
          products,
          total,
          initialFacets: facets,
          initialHasPose: hasPose,
          installationData,
          ...commonData,
        },
        revalidate: 36000,
      };
    } catch (meilisearchError) {
      console.error('Erreur Meilisearch:', meilisearchError);
      // En cas d'erreur Meilisearch, on retourne quand même la page avec des produits vides
      return {
        props: {
          category: categoryData.data.singleCategory,
          products: [],
          total: 0,
          initialFacets: {},
          initialHasPose: false,
          installationData,
          ...commonData,
        },
        revalidate: 36000,
      };
    }
  } catch (error) {
    console.error('Erreur Apollo:', error);
    return {
      notFound: true,
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  let paths = [];
  let hasNextPage = true;
  let after = null;

  // Récupérer toutes les catégories paginées
  while (hasNextPage) {
    const { data }: any = await client.query({
      query: GET_ALL_CATEGORIES_QUERY,
      variables: {
        first: perPage, // Récupérer 100 catégories par page (limité par l'API)
        after,
      },
    });

    paths.push(
      ...data.productCategories.nodes.map((category: CategoryPageProps) => ({
        params: {
          slug: category.uri.replace(/^\//, '').split('/'), // Convertir l'URI en tableau
        },
      })),
    );

    // Mise à jour de hasNextPage et after pour la pagination
    hasNextPage = data.productCategories.pageInfo.hasNextPage;
    after = data.productCategories.pageInfo.endCursor;
  }

  return {
    paths,
    fallback: 'blocking', // Utilisation du fallback blocking
  };
};

export default CategoryPage;
