import React from 'react';
import BlocIntroSmall from '../atoms/BlocIntroSmall';
import Container from '../container';
import { BlocSeoProps } from '@/types/blocTypes';
import { CategoryMenuProps } from '@/types/Categories';
import Link from 'next/link';

const BlocSeoCategories = ({
  categories,
  bloc,
}: {
  categories?: CategoryMenuProps[];
  bloc: BlocSeoProps;
}) => {
  return (
    <section className="mb-12 md:mb-16">
      <Container>
        <BlocIntroSmall title={bloc.title} subtitle={bloc.subtitle} />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-top justify-center gap-x-3 gap-y-4 lg:gap-5">
          {categories?.map((category: any, key: number) => (
            <div key={key}>
              <h3 className="font-bold text-primary duration-300 hover:text-secondary">
                <Link href={category.uri}>{category.name}</Link>
              </h3>
              <div className="flex flex-col gap-1 mt-2">
                {category.children?.nodes?.map(
                  (subCategory: any, key: number) =>
                    key <= 8 ? (
                      <Link
                        key={key}
                        href={subCategory.uri}
                        className="text-dark-grey text-sm duration-300 hover:text-primary max-md:text-xs leading-general"
                      >
                        {subCategory.name}
                      </Link>
                    ) : null,
                )}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default BlocSeoCategories;
