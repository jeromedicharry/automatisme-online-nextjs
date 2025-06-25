// Components
import Layout from '@/components/Layout/Layout';
import Container from '@/components/container';
import BlocIntroSmall from '@/components/atoms/BlocIntroSmall';
import EmptyElement from '@/components/EmptyElement';
import Cta from '@/components/atoms/Cta';
import BlocSav from '@/components/Brand/BlocSav';

// Types
import type { GetStaticProps } from 'next';
import { fetchCommonData } from '@/utils/functions/fetchCommonData';
import { SimpleFooterMenuProps } from '@/components/sections/Footer/SimpleFooterMenu';
import { CategoryMenuProps } from '@/types/Categories';
import { ThemeSettingsProps } from '@/types/CptTypes';

// GraphQL
import {
  GET_LIBRARY_DOCUMENTS,
  GET_LIBRARY_VIDEOS,
  GET_LIBRARY_ARTICLES,
  GET_LIBRARY_BRANDS,
} from '@/utils/gql/WEBSITE_QUERIES';

// Hooks
import { useRouter } from 'next/router';
import { type FormEvent } from 'react';
import client from '@/utils/apollo/ApolloClient';
import BlocIntroLarge from '@/components/atoms/BlocIntroLarge';
import { SearchSvg } from '@/components/sections/blocs/BlocFaq';
import VideoCard from './VideoCard';

interface ProductDocsProps {
  name: string;
  acfProductDocs: {
    noticeTech: {
      node: {
        mediaItemUrl: string;
      };
    };
    productNotice: {
      node: {
        mediaItemUrl: string;
      };
    };
  };
}

export interface VideoCardProps {
  title: string;
  videoId: string;
  image: {
    node: {
      sourceUrl: string;
    };
  };
}

interface PageBibliothequeProps {
  themeSettings: ThemeSettingsProps;
  totalProducts?: number;
  footerMenu1: SimpleFooterMenuProps;
  footerMenu2: SimpleFooterMenuProps;
  categoriesMenu?: CategoryMenuProps[];
  products: ProductDocsProps[];
  videos: VideoCardProps[];
  articles: any[];
  brands: any[];
  currentPage: number;
  totalPages: {
    documents: number;
    videos: number;
    articles: number;
    marques: number;
  };
  itemsPerPage?: number;
}

const PageBibliotheque = ({
  themeSettings,
  totalProducts,
  footerMenu1,
  footerMenu2,
  categoriesMenu,
  products,
  videos,
  articles,
  brands,
  currentPage,
  totalPages,
}: PageBibliothequeProps) => {
  const router = useRouter();
  const query = router.query;
  const validTypes = ['documents', 'videos', 'articles', 'marques'] as const;
  const type = Array.isArray(query.type)
    ? query.type[0]
    : query.type || 'documents';
  const search = Array.isArray(query.search)
    ? query.search[0]
    : query.search || '';
  const page = Array.isArray(query.page) ? query.page[0] : query.page || '1';
  const currentType = validTypes.includes(type as any)
    ? (type as (typeof validTypes)[number])
    : 'documents';
  const showPagination = currentPage < (totalPages[currentType] || 1);

  // Mise à jour de l'URL quand les filtres changent
  const updateUrl = (
    newType?: string,
    newSearch?: string,
    newPage?: string,
  ) => {
    const query: { [key: string]: string } = {};

    const validType =
      newType && validTypes.includes(newType as any) ? newType : type;
    const validPage = newPage && !isNaN(parseInt(newPage)) ? newPage : page;
    const validSearch = typeof newSearch === 'string' ? newSearch : search;

    if (validType) query.type = validType;
    if (validSearch) query.search = validSearch;
    if (validPage !== '1') query.page = validPage;

    router.push(
      {
        pathname: '/bibliotheque',
        query,
      },
      undefined,
      { shallow: true },
    );
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchValue = (formData.get('search') as string)?.trim();
    if (searchValue !== search) {
      updateUrl(currentType, searchValue, '1');
    }
  };

  return (
    <Layout
      meta={{
        title: 'Bibliothèque technique Automatisme Online',
        metaDesc:
          'Consultez et téléchargez nos documentations techniques et commerciales, nos contenus vidéos, nos dernières actualités ou nos marques...',
      }}
      uri={'/bibliotheque'}
      footerMenu1={footerMenu1}
      footerMenu2={footerMenu2}
      themeSettings={themeSettings}
      categoriesMenu={categoriesMenu}
      isBg
      excludeSeo
      totalProducts={totalProducts}
    >
      <Container>
        <div className="py-8 md:py-12">
          <div className="md:max-w-[800px] mx-auto">
            <BlocIntroLarge
              title="Bibliothèque de documents"
              subtitle="Consultez et téléchargez nos documentations techniques et commerciales, nos contenus vidéos, nos dernières actualités ou nos marques..."
              isH1
            />
          </div>
          {/* Filtres */}
          <div className="flex flex-wrap justify-center gap-4 mb-8 md:mb-12">
            <div className="w-fit">
              <Cta
                label="Documents"
                variant={type === 'documents' ? 'secondary' : 'primary'}
                handleButtonClick={() =>
                  updateUrl('documents', search as string, '1')
                }
                slug="#"
              >
                Documents
              </Cta>
            </div>
            <div className="w-fit">
              <Cta
                label="Vidéos"
                variant={type === 'videos' ? 'secondary' : 'primary'}
                handleButtonClick={() =>
                  updateUrl('videos', search as string, '1')
                }
                slug="#"
              >
                Vidéos
              </Cta>
            </div>
            <div className="w-fit">
              <Cta
                label="Articles"
                variant={type === 'articles' ? 'secondary' : 'primary'}
                handleButtonClick={() =>
                  updateUrl('articles', search as string, '1')
                }
                slug="#"
              >
                Articles
              </Cta>
            </div>
            <div className="w-fit">
              <Cta
                label="Marques"
                variant={type === 'marques' ? 'secondary' : 'primary'}
                handleButtonClick={() =>
                  updateUrl('marques', search as string, '1')
                }
                slug="#"
              >
                Marques
              </Cta>
            </div>
          </div>

          {/* Recherche */}
          <form
            onSubmit={handleSearch}
            className="mb-3 md:max-w-[670px] mx-auto"
          >
            <div className="relative">
              <input
                type="text"
                name="search"
                defaultValue={search}
                placeholder="Rechercher dans la bibliothèque..."
                className="py-2 pl-4 pr-1 h-8 w-full bg-white border border-primary rounded-full text-sm placeholder:text-placeholder-grey"
              />
              <button
                type="submit"
                className="rounded-full bg-secondary w-6 h-6 text-white hover:bg-secondary-dark duration-300 absolute right-1 flex items-center justify-center top-[50%] transform -translate-y-1/2"
              >
                <SearchSvg />
              </button>
            </div>
          </form>
        </div>
      </Container>

      <div className="bg-white">
        <Container>
          <div className="py-6">
            {/* Contenu */}
            {!products.length &&
            !videos.length &&
            !articles.length &&
            !brands.length ? (
              <EmptyElement
                title="Aucun contenu disponible"
                subtitle="Aucun contenu n'a été trouvé dans la bibliothèque"
              />
            ) : (
              <div className="space-y-16">
                {/* Documents */}
                {products.length > 0 && (
                  <section>
                    <BlocIntroSmall title="Documents techniques et guides de pose" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {products.map((product: ProductDocsProps) => (
                        <div
                          key={product.name}
                          className="bg-white rounded-lg shadow p-4"
                        >
                          <h3 className="font-bold mb-4">{product.name}</h3>
                          <div className="space-y-2">
                            {product.acfProductDocs?.productNotice?.node
                              ?.mediaItemUrl && (
                              <a
                                href={
                                  product.acfProductDocs.productNotice.node
                                    .mediaItemUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-primary hover:underline"
                              >
                                Notice produit
                              </a>
                            )}
                            {product.acfProductDocs?.noticeTech?.node
                              ?.mediaItemUrl && (
                              <a
                                href={
                                  product.acfProductDocs.noticeTech.node
                                    .mediaItemUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-primary hover:underline"
                              >
                                Notice technique
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {showPagination && (
                      <div className="mt-8 text-center">
                        <Cta
                          label="Voir plus"
                          variant="primary"
                          slug={`/bibliotheque?type=${type}&page=${Number(page) + 1}${search ? `&search=${search}` : ''}`}
                        >
                          Voir plus
                        </Cta>
                      </div>
                    )}
                  </section>
                )}

                {/* Vidéos */}
                {videos.length > 0 && (
                  <section>
                    <BlocIntroSmall
                      title="Vidéos Automatisme Online"
                      subtitle="Les dernières vidéos de nos produits, conseils et actualités"
                    />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {videos.map((video: VideoCardProps, index: number) => (
                        <VideoCard key={index} bloc={video} />
                      ))}
                    </div>
                    {showPagination && (
                      <div className="mt-8 text-center">
                        <Cta
                          label="Voir plus"
                          variant="primary"
                          slug={`/bibliotheque?type=${type}&page=${Number(page) + 1}${search ? `&search=${search}` : ''}`}
                        >
                          Voir plus
                        </Cta>
                      </div>
                    )}
                  </section>
                )}

                {/* Articles */}
                {articles.length > 0 && (
                  <section>
                    <BlocIntroSmall
                      title="Articles"
                      subtitle="Nos derniers articles et actualités"
                    />
                    <div className="grid grid-cols-1 gap-6 h-fit">
                      {articles.map(
                        (article: {
                          title: string;
                          slug: string;
                          date: string;
                          featuredImage?: { node?: { sourceUrl?: string } };
                        }) => (
                          <BlocSav
                            key={article.slug}
                            bloc={{
                              title: article.title,
                              image: {
                                node: {
                                  sourceUrl:
                                    article.featuredImage?.node?.sourceUrl ||
                                    '/images/placeholder.jpg',
                                },
                              },
                              date: article.date,
                              text: '',
                              isImageLeft: false,
                            }}
                            slug={`/actualites/${article.slug}`}
                          />
                        ),
                      )}
                    </div>
                    {showPagination && (
                      <div className="mt-8 text-center">
                        <Cta
                          label="Voir plus"
                          variant="primary"
                          slug={`/bibliotheque?type=${type}&page=${Number(page) + 1}${search ? `&search=${search}` : ''}`}
                        >
                          Voir plus
                        </Cta>
                      </div>
                    )}
                  </section>
                )}

                {/* Marques */}
                {brands.length > 0 && (
                  <section>
                    <BlocIntroSmall
                      title="Marques"
                      subtitle="Découvrez toutes nos marques partenaires"
                    />
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      {brands.map((brand: any) => (
                        <a
                          key={brand.slug}
                          href={`/marque/${brand.slug}`}
                          className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow"
                        >
                          {brand.brandFields?.logo?.node?.sourceUrl ? (
                            <img
                              src={brand.brandFields.logo.node.sourceUrl}
                              alt={brand.name}
                              className="w-full h-auto object-contain"
                            />
                          ) : (
                            <div className="text-center font-bold">
                              {brand.name}
                            </div>
                          )}
                        </a>
                      ))}
                    </div>
                    {brands.length > 20 && (
                      <div className="mt-8 text-center">
                        <Cta
                          label="Voir plus"
                          variant="primary"
                          slug={`/bibliotheque?type=${type}&page=${Number(page) + 1}${search ? `&search=${search}` : ''}`}
                        >
                          Voir plus
                        </Cta>
                      </div>
                    )}
                  </section>
                )}
              </div>
            )}
          </div>
        </Container>
      </div>
    </Layout>
  );
};

export default PageBibliotheque;

export const getStaticProps: GetStaticProps = async () => {
  const commonData = await fetchCommonData();

  // Paramètres par défaut pour le chargement initial
  const type = null as string | null;
  const search = '';
  const page = '1';

  // Fetch latest products with documents
  const { data: productsData } = await client.query({
    query: GET_LIBRARY_DOCUMENTS,
    variables: { search },
  });

  // Fetch videos
  const { data: videosData } = await client.query({
    query: GET_LIBRARY_VIDEOS,
  });

  // Fetch latest articles
  const { data: articlesData } = await client.query({
    query: GET_LIBRARY_ARTICLES,
    variables: { search },
  });

  // Fetch brands
  const { data: brandsData } = await client.query({
    query: GET_LIBRARY_BRANDS,
    variables: { search },
  });

  const currentPage = Math.max(1, parseInt(page as string) || 1);
  const itemsPerPage = 10; // Nombre d'éléments par page

  // Filtrer les données en fonction du type sélectionné
  const filteredData = {
    documents: (productsData?.products?.nodes || [])
      .filter(
        (product: ProductDocsProps) =>
          product.acfProductDocs?.productNotice?.node?.mediaItemUrl ||
          product.acfProductDocs?.noticeTech?.node?.mediaItemUrl,
      )
      .slice(0, 10),
    videos: videosData?.themeSettings?.optionsFields?.videoContent || [],
    articles: articlesData?.posts?.nodes || [],
    marques: brandsData?.productBrands?.nodes || [],
  };

  // Calcul du nombre total de pages pour chaque type
  const totalPages = {
    documents: Math.ceil(filteredData.documents.length / itemsPerPage),
    videos: Math.ceil(filteredData.videos.length / itemsPerPage),
    articles: Math.ceil(filteredData.articles.length / itemsPerPage),
    marques: Math.ceil(filteredData.marques.length / itemsPerPage),
  };

  // Pagination des données
  const paginateData = (data: any[], page: number) => {
    if (!Array.isArray(data)) return [];
    const validPage = Math.max(1, page);
    const start = (validPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return data.slice(start, end);
  };

  // Données filtrées et paginées
  const paginatedData = {
    products:
      !type || type === 'documents'
        ? paginateData(filteredData.documents, currentPage)
        : [],
    videos:
      !type || type === 'videos'
        ? paginateData(filteredData.videos, currentPage)
        : [],
    articles:
      !type || type === 'articles'
        ? paginateData(filteredData.articles, currentPage)
        : [],
    brands:
      !type || type === 'marques'
        ? paginateData(filteredData.marques, currentPage)
        : [],
  };

  return {
    props: {
      ...commonData,
      ...paginatedData,
      currentPage,
      totalPages,
    },
    revalidate: 3600, // Revalidate every hour
  };
};
