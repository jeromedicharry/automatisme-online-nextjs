import { CardProductProps } from '@/types/blocTypes';
import React from 'react';
import BlocIntroSmall from '../atoms/BlocIntroSmall';

const CartUpsellProducts = ({
  upsellProducts,
}: {
  upsellProducts: CardProductProps[];
}) => {
  return (
    <section>
      <BlocIntroSmall title="Complétez votre panier" />
    </section>
  );
};

export default CartUpsellProducts;
