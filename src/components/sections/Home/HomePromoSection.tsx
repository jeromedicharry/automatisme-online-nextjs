import { PromotionSlideProps } from '@/types/blocTypes';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Pagination } from 'swiper/modules';
import Image from 'next/image';
import Container from '@/components/container';
import Link from 'next/link';

const HomePromoSection = ({
  mainSlider,
  secondarySlider,
}: {
  mainSlider: PromotionSlideProps[];
  secondarySlider: PromotionSlideProps[];
}) => {
  if (!mainSlider || mainSlider.length === 0) return null;
  return (
    <section className="mb-12 md:mb-16">
      <Container>
        <div className="flex flex-col gap-2 md:flex-row max-md:max-w-md mx-auto md:items-stretch lg:h-[330px] xxl:h-[420px]">
          <div className="mainPromoSlider md:max-w-[69.4%] md:shrink-1 overflow-hidden h-full">
            <Swiper
              slidesPerView={1}
              spaceBetween={0}
              loop={true}
              pagination={{
                clickable: true,
              }}
              modules={[Pagination]}
            >
              {mainSlider.map((item, key) => (
                <SwiperSlide key={key}>
                  <Link href={item.slug || '/'} className="block h-full">
                    <Image
                      src={item.imageMobile?.node?.sourceUrl}
                      alt="Image promotionnelle Automatisme Online"
                      width={600}
                      height={600}
                      className="object-cover md:hidden aspect-promo-slide-main-mobile rounded-[13px] max-w-full"
                    />
                    <Image
                      src={item.imageLaptop?.node?.sourceUrl}
                      alt="Image promotionnelle Automatisme Online"
                      width={1104}
                      height={300}
                      className="object-cover max-md:hidden aspect-promo-slide-main-laptop rounded-[13px]"
                    />
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="secondaryPromoSlider overflow-hidden md:max-w-[29.7%] h-full">
            <Swiper
              breakpoints={{
                0: {
                  slidesPerView: secondarySlider.length === 1 ? 1 : 1.2,
                },
                768: {
                  noSwiping: true,
                  allowTouchMove: false, // Désactiver le touch
                  pagination: false, // Enlever la pagination
                },
              }}
              spaceBetween={16}
              loop={true}
              pagination={{
                clickable: true,
              }}
              modules={[Pagination]}
              wrapperClass={`h-full md:gap-2 ${secondarySlider.length === 1 ? '' : 'md:flex md:flex-col'}`}
            >
              {secondarySlider.map((item, key) => (
                <SwiperSlide key={key}>
                  <Link href={item.slug || '/'} className="block md:h-full">
                    <Image
                      src={item.imageMobile?.node?.sourceUrl}
                      alt="Image promotionnelle Automatisme Online"
                      width={600}
                      height={600}
                      className={`object-cover md:hidden rounded-[13px] aspect-promo-slide-secondary-mobile max-w-full`}
                    />
                    <Image
                      src={item.imageLaptop?.node?.sourceUrl}
                      alt="Image promotionnelle Automatisme Online"
                      width={400}
                      height={300}
                      className={`object-cover max-md:hidden aspect-promo-slide-secondary-laptop rounded-[13px] max-h-1/2 w-full`}
                    />
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default HomePromoSection;
