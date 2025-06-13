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
import Script from 'next/script';

const BlocFeaturedProducts = ({
  bloc,
}: {
  bloc: BlocFeaturedProductsProps;
}) => {
  if (
    !bloc ||
    !bloc.products ||
    !bloc.products.nodes ||
    bloc.products.nodes.length === 0
  )
    return null;

  return (
    <Container>
      <section className="mb-12 md:mb-16 featured-products-slider">
        <div className="max-md:max-w-md mx-auto xl:w-full">
          <BlocIntroSmall title={bloc.title} subtitle={bloc.subtitle} />

          <div className="bg-primary-light md:flex rounded-t-xl md:rounded-2xl overflow-hidden">
            {bloc.image?.node?.sourceUrl && (
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
            )}
            <div className="pl-2 pr-4 pt-4 pb-12 overflow-hidden relative">
              <Swiper
                spaceBetween={20}
                modules={[Navigation]}
                breakpoints={{
                  0: {
                    slidesPerView: 'auto',
                  },
                  540: {
                    slidesPerView: 'auto',
                  },
                }}
                autoHeight={false}
                navigation={{ nextEl: '.next', prevEl: '.prev' }}
                wrapperClass="px-2 pt-4 pb-8 md:pb-8 flex item-stretch"
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
      <Script
        defer
        strategy="afterInteractive"
        src="https://widgets.rr.skeepers.io/product/076a2ab0-6d91-8ec4-1dc0-ff5c0501b805/14849b72-094b-478b-a7a8-23978e2bb2de.js"
        charSet="utf-8"
      />
    </Container>
  );
};

export default BlocFeaturedProducts;
