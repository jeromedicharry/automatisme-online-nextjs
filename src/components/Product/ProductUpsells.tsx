import React from 'react';
import BlocIntroLarge from '../atoms/BlocIntroLarge';
import Container from '../container';
import { CardProductProps } from '@/types/blocTypes';
import Cardproduct from '../cards/CardProduct';

const ProductUpsells = ({
  upsellProducts,
}: {
  upsellProducts: CardProductProps[];
}) => {
  console.log('upsellProducts', upsellProducts);
  // todo revoir la logique avec isKit + confirmer le fonctinnement
  if (!upsellProducts || upsellProducts.length === 0) return null;
  return (
    <section className="bg-primary-light p-8 mb-16">
      <Container>
        <BlocIntroLarge
          title="Pour un kit optimal"
          subtitle="Automatisme Online vous recommande d’acheter ces produits complémentaires"
        />
        <div className="bg-white rounded-md py-4">
          <div className="flex flex-col md:flex-row items-start justify-between gap-5">
            {/* Conteneur des produits */}
            <div className="flex-1 flex gap-5 overflow-x-auto md:overflow-visible">
              {upsellProducts.map((product, index) => (
                <Cardproduct key={index} product={product} />
              ))}
            </div>

            {/* Bloc Total qui prend 1/4 de la largeur */}
            <div className="w-full md:w-1/4">Total</div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ProductUpsells;
