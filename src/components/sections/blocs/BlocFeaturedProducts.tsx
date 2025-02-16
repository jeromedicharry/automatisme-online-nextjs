import BlocIntroSmall from '@/components/atoms/BlocIntroSmall';
import Container from '@/components/container';
import { BlocFeaturedProductsProps } from '@/types/blocTypes';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';

import Cardproduct from '@/components/cards/CardProduct';
import SliderPrevNextButton from '@/components/atoms/SliderPrevNextButton';

const BlocFeaturedProducts = ({
  bloc,
}: {
  bloc: BlocFeaturedProductsProps;
}) => {
  if (!bloc || !bloc.products || bloc.products.nodes.length === 0) return null;

  // todo manage link slug
  // todo manage arrows design and logic active inactive hover etc + make a component for arrows nav
  return (
    <Container>
      <section className="mb-12 md:mb-16 featured-products-slider">
        <div className="max-md:max-w-md mx-auto xl:w-full">
          <BlocIntroSmall title={bloc.title} subtitle={bloc.subtitle} />

          <div className="bg-primary-light md:flex rounded-t-xl md:rounded-2xl overflow-hidden">
            <div className="shrink-0">
              <Image
                src={bloc.image?.node?.sourceUrl}
                alt={bloc.title}
                width={380}
                height={579}
                className="max-md:hidden aspect-card-featured-laptop h-full object-cover"
              ></Image>
              <Image
                src={bloc.image?.node?.sourceUrl}
                alt={bloc.title}
                width={700}
                height={408}
                className="md:hidden aspect-card-featured-mobile object-cover"
              ></Image>
            </div>
            <div className="pl-2 pr-4 pt-4 pb-12 overflow-hidden relative">
              <Swiper
                spaceBetween={20}
                modules={[Navigation]}
                breakpoints={{
                  0: {
                    slidesPerView: 1.2,
                  },
                  540: {
                    slidesPerView: 'auto',
                  },
                }}
                autoHeight={false}
                navigation={{ nextEl: '.next', prevEl: '.prev' }}
                wrapperClass="px-2 pt-4 pb-5 md:pb-8 flex item-stretch"
              >
                {bloc.products.nodes.map((product, key) => (
                  <SwiperSlide key={key}>
                    <Cardproduct product={product} />
                  </SwiperSlide>
                ))}
              </Swiper>
              <nav className="navigation flex gap-3 absolute right-4 md:right-6 bottom-5">
                <SliderPrevNextButton
                  type="prev"
                  variant="white"
                  ariaLabel="Produits précédents"
                  classSelector="prev"
                />
                <SliderPrevNextButton
                  type="next"
                  variant="primary"
                  ariaLabel="Produits suivants"
                  classSelector="next"
                />
              </nav>
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
};

export default BlocFeaturedProducts;
