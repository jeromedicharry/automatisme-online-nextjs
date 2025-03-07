import { CardProductProps } from '@/types/blocTypes';
import SliderPrevNextButton from '../atoms/SliderPrevNextButton';
import Cardproduct from '../cards/CardProduct';
import BlocIntroLarge from '../atoms/BlocIntroLarge';
const ProductCrossSells = ({
  crossSellProducts,
}: {
  crossSellProducts: CardProductProps[];
}) => {
  if (!crossSellProducts || crossSellProducts.length === 0) return null;

  return (
    <section className="mb-16">
      <div className="bg-primary-light p-4 rounded-2xl">
        <BlocIntroLarge
          title="Pour un kit optimal"
          subtitle="Automatisme Online recommande d’acheter ces deux produits complémentaires"
        />
        <div className="intermediate-cart-products-slider">
          <div className="overflow-hidden relative pb-12 lg:pb-16">
            <div className="px-2 pt-4 pb-5 flex item-stretch justify-center">
              {crossSellProducts.map((product, key) => (
                <div key={key} className="flex items-center">
                  <Cardproduct product={product} />
                  {key < crossSellProducts.length - 1 && (
                    <span className="mx-8 text-5xl font-bold">+</span>
                  )}
                </div>
              ))}
            </div>
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
