import Container from '@/components/container';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Navigation } from 'swiper/modules';
import RelatedBrandCard from './RelatedBrandCard';
import SliderPrevNextButton from '@/components/atoms/SliderPrevNextButton';

const RelatedBrands = ({ brands }) => {
  return (
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
          {brands?.map((item, key) => (
            <SwiperSlide key={key} className="">
              <RelatedBrandCard brand={item} index={key} />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="flex items-center justify-between md:justify-center w-full max-md:relative mt-5">
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
  );
};

export default RelatedBrands;
