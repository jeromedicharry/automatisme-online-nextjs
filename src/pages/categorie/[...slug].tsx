// Imports nécessaires
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import {
  GET_ALL_CATEGORIES_QUERY,
  GET_PRODUCTS_FROM_CATEGORY,
  GET_SINGLE_CATEGORY,
} from '@/utils/gql/WOOCOMMERCE_QUERIES';
import Cardproduct from '@/components/cards/CardProduct';
import client from '@/utils/apollo/ApolloClient';
import Layout from '@/components/Layout/Layout';

import Container from '@/components/container';
import { useState } from 'react';
import { CardProductProps } from '@/types/blocTypes';
import Cta from '@/components/atoms/Cta';
import LoadingSpinner from '@/components/LoadingSpinner/LoadingSpinner.component';
import { CategoryMenuProps, CategoryPageProps } from '@/types/Categories';
import { fetchCommonData } from '@/utils/functions/fetchCommonData';
import { SimpleFooterMenuProps } from '@/components/sections/Footer/SimpleFooterMenu';

const CategoryPage = ({
  products,
  category,
  pageInfo,
  themeSettings,
  footerMenu1,
  footerMenu2,
  categoriesMenu,
}: {
  products: CardProductProps[];
  category: CategoryPageProps;
  pageInfo: any;
  themeSettings: any;
  footerMenu1: SimpleFooterMenuProps;
  footerMenu2: SimpleFooterMenuProps;
  categoriesMenu?: CategoryMenuProps[];
}) => {
  const router = useRouter();
  const [productSelection, setProductSelection] = useState(products || []);
  const [currentPageInfo, setCurrentPageInfo] = useState(pageInfo || null);
  const [isLoading, setIsLoading] = useState(false);

  if (router.isFallback) {
    return <p>Chargement...</p>;
  }

  const handleLoadMore = async () => {
    setIsLoading(true);
    const { endCursor } = currentPageInfo;
    const { products: newProducts, pageInfo: newPageInfo } =
      await getProductsSelection({
        categoryId: category?.uri,
        after: endCursor,
        first: 3,
      });

    setProductSelection((prevProducts: CardProductProps[]) =>
      prevProducts.concat(newProducts),
    );

    setCurrentPageInfo(newPageInfo);
    setIsLoading(false);
  };

  return (
    <Layout
      meta={category?.seo}
      categoriesMenu={categoriesMenu}
      uri={category?.uri}
      footerMenu1={footerMenu1}
      footerMenu2={footerMenu2}
      themeSettings={themeSettings}
    >
      <Container>
        <h1 className="my-10">Produits de la catégorie : {category?.name}</h1>
        <p>{productSelection?.length} produits trouvés</p>
        <div className="md:flex gap-4">
          <aside className="md:w-[250px] shrink-0">FILTRES</aside>
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {productSelection?.map((product: CardProductProps) => (
                <Cardproduct key={product?.databaseId} product={product} />
              ))}
            </div>
            {isLoading && <LoadingSpinner />}

            {currentPageInfo?.hasNextPage ? (
              <Cta
                label="Voir plus de produits"
                slug="#"
                variant="primary"
                additionalClass="w-fit mx-auto mt-10"
                handleButtonClick={() => handleLoadMore()}
              >
                Voir plus de produits
              </Cta>
            ) : (
              <p>{"Pas d'autres produits à montrer"}</p>
            )}
          </section>
        </div>
      </Container>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = Array.isArray(params?.slug)
    ? `${params.slug.join('/')}` // Ajoute les barres obliques aux deux extrémités
    : params?.slug || '';

  const categoryData =
    (await client.query({
      query: GET_SINGLE_CATEGORY,
      variables: {
        id: '/categorie/' + slug,
      },
    })) || null;

  if (!categoryData) {
    return {
      notFound: true, // Si la catégorie n'existe pas
    };
  }

  const commonData = await fetchCommonData();

  const { products, pageInfo } =
    (await getProductsSelection({
      categoryId: '/categorie/' + slug,
      first: 3, // Nombre de produits par page
      after: null, // Si nous avons un after, on l'ajoute pour la pagination
    })) || null;

  return {
    props: {
      category: categoryData.data.singleCategory,
      products,
      pageInfo,
      ...commonData,
    },
    revalidate: 60,
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
        first: 50, // Récupérer 100 catégories par page (limité par l'API)
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

export const getProductsSelection = async ({
  categoryId = '',
  filters = [],
  first = 36,
  after = null,
}) => {
  try {
    const { data, loading, error } = await client.query({
      query: GET_PRODUCTS_FROM_CATEGORY,
      variables: {
        id: categoryId,
        first,
        after,
        filters: filters, // La chaîne doit être convertie en tableau d'objets JSON
      },
    });

    return {
      products: data.productCategory.products.nodes,
      pageInfo: data.productCategory.products.pageInfo,
      loading,
      error,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des produits :', error);
    return { products: [], pageInfo: null };
  }
};
