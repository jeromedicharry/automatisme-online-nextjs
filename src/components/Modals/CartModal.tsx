// Gère la modale du panier intermédiaire quand on ajoute un produit au panier
import React from 'react';
import Modal from './Modal';
import { useIntermediateCart } from '@/stores/IntermediateCartContext';
import { SuccessBadgeSvg } from '../SVG/Icons';
import Container from '../container';
import Cta from '../atoms/Cta';
import CardproductIntermediateCart from '../cards/CardProductIntermediateCart';
import SliderPrevNextButton from '../atoms/SliderPrevNextButton';
import { Swiper, SwiperSlide } from 'swiper/react';
import Cardproduct from '../cards/CardProduct';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import CardInstallation from '../cards/CardInstallation';

const CartModal: React.FC = () => {
  const {
    isCartModalOpen,
    closeCartModal,
    currentAddedProduct,
    relatedProducts,
    isKit,
    installationData,
  } = useIntermediateCart();

  // todo fix card height + check if we use related or upsell + check mobile

  return (
    <Modal isOpen={isCartModalOpen} onClose={closeCartModal} size="half-screen">
      <div className="min-h-full flex flex-col">
        {/* En-tête */}
        <div className="bg-primary text-white py-2 md:py-4">
          <Container>
            <div className="flex justify-between items-start text-sm md:text-base leading-general">
              <div className="flex gap-4">
                <div className="w-6 shrink-0">
                  <SuccessBadgeSvg />
                </div>
                <p>{currentAddedProduct?.name} a été ajouté au panier</p>
              </div>
              <button onClick={closeCartModal} className="text-xl">
                <span className="sr-only">Fermer</span>✕
              </button>
            </div>
          </Container>
        </div>
        <div className="px-5 md:px-6 py-4 md:py-8 flex flex-col flex-grow  basis-full gap-5 md:gap-6">
          {/* Produit ajouté */}
          {currentAddedProduct && (
            <div>
              <h2 className="text-xl font-medium leading-general border-l-[3px] border-secondary pl-2 text-primary mb-4">
                {'Votre produit a été ajouté au panier'}
              </h2>
              <CardproductIntermediateCart product={currentAddedProduct} />
            </div>
          )}

          {/* Produits associés */}
          {isKit ||
            (relatedProducts.length > 0 && (
              <div className="intermediate-cart-products-slider">
                <h2 className="text-xl font-medium leading-general border-l-[3px] border-secondary pl-2 text-primary">
                  {'Fréquemment acheté ensemble'}
                </h2>
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
                    {isKit && installationData && (
                      <SwiperSlide>
                        <CardInstallation installation={installationData} />
                      </SwiperSlide>
                    )}
                    {relatedProducts.map((product, key) => (
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
            ))}

          {/* Actions */}
          <div className="mt-auto flex flex-col gap-2 md:flex-row">
            <Cta
              variant="primaryHollow"
              label="Continuer mes recherches"
              handleButtonClick={closeCartModal}
              slug="#"
              isFull
            >
              Continuer mes recherches
            </Cta>
            <Cta
              handleButtonClick={closeCartModal}
              label="Voir le panier"
              slug="/panier"
              variant="primary"
              isFull
            >
              Voir le panier
            </Cta>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CartModal;
