import { CardProductProps } from '@/types/blocTypes';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/utils/constants/PLACHOLDERS';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const CardproductIntermediateCart = ({
  product,
}: {
  product: CardProductProps;
}) => {
  return (
    <article>
      <Link
        href={`/nos-produits/${product?.slug}`}
        className="md:max-w-[388px] group flex justify-between gap-6 items-center shadow-card px-4 md:px-6 py-2 rounded-lg duration-300 overflow-hidden group bg-white hover:shadow-cardhover text-primary"
      >
        <div className="h-24 md:h-[123px] w-auto flex items-center justify-center">
          <Image
            src={
              product?.featuredImage?.node?.sourceUrl ||
              PRODUCT_IMAGE_PLACEHOLDER
            }
            alt={product?.name}
            width={248}
            height={257}
            className="block h-full object-contain w-full"
          />
        </div>
        <div>
          <h3 className="mb-1 font-bold text-sm leading-general duration-300 max-md:line-clamp-2">
            {product?.name}
          </h3>
          <p className="text-dark-grey uppercase text-base leading-general">
            {product?.productRef || 'Référence produit'}
          </p>
        </div>
      </Link>
    </article>
  );
};

export default CardproductIntermediateCart;
