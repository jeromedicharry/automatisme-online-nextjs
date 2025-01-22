import BlocIntroLarge from '@/components/atoms/BlocIntroLarge';
import CardAdvice from '@/components/cards/CardAdvice';
import {
  BlocConseilsFaqProps,
  CardConseilProps,
  FeaturedFaqProps,
} from '@/types/blocTypes';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Navigation, Pagination } from 'swiper/modules';
import Container from '@/components/container';
import CardFeaturedFaq from '@/components/cards/CardFeaturedFaq';
import Cta from '@/components/atoms/Cta';
import SliderPrevNextButton from '@/components/atoms/SliderPrevNextButton';

const BlocConseilFAQ = ({
  bloc,
  genericAdvices,
  featuredFaq,
}: {
  bloc: BlocConseilsFaqProps;
  genericAdvices: CardConseilProps[];
  featuredFaq: FeaturedFaqProps;
}) => {
  if (!bloc) return null;

  const advices = bloc.isSpecificContent ? bloc.sliderAdvices : genericAdvices;
  if (!advices || advices.length === 0) return null;

  return (
    <>
      <Container mobileFull>
        <section className="advice-slider relative">
          <BlocIntroLarge title={bloc.title} subtitle={bloc.text} />
          <Swiper
            spaceBetween={20}
            modules={[Navigation, Pagination]}
            autoHeight={false}
            navigation={{ nextEl: '.nextService', prevEl: '.prevService' }}
            pagination={{ clickable: true }}
            wrapperClass="flex align-stretch"
          >
            {advices.map((item, key) => (
              <SwiperSlide key={key} className="">
                <CardAdvice item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
          <nav className="navigation flex gap-3 absolute z-10 right-2 bottom-2">
            <SliderPrevNextButton
              type="prev"
              classSelector="prevService"
              size="small"
              variant="white"
              ariaLabel="Questions précédentes"
            />
            <SliderPrevNextButton
              type="next"
              classSelector="nextService"
              size="small"
              variant="primary"
              ariaLabel="Questions suivantes"
            />
          </nav>
        </section>
      </Container>
      <Container>
        <section className="mt-5 relative faq-slider mb-12 md:mb-16">
          <Swiper
            spaceBetween={20}
            slidesPerView={'auto'}
            modules={[Navigation]}
            autoHeight={false}
            navigation={{ nextEl: '.nextFaq', prevEl: '.prevFaq' }}
            wrapperClass="flex align-stretch"
          >
            {featuredFaq?.items?.map((item, key) => (
              <SwiperSlide key={key} className="">
                <CardFeaturedFaq
                  item={item}
                  title={featuredFaq.title}
                  index={key}
                />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="flex items-center justify-between md:justify-center w-full max-md:relative mt-5">
            <Cta
              label={featuredFaq.ctaLabel}
              slug={featuredFaq.ctaSlug}
              size="default"
              variant="secondary"
            >
              {featuredFaq.ctaLabel}
            </Cta>
            <nav className="navigation flex gap-4 z-10 right-5 md:absolute md:bottom-0">
              <SliderPrevNextButton
                type="prev"
                classSelector="prevFaq"
                variant="white"
                ariaLabel="Questions précédentes"
              />
              <SliderPrevNextButton
                type="next"
                classSelector="nextFaq"
                variant="primary"
                ariaLabel="Questions suivantes"
              />
            </nav>
          </div>
        </section>
      </Container>
    </>
  );
};

export default BlocConseilFAQ;
