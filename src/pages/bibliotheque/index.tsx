// Components
import Layout, { DoubleLevelFooterMenuProps } from '@/components/Layout/Layout';
import Container from '@/components/container';
import BlocIntroSmall from '@/components/atoms/BlocIntroSmall';
import EmptyElement from '@/components/EmptyElement';
import Cta from '@/components/atoms/Cta';

import BlocSav from '@/components/Brand/BlocSav';
import BrandCard from '@/components/Brand/BrandCard';

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
import { useEffect, useMemo } from 'react';
import { useState, type FormEvent } from 'react';
import Fuse from 'fuse.js';
import { SearchSvg } from '@/components/sections/blocs/BlocFaq';
import client from '@/utils/apollo/ApolloClient';
import BlocIntroLarge from '@/components/atoms/BlocIntroLarge';
import VideoCard from './VideoCard';
import LoadingSpinner from '@/components/atoms/LoadingSpinner';

const PRODUCTS_PER_PAGE = 10;
const ARTICLES_PER_PAGE = 2;
const VIDEOS_PER_PAGE = 6;
const BRANDS_PER_PAGE = 10;

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

type PaginatedData<T> = {
  nodes: T[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string;
  };
};

interface PageBibliothequeProps {
  themeSettings: ThemeSettingsProps;
  totalProducts?: number;
  footerMenu1: SimpleFooterMenuProps;
  footerMenu2: SimpleFooterMenuProps;
  footerMenu3?: DoubleLevelFooterMenuProps;
  categoriesMenu?: CategoryMenuProps[];
  initialData: {
    products: PaginatedData<ProductDocsProps>;
    videos: VideoCardProps[];
    posts: PaginatedData<any>;
    productBrands: PaginatedData<any>;
  };
}

const PageBibliotheque = ({
  themeSettings,
  totalProducts,
  footerMenu1,
  footerMenu2,
  footerMenu3,
  categoriesMenu,
  initialData,
}: PageBibliothequeProps) => {
  const router = useRouter();
  const validTypes = useMemo(
    () => ['documents', 'videos', 'articles', 'marques'] as const,
    [],
  );
  type ValidType = (typeof validTypes)[number];

  const [searchTerm, setSearchTerm] = useState(
    (Array.isArray(router.query.search)
      ? router.query.search[0]
      : router.query.search) || '',
  );
  const [activeSearchTerm, setActiveSearchTerm] = useState(
    (Array.isArray(router.query.search)
      ? router.query.search[0]
      : router.query.search) || '',
  );
  const [isSearching, setIsSearching] = useState(false);
  const [selectedType, setSelectedType] = useState<ValidType | ''>(
    (router.query.type as ValidType) || '',
  );
  const [products, setProducts] = useState<PaginatedData<any>>(
    initialData.products,
  );
  const [videos] = useState(initialData.videos);
  const [displayedVideos, setDisplayedVideos] = useState(
    initialData.videos.slice(0, VIDEOS_PER_PAGE),
  );
  const [showMoreVideos, setShowMoreVideos] = useState(
    initialData.videos.length > VIDEOS_PER_PAGE,
  );

  const fuse = useMemo(
    () =>
      new Fuse(videos, {
        keys: ['title'],
        threshold: 0.4,
        distance: 100,
        useExtendedSearch: true,
      }),
    [videos],
  );

  const loadMoreVideos = () => {
    const currentLength = displayedVideos.length;
    const nextVideos = initialData.videos.slice(
      currentLength,
      currentLength + VIDEOS_PER_PAGE,
    );
    setDisplayedVideos((prev) => [...prev, ...nextVideos]);
    if (currentLength + VIDEOS_PER_PAGE >= initialData.videos.length) {
      setShowMoreVideos(false);
    }
  };
  const [articles, setArticles] = useState<PaginatedData<any>>(
    initialData.posts || {
      nodes: [],
      pageInfo: { hasNextPage: false, endCursor: '' },
    },
  );
  const [brands, setBrands] = useState<PaginatedData<any>>(
    initialData.productBrands || {
      nodes: [],
      pageInfo: { hasNextPage: false, endCursor: '' },
    },
  );
  const [loading, setLoading] = useState(false);

  // Effet pour gérer l'initialisation et les changements d'URL
  useEffect(() => {
    const type = router.query.type as ValidType;
    const search = Array.isArray(router.query.search)
      ? router.query.search[0]
      : router.query.search;

    if (type && validTypes.includes(type)) {
      setSelectedType(type);
    } else {
      setSelectedType('');
    }

    if (search !== undefined) {
      const newSearchTerm = search || '';
      setSearchTerm(newSearchTerm);
      setActiveSearchTerm(newSearchTerm);
      // Effectuer la recherche initiale si on a un terme de recherche dans l'URL
      const performSearch = async () => {
        setIsSearching(true);
        try {
          const [productsResponse, articlesResponse, brandsResponse] =
            await Promise.all([
              client.query({
                query: GET_LIBRARY_DOCUMENTS,
                variables: {
                  first: PRODUCTS_PER_PAGE,
                  after: null,
                  search: search || '',
                },
              }),
              client.query({
                query: GET_LIBRARY_ARTICLES,
                variables: {
                  first: ARTICLES_PER_PAGE,
                  after: null,
                  search: search || '',
                },
              }),
              client.query({
                query: GET_LIBRARY_BRANDS,
                variables: {
                  first: BRANDS_PER_PAGE,
                  after: null,
                  search: search || '',
                },
              }),
            ]);

          setProducts(productsResponse.data.products);
          setArticles(articlesResponse.data.posts);
          setBrands(brandsResponse.data.productBrands);

          // Recherche locale pour les vidéos
          if (!search) {
            setDisplayedVideos(videos.slice(0, VIDEOS_PER_PAGE));
            setShowMoreVideos(videos.length > VIDEOS_PER_PAGE);
          } else {
            const results = fuse.search(search).map((result) => result.item);
            setDisplayedVideos(results.slice(0, VIDEOS_PER_PAGE));
            setShowMoreVideos(results.length > VIDEOS_PER_PAGE);
          }
        } catch (error) {
          console.error('Error during search:', error);
        } finally {
          setIsSearching(false);
        }
      };

      performSearch();
    }
  }, [router.query.type, router.query.search, validTypes, videos, fuse]);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setActiveSearchTerm(searchTerm);

    // Mise à jour de l'URL avec le terme de recherche
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          search: searchTerm || undefined,
        },
      },
      undefined,
      { shallow: true },
    );

    try {
      // Recherche WordPress pour les produits
      const { data } = await client.query({
        query: GET_LIBRARY_DOCUMENTS,
        variables: {
          first: PRODUCTS_PER_PAGE,
          after: null,
          search: searchTerm,
        },
      });
      setProducts(data.products);

      // Recherche WordPress pour les articles
      const { data: articlesData } = await client.query({
        query: GET_LIBRARY_ARTICLES,
        variables: {
          first: ARTICLES_PER_PAGE,
          after: null,
          search: searchTerm,
        },
      });
      setArticles(articlesData.posts);

      // Recherche WordPress pour les marques
      const { data: brandsData } = await client.query({
        query: GET_LIBRARY_BRANDS,
        variables: {
          first: BRANDS_PER_PAGE,
          after: null,
          search: searchTerm,
        },
      });
      setBrands(brandsData.productBrands);

      // Recherche locale pour les vidéos avec Fuse.js
      if (!searchTerm.trim()) {
        setDisplayedVideos(videos.slice(0, VIDEOS_PER_PAGE));
        setShowMoreVideos(videos.length > VIDEOS_PER_PAGE);
      } else {
        const results = fuse.search(searchTerm).map((result) => result.item);
        setDisplayedVideos(results.slice(0, VIDEOS_PER_PAGE));
        setShowMoreVideos(results.length > VIDEOS_PER_PAGE);
      }
    } catch (error) {
      console.error('Error during search:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleTypeChange = (type: ValidType | '') => {
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...(searchTerm ? { search: searchTerm } : {}),
          ...(type ? { type } : {}),
        },
      },
      undefined,
      { shallow: true },
    );
  };

  const query = router.query;
  const search = Array.isArray(query.search)
    ? query.search[0]
    : query.search || '';

  const loadMoreProducts = async () => {
    if (!products.pageInfo.hasNextPage) return;

    setLoading(true);
    try {
      const { data } = await client.query({
        query: GET_LIBRARY_DOCUMENTS,
        variables: {
          first: 10,
          after: products.pageInfo.endCursor,
          search,
        },
      });

      setProducts((prev) => ({
        nodes: [...prev.nodes, ...data.products.nodes],
        pageInfo: data.products.pageInfo,
      }));
    } catch (error) {
      console.error('Error loading more products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreArticles = async () => {
    if (!articles.pageInfo.hasNextPage) return;

    setLoading(true);
    try {
      const { data } = await client.query({
        query: GET_LIBRARY_ARTICLES,
        variables: {
          first: 10,
          after: articles.pageInfo.endCursor,
          search,
        },
      });

      setArticles((prev) => ({
        nodes: [...prev.nodes, ...data.posts.nodes],
        pageInfo: data.posts.pageInfo,
      }));
    } catch (error) {
      console.error('Error loading more articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreBrands = async () => {
    if (!brands.pageInfo.hasNextPage) return;

    setLoading(true);
    try {
      const { data } = await client.query({
        query: GET_LIBRARY_BRANDS,
        variables: {
          first: 10,
          after: brands.pageInfo.endCursor,
          search,
        },
      });

      setBrands((prev) => ({
        nodes: [...prev.nodes, ...data.productBrands.nodes],
        pageInfo: data.productBrands.pageInfo,
      }));
    } catch (error) {
      console.error('Error loading more brands:', error);
    } finally {
      setLoading(false);
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
      footerMenu3={footerMenu3}
      themeSettings={themeSettings}
      categoriesMenu={categoriesMenu}
      isBg
      excludeSeo
      totalProducts={totalProducts}
    >
      <Container>
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="mb-8 md:max-w-[800px] mx-auto">
            <BlocIntroLarge
              title="Bibliothèque de documents"
              subtitle="Consultez et téléchargez nos documentations techniques et commerciales, nos contenus vidéos, nos dernières actualités ou nos marques..."
              isH1
            />
          </div>
          {/* Filtres */}
          <div className="flex gap-4 mb-8 mx-auto w-fit">
            <Cta
              handleButtonClick={(e) => {
                e.preventDefault();
                handleTypeChange('');
              }}
              variant={selectedType === '' ? 'secondary' : 'primary'}
              slug="#"
              label={'Voir tout le contenu'}
            >
              Tout
            </Cta>
            <Cta
              handleButtonClick={(e) => {
                e.preventDefault();
                handleTypeChange('documents');
              }}
              variant={selectedType === 'documents' ? 'secondary' : 'primary'}
              slug="#"
              label={'Filtrer sur les Documents'}
            >
              Documents
            </Cta>
            <Cta
              handleButtonClick={(e) => {
                e.preventDefault();
                handleTypeChange('videos');
              }}
              variant={selectedType === 'videos' ? 'secondary' : 'primary'}
              slug="#"
              label={'Filtrer sur les Vidéos'}
            >
              Vidéos
            </Cta>
            <Cta
              handleButtonClick={(e) => {
                e.preventDefault();
                handleTypeChange('articles');
              }}
              variant={selectedType === 'articles' ? 'secondary' : 'primary'}
              slug="#"
              label={'Filtrer sur les Articles'}
            >
              Articles
            </Cta>
            <Cta
              handleButtonClick={(e) => {
                e.preventDefault();
                handleTypeChange('marques');
              }}
              variant={selectedType === 'marques' ? 'secondary' : 'primary'}
              slug="#"
              label={'Filtrer sur les Marques'}
            >
              Marques
            </Cta>
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher dans la bibliothèque..."
                className="py-2 pl-4 pr-1 h-8 w-full bg-white border border-primary rounded-full text-sm placeholder:text-placeholder-grey"
              />
              <button
                type="submit"
                disabled={isSearching}
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
            {searchTerm && (
              <BlocIntroLarge title={`Résultats pour: ${activeSearchTerm}`} />
            )}
            {isSearching && (
              <div className="flex justify-center items-center min-h-[200px]">
                <LoadingSpinner />
              </div>
            )}

            {/* Contenu */}
            {(!selectedType &&
              (!products?.nodes?.length ||
                !products.nodes.some(
                  (p) =>
                    p?.acfProductDocs?.noticeTech?.node?.mediaItemUrl ||
                    p?.acfProductDocs?.productNotice?.node?.mediaItemUrl,
                )) &&
              !displayedVideos?.length &&
              !articles?.nodes?.length &&
              !brands?.nodes?.length) ||
            (selectedType === 'documents' &&
              (!products?.nodes?.length ||
                !products.nodes.some(
                  (p) =>
                    p?.acfProductDocs?.noticeTech?.node?.mediaItemUrl ||
                    p?.acfProductDocs?.productNotice?.node?.mediaItemUrl,
                ))) ||
            (selectedType === 'videos' && !displayedVideos?.length) ||
            (selectedType === 'articles' && !articles?.nodes?.length) ||
            (selectedType === 'marques' && !brands?.nodes?.length) ? (
              <div className="w-fit mx-auto text-left">
                <EmptyElement
                  title="Oups, rien à afficher ici..."
                  subtitle={`<div>Votre recherche “${searchTerm}” ne correspond à aucun résultat sur notre site.</div><br />
                <span>Assurez-vous que tous les mots sont correctement orthographiés</span><br />
                <span>Essayez des mots clés plus généraux</span>
                `}
                />
              </div>
            ) : (
              <div className="space-y-16">
                {/* Documents */}
                {(!selectedType || selectedType === 'documents') &&
                  products?.nodes &&
                  products.nodes.length > 0 &&
                  products.nodes.some(
                    (p) =>
                      p?.acfProductDocs?.noticeTech?.node?.mediaItemUrl ||
                      p?.acfProductDocs?.productNotice?.node?.mediaItemUrl,
                  ) && (
                    <section>
                      <BlocIntroSmall title="Documents techniques et guides de pose" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {products.nodes
                          .filter(
                            (product: ProductDocsProps) =>
                              product.acfProductDocs?.productNotice?.node
                                ?.mediaItemUrl ||
                              product.acfProductDocs?.noticeTech?.node
                                ?.mediaItemUrl,
                          )
                          .map((product: ProductDocsProps) => (
                            <div
                              key={product.name}
                              className="bg-white rounded-lg shadow p-4"
                            >
                              <h3 className="font-bold mb-6 md:mb-10">
                                {product.name}
                              </h3>
                              <div className="flex flex-col gap-3 md:gap-4 md:grid md:grid-cols-2">
                                {product.acfProductDocs?.noticeTech?.node
                                  ?.mediaItemUrl && (
                                  <Cta
                                    label="Fiche technique"
                                    variant="primary"
                                    slug={
                                      product.acfProductDocs.noticeTech.node
                                        .mediaItemUrl
                                    }
                                    target="_blank"
                                    size="default"
                                    isFull
                                  >
                                    Voir la fiche technique
                                  </Cta>
                                )}
                                {product.acfProductDocs?.productNotice?.node
                                  ?.mediaItemUrl && (
                                  <Cta
                                    label="Guide de pose"
                                    variant="primaryHollow"
                                    slug={
                                      product.acfProductDocs.productNotice.node
                                        .mediaItemUrl
                                    }
                                    target="_blank"
                                    size="default"
                                    isFull
                                  >
                                    Voir le guide de pose
                                  </Cta>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                      {products.pageInfo.hasNextPage && (
                        <div className="mt-8 text-center">
                          <Cta
                            label="Voir plus de produits"
                            variant="primary"
                            handleButtonClick={(e) => {
                              e.preventDefault();
                              loadMoreProducts();
                            }}
                            disabled={loading}
                            slug="#"
                          >
                            {loading
                              ? 'Chargement de produits...'
                              : 'Voir plus de produits'}
                          </Cta>
                        </div>
                      )}
                    </section>
                  )}

                {/* Vidéos */}
                {(!selectedType || selectedType === 'videos') &&
                  displayedVideos &&
                  displayedVideos.length > 0 && (
                    <section>
                      <BlocIntroSmall
                        title="Vidéos"
                        subtitle="Nos dernières vidéos"
                      />
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {displayedVideos.map(
                          (video: VideoCardProps, index: number) => (
                            <VideoCard key={index} bloc={video} />
                          ),
                        )}
                      </div>
                      {showMoreVideos && (
                        <div className="mt-8 text-center">
                          <Cta
                            label="Voir plus de vidéos"
                            variant="primary"
                            handleButtonClick={(e) => {
                              e.preventDefault();
                              loadMoreVideos();
                            }}
                            slug="#"
                          >
                            Voir plus de vidéos
                          </Cta>
                        </div>
                      )}
                    </section>
                  )}

                {/* Articles */}
                {(!selectedType || selectedType === 'articles') &&
                  articles?.nodes &&
                  articles.nodes.length > 0 && (
                    <section>
                      <BlocIntroSmall
                        title="Articles"
                        subtitle="Nos derniers articles et actualités"
                      />
                      <div>
                        <div className="grid grid-cols-1 gap-6 h-fit">
                          {articles.nodes.map((article) => (
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
                                text: article.excerpt,
                                isImageLeft: true,
                                brand: article.productBrands?.nodes[0]?.name,
                              }}
                              slug={`${article.slug}`}
                            />
                          ))}
                        </div>
                        {articles.pageInfo.hasNextPage && (
                          <div className="mt-8 text-center">
                            <Cta
                              label="Voir plus d'articles"
                              variant="primary"
                              handleButtonClick={(e) => {
                                e.preventDefault();
                                loadMoreArticles();
                              }}
                              disabled={loading}
                              slug="#"
                            >
                              {loading
                                ? 'Chargement...'
                                : "Voir plus d'articles"}
                            </Cta>
                          </div>
                        )}
                      </div>
                    </section>
                  )}

                {/* Marques */}
                {(!selectedType || selectedType === 'marques') &&
                  brands?.nodes &&
                  brands.nodes.length > 0 && (
                    <section>
                      <BlocIntroSmall
                        title="Marques"
                        subtitle="Découvrez toutes nos marques partenaires"
                      />
                      <div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                          {brands.nodes.map((brand) => (
                            <BrandCard key={brand.name} brand={brand} />
                          ))}
                        </div>
                        {brands.pageInfo.hasNextPage && (
                          <div className="mt-8 text-center">
                            <Cta
                              label="Voir plus de marques"
                              variant="primary"
                              handleButtonClick={(e) => {
                                e.preventDefault();
                                loadMoreBrands();
                              }}
                              disabled={loading}
                              slug="#"
                            >
                              {loading
                                ? 'Chargement...'
                                : 'Voir plus de marques'}
                            </Cta>
                          </div>
                        )}
                      </div>
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

  const defaultVariables = {
    first: PRODUCTS_PER_PAGE,
    after: null,
    search: '',
  };

  const articlesVariables = {
    ...defaultVariables,
    first: ARTICLES_PER_PAGE,
  };

  const brandsVariables = {
    ...defaultVariables,
    first: BRANDS_PER_PAGE,
  };

  // Fetch latest products with documents
  const { data: productsData } = await client.query({
    query: GET_LIBRARY_DOCUMENTS,
    variables: defaultVariables,
  });

  // Fetch videos
  const { data: videosData } = await client.query({
    query: GET_LIBRARY_VIDEOS,
  });

  // Fetch latest articles
  const { data: articlesData } = await client.query({
    query: GET_LIBRARY_ARTICLES,
    variables: articlesVariables,
  });

  // Fetch brands
  const { data: brandsData } = await client.query({
    query: GET_LIBRARY_BRANDS,
    variables: brandsVariables,
  });

  const initialData = {
    products: productsData.products,
    videos: videosData?.themeSettings?.optionsFields?.videoContent || [],
    posts: articlesData.posts,
    productBrands: brandsData.productBrands,
  };

  return {
    props: {
      ...commonData,
      initialData,
    },
    revalidate: 3600, // Revalidate every hour
  };
};
