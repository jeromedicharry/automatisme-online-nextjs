import BlocIntroSmall from '@/components/atoms/BlocIntroSmall';
import Container from '@/components/container';
import { BlocFeaturedCategoriesProps } from '@/types/blocTypes';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const BlocFeaturedCategories = ({
  bloc,
}: {
  bloc: BlocFeaturedCategoriesProps;
}) => {
  if (!bloc || !bloc.categories || bloc.categories.nodes.length === 0)
    return null;

  // todo manage link slug
  // manage image size (need image first)
  return (
    <Container>
      <section className="mb-12 md:mb-16">
        <div className="w-fit mx-auto lg:w-full">
          <BlocIntroSmall title={bloc.title} subtitle={bloc.subtitle} />
          <div className="grid grid-cols-2 lg:grid-cols-4 items-top justify-center gap-x-3 gap-y-4 lg:gap-5">
            {bloc.categories.nodes.map((category, key) => (
              <Link
                key={key}
                href={`/categories/${category.slug}`}
                className="bloc group w-fill max-w-[168px] sm:max-w-[250px]"
              >
                <div className="px-3 py-2 bg-secondary-light rounded-[9px] group-hover:shadow-card duration-300 w-full h-[168px] md:h-[160px] flex items-center justify-center">
                  <Image
                    src={
                      category.image?.sourceUrl ||
                      '/images/logo-automatisme-online.png'
                    }
                    alt={category.name}
                    width={160}
                    height={190}
                    className="max-w-full max-h-full object-cover"
                  />
                </div>
                <h3 className="mt-[10px] font-medium text-sm leading-general group-hover:text-secondary duration-300">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Container>
  );
};

export default BlocFeaturedCategories;
