import BlocIntroSmall from '@/components/atoms/BlocIntroSmall';
import Container from '@/components/container';
import { BlocFeaturedCategoriesProps } from '@/types/blocTypes';
import React from 'react';

const BlocFeaturedCategories = ({
  bloc,
}: {
  bloc: BlocFeaturedCategoriesProps;
}) => {
  return (
    <Container>
      <section>
        <BlocIntroSmall title={bloc.title} subtitle={bloc.subtitle} />
        <div className="grid grid-cols-2 lg:grid-cols-4 items-center justify-center gap-x-3 gap-y-4 lg:gap-5"></div>
      </section>
    </Container>
  );
};

export default BlocFeaturedCategories;
