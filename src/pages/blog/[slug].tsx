import { GetStaticPaths, GetStaticProps } from 'next';

import client from '@/utils/apollo/ApolloClient';

import Layout from '@/components/Layout/Layout';
import Container from '@/components/container';
import BreadCrumbs from '@/components/atoms/BreadCrumbs';
import { fetchCommonData } from '@/utils/functions/fetchCommonData';

import { PageInfoProps, ThemeSettingsProps } from '@/types/CptTypes';
import { SimpleFooterMenuProps } from '@/components/sections/Footer/SimpleFooterMenu';
import { CategoryMenuProps } from '@/types/Categories';
import {
  FETCH_ALL_POSTS_WITH_PAGINATION,
  GET_SINGLE_POST,
} from '@/utils/gql/WEBSITE_QUERIES';
import { PostContentProps } from '@/types/Posts';
import RelatedPosts from '@/components/Post/RelatedPosts';
import PostHero from '@/components/Post/PostHero';
import Image from 'next/image';

const SinglePost = ({
  post,
  themeSettings,
  totalProducts,
  footerMenu1,
  footerMenu2,
  categoriesMenu,
}: {
  post: PostContentProps;
  themeSettings: ThemeSettingsProps;
  totalProducts?: number;
  footerMenu1: SimpleFooterMenuProps;
  footerMenu2: SimpleFooterMenuProps;
  categoriesMenu?: CategoryMenuProps[];
}) => {
  const relatedPosts = post?.productBrands?.nodes?.[0]?.posts?.nodes || [];
  return (
    <Layout
      meta={post.seo}
      categoriesMenu={categoriesMenu}
      footerMenu1={footerMenu1}
      footerMenu2={footerMenu2}
      themeSettings={themeSettings}
      totalProducts={totalProducts}
    >
      <Container>
        {post?.featuredImage && (
          <Image
            width={1000}
            height={600}
            src={post?.featuredImage?.node?.sourceUrl}
            alt={post?.title}
            className="max-h-[500px] w-full object-cover"
          />
        )}
        <div className="mt-6 md:mt-10">
          <BreadCrumbs breadCrumbs={post.seo?.breadcrumbs} />
        </div>
      </Container>
      <PostHero title={post?.title} date={post?.date} />

      <Container>
        <div
          className="wysiwyg"
          dangerouslySetInnerHTML={{
            __html: post?.content,
          }}
        />
      </Container>
      {relatedPosts?.length > 0 ? (
        <Container>
          <RelatedPosts posts={relatedPosts} currentSlug={post?.slug} />
        </Container>
      ) : (
        <div className="mt-12 lg:mt-20"></div>
      )}
    </Layout>
  );
};

export default SinglePost;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const { data } = await client.query({
      query: GET_SINGLE_POST,
      variables: { id: params?.slug },
    });

    if (!data?.post) {
      return {
        notFound: true,
      };
    }

    const commonData = await fetchCommonData();

    return {
      props: {
        post: data?.post,
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
  let allPosts: any[] = [];
  let hasNextPage = true;
  let endCursor: string | undefined | null = null;

  while (hasNextPage) {
    const {
      data,
    }: {
      data: { posts: { nodes: { slug: string }[]; pageInfo: PageInfoProps } };
    } = await client.query({
      query: FETCH_ALL_POSTS_WITH_PAGINATION,
      variables: {
        first: 50, // Nombre d'éléments à récupérer par page (ajuste selon ton besoin)
        after: endCursor,
      },
    });

    if (data?.posts?.nodes) {
      allPosts = [...allPosts, ...data.posts.nodes];
    }

    hasNextPage = data?.posts?.pageInfo?.hasNextPage;
    endCursor = data?.posts?.pageInfo?.endCursor;
  }

  const paths = allPosts.map((product) => `/blog/${product.slug}`) || [];

  return {
    paths,
    fallback: 'blocking', // Génère la page statiquement à la première demande si elle n'est pas encore générée
  };
};
