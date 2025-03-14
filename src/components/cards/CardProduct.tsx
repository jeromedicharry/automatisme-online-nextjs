import { CardProductProps } from '@/types/blocTypes';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Heart } from '../SVG/Icons';
import AddToCart from '../Product/AddToCart';
import ProductPrice from '../Product/ProductPrice';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/utils/constants/PLACHOLDERS';

const Cardproduct = ({ product }: { product: CardProductProps }) => {
  // todo ajout aux favoris
  return (
    <article className="flex flex-col max-w-[250px] h-full shadow-card px-3 py-5 rounded-[7px] md:rounded-lg duration-300 overflow-hidden group bg-white hover:shadow-cardhover text-primary maw">
      <Link href={`/nos-produits/${product?.slug}`} className="group">
        <div className="relative min-h-[239px]">
          <div className="absolute inset-0 w-full flex items-center justify-center">
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
          <div className="bg-white flex justify-between items-center relative">
            <span className="px-[6px] rounded-[2px] h-[21px] flex items-center justify-center bg-primary-light text-xs leading-general font-bold">
              Choix AO
            </span>
            <span>
              <Heart />
            </span>
          </div>
        </div>
        <h3 className="mt-4 mb-1 font-bold text-base leading-general duration-300">
          {product?.name}
        </h3>
      </Link>

      <p className="text-dark-grey uppercase text-base leading-general mb-[10px]">
        {product?.sku}
      </p>
      <p className="mb-[10px]">Widget Avis vérifiés</p>
      <ProductPrice
        price={parseFloat(product?.price || '0')}
        regularPrice={parseFloat(product?.regularPrice || '0')}
        variant="card"
      />
      <div className="mt-auto">
        <AddToCart product={product} />
      </div>
    </article>
  );
};

export default Cardproduct;
