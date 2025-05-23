import React from 'react';
import Container from '../container';
import BlocIntroLarge from '../atoms/BlocIntroLarge';
import { formatDate } from '@/utils/functions/functions';

const PostHero = ({ title, date }: { title: string; date: string }) => {
  return (
    <>
      <section className="mt-10 lg:mt-20">
        <Container>
          <div className="text-primary mb-6 lg:mb-8">
            <BlocIntroLarge title={title} isH1 />
            <div className="text-lg mb-5 lg:mb-7 capitalize text-grey font-bold">
              {formatDate(date)}
            </div>
          </div>
        </Container>
      </section>
      <div id="next"></div>
    </>
  );
};

export default PostHero;
