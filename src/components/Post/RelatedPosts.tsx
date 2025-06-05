import React from 'react';
import BlocIntroSmall from '../atoms/BlocIntroSmall';
import BlocSAV from '../Brand/BlocSav';
import { PostCard } from '@/types/Posts';
// import Cta from '../atoms/Cta';

const RelatedPosts = ({
  posts,
  currentSlug,
}: {
  posts: PostCard[];
  currentSlug: string;
}) => {
  return (
    <section className="pt-10 pb-6 lg:pt-16 lg:pb-10">
      <BlocIntroSmall title="Articles liés" />
      <div className="mt-4 my-4 lg:my-6">
        {posts
          ?.filter((post) => post.slug !== currentSlug)
          .map((post, key) => {
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
              date: post.date,
              brand: post?.productBrands?.nodes[0]?.name,
            };
            if (key >= 2) {
              return null;
            }
            return <BlocSAV key={post.slug} bloc={bloc} slug={post.slug} />;
          })}
      </div>
      {/* <div className="flex justify-center mt-6 lg:mt-8">
        <Cta
          slug={'/blog'}
          label={'Voir tous les articles'}
          size="default"
          variant="primary"
          isFull={false}
        >
          {'Voir tous les articles'}
        </Cta>
      </div> */}
    </section>
  );
};

export default RelatedPosts;
