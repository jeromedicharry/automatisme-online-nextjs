'use client';

import { useState } from 'react';
import { Pagination, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import Image from 'next/image';
import ProDiscountBadge from '../atoms/ProDiscountBadge';

const ProductGalerie = ({
  galleryImages,
  hasProDiscount,
  discountRate,
}: {
  galleryImages: { nodes: { sourceUrl: string }[] };
  hasProDiscount?: boolean;
  discountRate?: number;
}) => {
  const images = [...galleryImages.nodes];
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  return (
    <section className="w-full relative">
      {hasProDiscount && (
        <div className="absolute top-4 right-4 z-10 md:top-6 md:right-6">
          <ProDiscountBadge discountRate={discountRate} />
        </div>
      )}
      {/* Slider principal */}
      <Swiper
        modules={[Pagination, Thumbs]}
        pagination={{
          clickable: true,
          el: '.custom-pagination',
        }}
        thumbs={{ swiper: thumbsSwiper }}
        className="w-full"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="w-full product-gallery-item">
            <figure className="relative max-w-sm xl:max-w-[520px] flex justify-center">
              <Image
                src={image.sourceUrl}
                width={600}
                height={600}
                alt={`Produit automatisme Online ${index + 1}`}
                className="aspect-square object-contain lg:max-w-[450px] mx-auto max-md:max-w-[280px]"
              />
            </figure>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="custom-pagination mt-4 md:hidden"></div>

      {/* Thumbnails pour laptop */}
      {images?.length > 1 && (
        <div className="hidden md:block mt-4">
          <Swiper
            modules={[Thumbs]}
            onSwiper={setThumbsSwiper}
            slidesPerView={4}
            spaceBetween={10}
            wrapperClass="flex gap-2 items-center justify-center"
          >
            {images.map((image, index) => (
              <SwiperSlide key={index} className="max-w-12">
                <Image
                  src={image?.sourceUrl}
                  width={100}
                  height={100}
                  alt={`Automatisme Online miniature ${index + 1}`}
                  className="max-w-full w-12 aspect-square object-contain rounded-lg border border-primary cursor-pointer hover:border-secondary duration-300"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Pagination (uniquement visible sur mobile) */}
    </section>
  );
};

export default ProductGalerie;
