// Imports nécessaires
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import {
  GET_ALL_CATEGORIES_QUERY,
  GET_SINGLE_CATEGORY,
} from '@/utils/gql/WOOCOMMERCE_QUERIES';
import client from '@/utils/apollo/ApolloClient';
import Layout from '@/components/Layout/Layout';

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

interface Filters {
  [key: string]: string;
}

const CategoryPage = ({
  products,
  category,
  total,
  themeSettings,
  footerMenu1,
  footerMenu2,
  categoriesMenu,
  initialFacets,
  installationData,
}: {
  products: CardProductMeilisearchProps[];
  category: CategoryPageProps;
  total: number;
  themeSettings: ThemeSettingsProps;
  footerMenu1: SimpleFooterMenuProps;
  footerMenu2: SimpleFooterMenuProps;
  categoriesMenu?: CategoryMenuProps[];
  initialFacets: any;
  installationData: installationData;
}) => {
  const router = useRouter();
  const [productSelection, setProductSelection] = useState(products || []);
  const [currentTotal, setCurrentTotal] = useState(total);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(products.length < total);
  const [facets, setFacets] = useState(initialFacets);

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
    setCurrentTotal(total);
  }, [products, total, initialFacets]);

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
      uri={category?.uri}
      footerMenu1={footerMenu1}
      footerMenu2={footerMenu2}
      themeSettings={themeSettings}
      isBg
    >
      <Container>
        <BreadCrumbs breadCrumbs={category?.seo?.breadcrumbs} />
        <BlocIntroLarge
          title={category?.name}
          subtitle={category?.description}
          isH1
          isDescriptionFontNormal
        />
        <div className="flex flex-col items-start md:flex-row gap-4 mb-10 md:mb-16">
          <FilterSidebar facetDistribution={facets} />
          <section className="max-md:w-full overflow-hidden">
            <div className="flex justify-between mb-6 md:mb-4">
              <p className="text-sm md:text-base leading-general text-dark-grey">
                {currentTotal} produits trouvés
              </p>
              <form className="flex items-center gap-4 sortForm">
                <label htmlFor="sort">Trier par:</label>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto w-fit items-stretch">
              {productSelection?.map(
                (product: CardProductMeilisearchProps, index) => (
                  <React.Fragment key={product?.id}>
                    <CardProductMeilisearch product={product} />
                    {index === 1 && (
                      <CardInstallation installation={installationData} />
                    )}
                  </React.Fragment>
                ),
              )}
            </div>
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
      </Container>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = Array.isArray(params?.slug)
    ? `${params.slug.join('/')}`
    : params?.slug || '';

  const categoryData = await client.query({
    query: GET_SINGLE_CATEGORY,
    variables: {
      id: '/categorie/' + slug,
    },
  });

  if (!categoryData) {
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

  const { products, total, facets } = await fetchMeiliProductsByCategory({
    categorySlug,
    page: 1,
    limit: perPage,
  });

  return {
    props: {
      category: categoryData.data.singleCategory,
      products,
      total,
      initialFacets: facets,
      installationData,
      ...commonData,
    },
    revalidate: 3600,
  };
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
