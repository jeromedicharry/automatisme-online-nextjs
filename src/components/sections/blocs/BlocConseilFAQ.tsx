import BlocIntroLarge from '@/components/atoms/BlocIntroLarge';
import CardAdvice from '@/components/cards/CardAdvice';
import { BlocConseilsFaqProps, CardConseilProps } from '@/types/blocTypes';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Navigation, Pagination } from 'swiper/modules';
import Container from '@/components/container';

const BlocConseilFAQ = ({
  bloc,
  genericAdvices,
}: {
  bloc: BlocConseilsFaqProps;
  genericAdvices: CardConseilProps[];
}) => {
  if (!bloc) return null;

  const advices = bloc.isSpecificContent ? bloc.sliderAdvices : genericAdvices;
  if (!advices || advices.length === 0) return null;
  return (
    <>
      <Container mobileFull>
        <section className="mb-12 md:mb-16 advice-slider relative">
          <BlocIntroLarge title={bloc.title} subtitle={bloc.text} />
          <Swiper
            spaceBetween={20}
            modules={[Navigation, Pagination]}
            autoHeight={false}
            navigation={{ nextEl: '.next', prevEl: '.prev' }}
            pagination={{ clickable: true }}
            wrapperClass="flex align-stretch"
          >
            {advices.map((item, key) => (
              <SwiperSlide key={key} className="">
                <CardAdvice item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
          <nav className="navigation flex gap-4 absolute z-10 right-5 bottom-2">
            <button
              className="prev rounded-full arrow bg-primary w-6 h-6 text-white"
              aria-label="Eléments précédents"
            >
              Prev
            </button>
            <button
              className="next rounded-full bg-primary w-6 h-6 text-white"
              aria-label="Eléments suivants"
            >
              Next
            </button>
          </nav>
        </section>
      </Container>
    </>
  );
};

export default BlocConseilFAQ;
