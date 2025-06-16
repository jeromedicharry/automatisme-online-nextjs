// import { CardProductProps } from '@/types/blocTypes';
import React from 'react';
import BlocIntroSmall from '../atoms/BlocIntroSmall';
import { CardProductProps } from '@/types/blocTypes';

const CartUpsellProducts = ({ products }: { products: CardProductProps[] }) => {
  if (!products || products.length === 0) return null;
  return (
    <section>
      <BlocIntroSmall title="Complétez votre panier" />
    </section>
  );
};

export default CartUpsellProducts;
