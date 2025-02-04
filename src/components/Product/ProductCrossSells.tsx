import { CardProductProps } from '@/types/blocTypes';
import BlocIntroSmall from '../atoms/BlocIntroSmall';
import SliderPrevNextButton from '../atoms/SliderPrevNextButton';
import { Swiper, SwiperSlide } from 'swiper/react';
import Cardproduct from '../cards/CardProduct';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
const ProductCrossSells = ({
  crossSellProducts,
}: {
  crossSellProducts: CardProductProps[];
}) => {
  if (!crossSellProducts || crossSellProducts.length === 0) return null;

  return (
    <section className="mb-16">
      <BlocIntroSmall title="Produits liés" />
      <div className="bg-primary-light p-4 rounded-2xl">
        <div className="intermediate-cart-products-slider">
          <div className="overflow-hidden relative pb-12 lg:pb-16">
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
              wrapperClass="px-2 pt-4 pb-5 flex item-stretch"
            >
              {crossSellProducts.map((product, key) => (
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
  );
};

export default ProductCrossSells;
