import { CardProductProps } from '@/types/blocTypes';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Heart } from '../SVG/Icons';
import AddToCart from '../Product/AddToCart.component';

const Cardproduct = ({ product }: { product: CardProductProps }) => {
  return (
    <article className="flex flex-col h-full shadow-card px-3 py-5 rounded-[7px] md:rounded-lg duration-300 overflow-hidden group bg-white hover:shadow-cardhover">
      <Link href={`/nos-produits/${product?.slug}`} className="group">
        <div className="relative min-h-[239px]">
          <div className="absolute inset-0 w-full flex items-center justify-center">
            <Image
              src={
                product?.featuredImage?.node?.sourceUrl ||
                '/images/logo-automatisme-online.png'
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
      <div className="font-bold text-2xl leading-general pr-7 relative w-fit mb-1">
        <div className="absolute text-sm font-bold right-0 top-0">TTC</div>
        <span className="text-base leading-general pr-1">{product?.price}</span>
        €
      </div>
      <small className="text-dark-grey line-through mb-4">
        {product?.regularPrice}€
      </small>
      <div className="mt-auto">
        <AddToCart product={product} />
      </div>
    </article>
  );
};

export default Cardproduct;
